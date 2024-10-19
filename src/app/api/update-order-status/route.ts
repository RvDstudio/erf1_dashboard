// Path: src\app\api\update-order-status\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    const supabase = createClient();

    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Internal Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}
