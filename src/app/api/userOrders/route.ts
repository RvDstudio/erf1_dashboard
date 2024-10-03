import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Extract user_id from query parameters
    const userId = req.nextUrl.searchParams.get('user_id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch orders related to the user_id
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}
