/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category is required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Fetch events with team counts for the specific category
    // This uses the Service Role key (Admin Client) to bypass RLS on the 'teams' table
    const { data: events, error } = await supabase
      .from('events')
      .select('id, teams(count)')
      .eq('category', category);

    if (error) {
      console.error('Error fetching event stats:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Transform the data into a map of { eventId: count }
    const stats: Record<string, number> = {};
    events?.forEach((event: any) => {
      stats[event.id] = event.teams?.[0]?.count || 0;
    });

    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
