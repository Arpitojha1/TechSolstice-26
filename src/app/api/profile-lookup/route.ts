import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

// Validate solstice ID format (e.g., TS-XXXXXX)
const SOLSTICE_ID_PATTERN = /^TS-[A-Z0-9]{4,10}$/i;

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
    const rawId = searchParams.get('solsticeId');

    if (!rawId) {
      return NextResponse.json(
        { success: false, message: 'Solstice ID required' },
        { status: 400 }
      );
    }

    // Sanitize and validate input
    const solsticeId = rawId.trim().toUpperCase();

    if (!SOLSTICE_ID_PATTERN.test(solsticeId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Solstice ID format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, solstice_id')
      .eq('solstice_id', solsticeId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ success: false, message: 'Profile not found' });
    }

    return NextResponse.json({
      success: true,
      profile: {
        full_name: profile.full_name,
        solstice_id: profile.solstice_id
      }
    });

  } catch (error) {
    console.error('Profile lookup error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
