// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const { orderData, userId } = await req.json();

    // Check for required fields
    if (!orderData || !userId || !Array.isArray(orderData.selectedProducts)) {
      return NextResponse.json({ error: 'Invalid order data or user ID' }, { status: 400 });
    }

    // Insert each product from the orderData into the database
    const insertPromises = orderData.selectedProducts.map((product: any) => {
      return db.insert(products).values({
        product_name: product.name,
        description: product.description || 'No description',
        short_description: product.shortDescription || 'No short description',
        quantity: String(orderData.quantities[product.id]),
        price: String(product.regular_price),
        image_url: product.images[0]?.src || '',
        user_id: userId, // Store the user ID with each product entry if desired
      });
    });

    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Order stored successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error storing order:', error);
    return NextResponse.json({ error: 'Error storing order' }, { status: 500 });
  }
}
