import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

interface TeamMember {
  user_id: string;
  solstice_id: string;
  full_name: string;
  is_captain: boolean;
}

interface UpdateTeamBody {
  teamId: string;
  eventId: string;
  eventName?: string;
  newMemberIds?: string[];
}

interface DeleteTeamBody {
  teamId: string;
  action: 'leave' | 'delete';
}

/**
 * GET /api/team?eventId=xxx
 * Fetches user's team for a specific event.
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const supabase = await createClient();

    // Get user's team membership for this event
    const { data: membership, error: memberError } = await supabase
      .from('team_members')
      .select('team_id, is_captain')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (memberError) {
      console.error('Member lookup error:', memberError);
      return NextResponse.json(
        { success: false, message: 'Error looking up registration' },
        { status: 500 }
      );
    }

    if (!membership) {
      return NextResponse.json({ success: false, message: 'Not registered for this event' });
    }

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, team_code')
      .eq('id', membership.team_id)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Get all team members with their profiles in one query
    const { data: members } = await supabase
      .from('team_members')
      .select('user_id, solstice_id, is_captain')
      .eq('team_id', team.id);

    // Get member names from profiles
    const memberUserIds = members?.map(m => m.user_id) || [];

    let profileMap = new Map<string, string>();
    if (memberUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', memberUserIds);

      profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
    }

    const membersWithNames: TeamMember[] = members?.map(m => ({
      user_id: m.user_id,
      solstice_id: m.solstice_id,
      full_name: profileMap.get(m.user_id) || 'Unknown',
      is_captain: m.is_captain
    })) || [];

    // Sort: captain first
    membersWithNames.sort((a, b) => (b.is_captain ? 1 : 0) - (a.is_captain ? 1 : 0));

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        team_code: team.team_code,
        is_captain: membership.is_captain
      },
      members: membersWithNames
    });

  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team
 * Leave team (for members) or delete team (for captain).
 * Only allowed when registration is open.
 */
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body: DeleteTeamBody = await request.json();
    const { teamId, action } = body;

    if (!teamId) {
      return NextResponse.json(
        { success: false, message: 'Team ID required' },
        { status: 400 }
      );
    }

    if (action !== 'leave' && action !== 'delete') {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Use "leave" or "delete"' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const supabase = await createClient();

    // Get team info including event_id
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, event_id')
      .eq('id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json(
        { success: false, message: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if registration is still open for this event
    const { data: event } = await supabase
      .from('events')
      .select('is_reg_open')
      .eq('id', team.event_id)
      .single();

    if (!event?.is_reg_open) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify team - registration is closed for this event' },
        { status: 400 }
      );
    }

    // Get user's membership info
    const { data: membership } = await supabase
      .from('team_members')
      .select('is_captain')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json(
        { success: false, message: 'You are not a member of this team' },
        { status: 403 }
      );
    }

    if (action === 'delete') {
      // Only captain can delete team
      if (!membership.is_captain) {
        return NextResponse.json(
          { success: false, message: 'Only the captain can delete the team' },
          { status: 403 }
        );
      }

      // Delete all team members first, then team (if no cascade)
      await supabase.from('team_members').delete().eq('team_id', teamId);
      await supabase.from('teams').delete().eq('id', teamId);

      return NextResponse.json({ success: true, message: 'Team deleted' });

    } else {
      // Leave team - captain cannot leave
      if (membership.is_captain) {
        return NextResponse.json(
          { success: false, message: 'Captain cannot leave. Delete the team instead.' },
          { status: 400 }
        );
      }

      // Check if leaving would drop team below minimum
      const { data: event } = await supabase
        .from('events')
        .select('min_team_size')
        .eq('id', team.event_id)
        .single();

      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId);

      const currentSize = count || 0;
      const minSize = event?.min_team_size || 1;

      if (currentSize - 1 < minSize) {
        return NextResponse.json({
          success: false,
          message: `Cannot leave - team would have ${currentSize - 1} members, but minimum is ${minSize}. Ask captain to delete the team.`
        }, { status: 400 });
      }

      await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      return NextResponse.json({ success: true, message: 'Left team successfully' });
    }

  } catch (error) {
    console.error('Delete/leave team error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/team
 * Update team members (captain only).
 * Only allowed when registration is open.
 * Validates: no duplicates, no already-registered users, team size limits.
 */
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body: UpdateTeamBody = await request.json();
    const { teamId, eventId, eventName, newMemberIds } = body;

    if (!teamId || !eventId) {
      return NextResponse.json(
        { success: false, message: 'Team ID and Event ID required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const supabase = await createClient();

    // Check if registration is open
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('min_team_size, max_team_size, is_reg_open')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    if (!event.is_reg_open) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify team - registration is closed for this event' },
        { status: 400 }
      );
    }

    const minSize = event.min_team_size || 1;
    const maxSize = event.max_team_size || 10;

    // Verify user is captain of this team
    const { data: captainMember } = await supabase
      .from('team_members')
      .select('is_captain, solstice_id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!captainMember?.is_captain) {
      return NextResponse.json(
        { success: false, message: 'Only the captain can edit team members' },
        { status: 403 }
      );
    }

    // Clean and deduplicate new member IDs (excluding captain)
    const cleanMemberIds = [...new Set(
      (newMemberIds || [])
        .map((id: string) => id.trim().toUpperCase())
        .filter((id: string) => id !== '' && id !== captainMember.solstice_id)
    )];

    // Validate team size UPFRONT
    const totalMembers = 1 + cleanMemberIds.length; // captain + new members
    if (totalMembers < minSize) {
      return NextResponse.json({
        success: false,
        message: `Team needs at least ${minSize} member${minSize > 1 ? 's' : ''}. You're trying to have ${totalMembers}.`
      }, { status: 400 });
    }
    if (totalMembers > maxSize) {
      return NextResponse.json({
        success: false,
        message: `Team can have at most ${maxSize} member${maxSize > 1 ? 's' : ''}. You're trying to have ${totalMembers}.`
      }, { status: 400 });
    }

    // Validate all member IDs
    const invalidIds: string[] = [];
    const alreadyRegisteredIds: string[] = [];
    const membersToAdd: { user_id: string; solstice_id: string }[] = [];

    if (cleanMemberIds.length > 0) {
      // Get profiles for all IDs
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, solstice_id')
        .in('solstice_id', cleanMemberIds);

      // Check for invalid IDs
      const foundIds = new Set(profiles?.map(p => p.solstice_id) || []);
      for (const id of cleanMemberIds) {
        if (!foundIds.has(id)) {
          invalidIds.push(id);
        }
      }

      if (invalidIds.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Invalid Solstice ID(s): ${invalidIds.join(', ')}. These users don't exist.`,
          invalidIds
        }, { status: 400 });
      }

      // Check if any are registered for this event in ANOTHER team
      if (profiles && profiles.length > 0) {
        const { data: existingRegs } = await supabase
          .from('team_members')
          .select('user_id, solstice_id, team_id')
          .eq('event_id', eventId)
          .in('user_id', profiles.map(p => p.user_id));

        for (const p of profiles) {
          const existingReg = existingRegs?.find(r => r.user_id === p.user_id);

          if (existingReg && existingReg.team_id !== teamId) {
            // Registered in ANOTHER team - not allowed
            alreadyRegisteredIds.push(p.solstice_id);
          } else {
            // Either not registered, or in THIS team - can be added
            membersToAdd.push(p);
          }
        }
      }

      if (alreadyRegisteredIds.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Already in another team for this event: ${alreadyRegisteredIds.join(', ')}`,
          alreadyRegisteredIds
        }, { status: 400 });
      }
    }

    // All validations passed - now update

    // Remove all non-captain members
    await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('is_captain', false);

    // Add new members (batch insert)
    if (membersToAdd.length > 0) {
      const memberInserts = membersToAdd.map(m => ({
        team_id: teamId,
        user_id: m.user_id,
        event_id: eventId,
        event_name: eventName || '',
        solstice_id: m.solstice_id,
        is_captain: false
      }));

      const { error: insertError } = await supabase
        .from('team_members')
        .insert(memberInserts);

      if (insertError) {
        console.error('Member insert error:', insertError);
        return NextResponse.json(
          { success: false, message: 'Failed to add new members' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      memberCount: 1 + membersToAdd.length
    });

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
