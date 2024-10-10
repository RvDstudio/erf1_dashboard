// Path: src\app\api\customerOrder\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  regular_price: string;
  quantity: number;
  images: { src: string }[];
}

interface OrderData {
  selectedProducts: Product[];
  totalPrice: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { orderData, userId }: { orderData: OrderData; userId: string } = await req.json();

    console.log('Received orderData:', orderData);
    console.log('Received userId:', userId);

    // Check if user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Check for duplicate orders in the last 10 seconds
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .gt('created_at', new Date(Date.now() - 10000).toISOString());

    if (existingOrders?.length) {
      return NextResponse.json({ error: 'Duplicate order detected' }, { status: 400 });
    }

    // Insert new order into 'orders' table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_price: orderData.totalPrice,
        status: 'pending',
      })
      .select(); // Ensure .select() returns the inserted data

    if (orderError || !order || order.length === 0) {
      throw new Error('Error inserting order');
    }

    const orderId = order[0].id;

    // Insert each product into the 'order_items' table
    const insertPromises = orderData.selectedProducts.map(async (product: Product) => {
      const { error } = await supabase.from('order_items').insert({
        order_id: orderId,
        product_name: product.name,
        quantity: product.quantity, // Use the correct type here
        price: product.regular_price, // Assuming price is stored as string
        image_url: product.images[0]?.src || '', // Fallback for missing image
      });

      if (error) {
        throw error; // Throw error to ensure it gets caught
      }
    });

    await Promise.all(insertPromises); // Ensure all product insertions are done before returning

    return NextResponse.json({ message: 'Order stored successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error storing order:', error); // Log the actual error for debugging
    return NextResponse.json({ error: 'Error storing order' }, { status: 500 });
  }
}
