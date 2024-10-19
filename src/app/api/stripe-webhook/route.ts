// Path: src\app\api\stripe-webhook\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

async function buffer(request: NextRequest): Promise<Buffer> {
  const readable = request.body;
  if (!readable) {
    throw new Error('Request body is missing');
  }

  const reader = readable.getReader();
  const chunks = [];
  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const signature = request.headers.get('stripe-signature') || '';

  try {
    const buf = await buffer(request);
    const rawBody = buf.toString('utf-8');

    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET as string);

    console.log('Stripe event received:', event);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      console.log('Order ID from metadata:', orderId);

      if (orderId) {
        const { error } = await supabase.from('orders').update({ status: 'betaald' }).eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }

        console.log('Order status updated successfully');
      } else {
        console.error('Order ID not found in session metadata');
        return NextResponse.json({ error: 'Order ID not found in session metadata' }, { status: 400 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Error handling Stripe webhook:', error);

    return NextResponse.json(
      { error: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 400 }
    );
  }
}
