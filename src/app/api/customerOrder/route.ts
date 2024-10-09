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

    // Log the incoming orderData and userId
    console.log('Received orderData:', orderData);
    console.log('Received userId:', userId);

    // Check for required fields
    if (!orderData || !userId || !Array.isArray(orderData.selectedProducts) || orderData.totalPrice == null) {
      return NextResponse.json({ error: 'Invalid order data or user ID' }, { status: 400 });
    }

    // Insert a new order into the `orders` table, linked to the user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_price: orderData.totalPrice,
        status: 'pending',
      })
      .select();

    if (orderError) {
      console.error('Error inserting order:', orderError);
      throw orderError;
    }

    const orderId = order[0]?.id;
    console.log('Inserted order ID:', orderId);

    // Insert each product from the order into the `order_items` table
    const insertPromises = orderData.selectedProducts.map(async (product) => {
      console.log('Inserting product:', product.name);
      console.log('Product ID:', product.id);
      console.log('Quantities:', orderData.quantities);

      const quantity = orderData.quantities?.[product.id] ?? 1; // Default to 1 if undefined

      const { data, error } = await supabase.from('order_items').insert({
        order_id: orderId,
        product_name: product.name,
        description: product.description || 'No description',
        short_description: product.shortDescription || 'No short description',
        quantity: String(quantity), // Use the fallback quantity here
        price: String(product.regular_price),
        image_url: product.images[0]?.src || '',
      });

      if (error) {
        console.error('Error inserting product:', product.name, error);
        throw error;
      }
      return data;
    });

    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Order stored successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error storing order:', error);
    return NextResponse.json({ error: 'Error storing order' }, { status: 500 });
  }
}
