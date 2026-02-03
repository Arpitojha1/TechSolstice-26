import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

interface RegisterTeamBody {
  eventId: string;
  eventName: string;
  teamName?: string;
  teammateIds?: string[];
}

interface TeammateProfile {
  user_id: string;
  solstice_id: string;
}

/**
 * POST /api/register-team
 * Creates a new team and registers captain + teammates for an event.
 * 
 * Validations:
 * - User authenticated
 * - User has complete profile with solstice_id
 * - Event exists and registration is open
 * - User not already registered for this event
 * - All teammate IDs are valid and not already registered
 * - Team size within event limits
 */
export async function POST(request: Request) {
  try {
    // 1. Authentication check
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body: RegisterTeamBody = await request.json();
    const { eventId, eventName, teamName, teammateIds } = body;

    // 2. Basic input validation
    if (!eventId || !eventName) {
      return NextResponse.json(
        { success: false, message: 'Event ID and name required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 3. Get event details and verify registration is open
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, min_team_size, max_team_size, is_reg_open')
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
        { success: false, message: 'Registration is closed for this event' },
        { status: 400 }
      );
    }

    const minSize = event.min_team_size || 1;
    const maxSize = event.max_team_size || 10;

    // 4. Get captain's profile
    const { data: captainProfile, error: profileError } = await supabase
      .from('profiles')
      .select('solstice_id')
      .eq('user_id', userId)
      .single();

    if (profileError || !captainProfile?.solstice_id) {
      return NextResponse.json(
        { success: false, message: 'Complete your profile (Solstice ID required) before registering' },
        { status: 400 }
      );
    }

    // 5. Check if captain is already registered for this event
    const { data: existingReg } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingReg) {
      return NextResponse.json(
        { success: false, message: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // 6. Clean and deduplicate teammate IDs
    const cleanTeammateIds = [...new Set(
      (teammateIds || [])
        .map((id: string) => id.trim().toUpperCase())
        .filter((id: string) => id !== '' && id !== captainProfile.solstice_id)
    )];

    // 7. Validate team size
    const totalMembers = 1 + cleanTeammateIds.length;
    if (totalMembers < minSize) {
      return NextResponse.json({
        success: false,
        message: `Team needs at least ${minSize} member${minSize > 1 ? 's' : ''}. You have ${totalMembers}.`
      }, { status: 400 });
    }
    if (totalMembers > maxSize) {
      return NextResponse.json({
        success: false,
        message: `Team can have at most ${maxSize} member${maxSize > 1 ? 's' : ''}. You have ${totalMembers}.`
      }, { status: 400 });
    }

    // 8. Validate all teammate IDs exist and are not registered
    let validatedTeammates: TeammateProfile[] = [];

    if (cleanTeammateIds.length > 0) {
      // Get profiles for all provided IDs
      const { data: teammateProfiles } = await supabase
        .from('profiles')
        .select('user_id, solstice_id')
        .in('solstice_id', cleanTeammateIds);

      // Check for invalid IDs (don't exist)
      const foundIds = new Set(teammateProfiles?.map(t => t.solstice_id) || []);
      const invalidIds = cleanTeammateIds.filter(id => !foundIds.has(id));

      if (invalidIds.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Invalid Solstice ID(s): $ { invalidIds.join(', ') }.These users don't exist.`
        }, { status: 400 });
      }

      // Check if any teammate is already registered for this event
      if (teammateProfiles && teammateProfiles.length > 0) {
        const { data: existingRegistrations } = await supabase
          .from('team_members')
          .select('solstice_id')
          .eq('event_id', eventId)
          .in('user_id', teammateProfiles.map(t => t.user_id));

        if (existingRegistrations && existingRegistrations.length > 0) {
          const registeredIds = existingRegistrations.map(r => r.solstice_id);
          return NextResponse.json({
            success: false,
            message: `Already registered for this event: ${registeredIds.join(', ')}. Each user can only be in one team per event.`
          }, { status: 400 });
        }

        validatedTeammates = teammateProfiles;
      }
    }

    // 9. Generate unique team code with retry
    let teamCode: string;
    let codeAttempts = 0;
    const maxCodeAttempts = 5;

    do {
      teamCode = 'TM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: existingCode } = await supabase
        .from('teams')
        .select('id')
        .eq('team_code', teamCode)
        .maybeSingle();

      if (!existingCode) break;
      codeAttempts++;
    } while (codeAttempts < maxCodeAttempts);

    if (codeAttempts >= maxCodeAttempts) {
      console.error('Failed to generate unique team code after max attempts');
      return NextResponse.json(
        { success: false, message: 'Server error generating team code. Please try again.' },
        { status: 500 }
      );
    }

    // 10. Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: (teamName?.trim()) || 'Solo Entry',
        team_code: teamCode,
        event_id: eventId,
        event_name: eventName,
        captain_id: userId
      })
      .select('id')
      .single();

    if (teamError) {
      console.error('Team creation error:', teamError);
      return NextResponse.json(
        { success: false, message: 'Failed to create team' },
        { status: 500 }
      );
    }

    // 11. Add captain as team member
    const { error: captainMemberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: userId,
        event_id: eventId,
        event_name: eventName,
        solstice_id: captainProfile.solstice_id,
        is_captain: true
      });

    if (captainMemberError) {
      // Rollback: delete team
      await supabase.from('teams').delete().eq('id', team.id);
      console.error('Captain member creation error:', captainMemberError);
      return NextResponse.json(
        { success: false, message: 'Failed to complete registration' },
        { status: 500 }
      );
    }

    // 12. Add all teammates (batch insert)
    if (validatedTeammates.length > 0) {
      const memberInserts = validatedTeammates.map(t => ({
        team_id: team.id,
        user_id: t.user_id,
        event_id: eventId,
        event_name: eventName,
        solstice_id: t.solstice_id,
        is_captain: false
      }));

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(memberInserts);

      if (membersError) {
        // Rollback: delete team and captain member
        await supabase.from('team_members').delete().eq('team_id', team.id);
        await supabase.from('teams').delete().eq('id', team.id);
        console.error('Team members creation error:', membersError);
        return NextResponse.json(
          { success: false, message: 'Failed to add teammates. Registration rolled back.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      teamId: team.id,
      teamCode,
      memberCount: 1 + validatedTeammates.length
    });

  } catch (error) {
    console.error('Register team error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
