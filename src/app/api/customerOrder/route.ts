// Path: src\app\api\customerOrder\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { orderData, userId } = await req.json();

    // Log the incoming request data for debugging
    console.log('Order Data:', orderData);
    console.log('User ID:', userId);

    // Check for required fields
    if (!orderData || !userId || !Array.isArray(orderData.selectedProducts) || orderData.totalPrice == null) {
      return NextResponse.json({ error: 'Invalid order data or user ID' }, { status: 400 });
    }

    // Insert a new order into the `orders` table, linked to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_price: orderData.totalPrice, // Make sure totalPrice is included
        status: 'pending', // or another appropriate status
      })
      .select();

    if (orderError) {
      console.error('Error inserting order:', orderError); // Log the error
      throw orderError;
    }

    const orderId = order[0]?.id;
    console.log('New Order ID:', orderId); // Log the new order ID

    // Insert each product from the order into the `order_items` table
    const insertPromises = orderData.selectedProducts.map(
      async (product: {
        name: string;
        description: string;
        shortDescription: string;
        id: string;
        regular_price: number;
        images: { src: string }[];
      }) => {
        console.log('Inserting product:', product.name); // Log the product being inserted
        const { data, error } = await supabase.from('order_items').insert({
          order_id: orderId,
          product_name: product.name,
          description: product.description || 'No description',
          short_description: product.shortDescription || 'No short description',
          quantity: String(orderData.quantities[product.id]),
          price: String(product.regular_price),
          image_url: product.images[0]?.src || '',
        });

        if (error) {
          console.error('Error inserting product:', product.name, error); // Log the error with the product
          throw error; // Handle error
        }
        return data;
      }
    );

    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Order stored successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error storing order:', error); // Log the error globally
    return NextResponse.json({ error: 'Error storing order' }, { status: 500 });
  }
}
