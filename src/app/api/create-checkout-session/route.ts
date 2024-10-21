// Path: src\app\api\create-checkout-session\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    const supabase = createClient();

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, price, quantity')
      .eq('order_id', orderId);

    if (itemsError || !orderItems) {
      return NextResponse.json({ error: 'Order items not found' }, { status: 404 });
    }

    const lineItems = orderItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/order_history/${orderId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/order_history/${orderId}?canceled=true`,
      metadata: {
        orderId: String(orderId), // Ensure orderId is passed as a string
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
