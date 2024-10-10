// Path: src\app\api\storeOrder\route.tsx
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { orderData, userId } = await request.json();

  if (!orderData || !userId) {
    return NextResponse.json({ error: 'Invalid order data or user ID' }, { status: 400 });
  }

  // Store the order data in Supabase, linked to the userId
  const { data, error } = await supabase
    .from('store_orders')
    .insert({ user_id: userId, order_data: orderData })
    .select();

  if (error) {
    console.error('Error saving order data:', error);
    return NextResponse.json({ error: 'Failed to save order data' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Order data saved', data });
}

export async function GET(request: Request) {
  const userId = request.headers.get('user-id'); // Assuming you're passing userId in headers

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Fetch the order data for the specific user
  const { data, error } = await supabase.from('store_orders').select('order_data').eq('user_id', userId).single();

  if (error) {
    console.error('Error fetching order data:', error);
    return NextResponse.json({ error: 'Failed to fetch order data' }, { status: 500 });
  }

  return NextResponse.json(data);
}
