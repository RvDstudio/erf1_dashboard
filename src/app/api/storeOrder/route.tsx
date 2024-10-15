// app/api/storeOrder/route.ts
import { NextResponse } from "next/server";

let orderData = { selectedProducts: [], quantities: {} };

export async function POST(request: Request) {
  const data = await request.json();
  orderData = data;
  return NextResponse.json({ message: "Order data saved" });
}

export async function GET() {
  return NextResponse.json(orderData);
}
