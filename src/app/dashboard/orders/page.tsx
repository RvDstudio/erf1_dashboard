'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useOrder } from '@/context/OrderContext';
import { useTotalPrice } from '@/context/TotalPriceContext'; // Use this to get total price
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Session } from '@supabase/supabase-js'; // Import the Session type from Supabase

export default function Order() {
  const { orderData, setOrderData } = useOrder();
  const { getTotalPrice } = useTotalPrice(); // Get total price from the context
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [session, setSession] = useState<Session | null>(null); // Set the type as Session | null
  const supabase = createClient();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchSessionAndOrderData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      const response = await fetch('/api/storeOrder');
      const data = await response.json();
      setOrderData(data);
    };

    fetchSessionAndOrderData();
  }, [setOrderData, supabase.auth]);

  const handleOrderSubmit = async () => {
    if (!session) {
      setErrorMessage('User not authenticated');
      return;
    }

    const totalPrice = getTotalPrice(); // Fetch total price

    try {
      const response = await fetch('/api/customerOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: {
            ...orderData, // Include selected products and other details
            totalPrice: totalPrice, // Pass the total price to the API
          },
          userId: session?.user?.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setOrderSuccess(true);
        setErrorMessage('');
        router.push('/dashboard/order_history'); // Redirect to order history after successful order
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMessage('Error submitting order');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderData.selectedProducts.map((product) => (
          <div
            key={product.id}
            className="flex w-full items-center justify-between border border-gray-100 rounded-2xl bg-gray-50 dark:bg-[#414141] dark:border-[#242424] p-3 shadow-3xl shadow-xs mb-4"
          >
            <div className="flex items-center">
              <div className="w-full">
                <Image
                  className="h-[60px] w-[60px] md:w-[70px] md:h-[70px] rounded-lg"
                  src={product.images[0]?.src}
                  alt="product image"
                  width={70}
                  height={70}
                />
              </div>
            </div>

            <div className="pl-4 pr-4 flex flex-col w-full">
              <div className="text-sm md:text-base font-medium text-navy-700 dark:text-white mb-2">{product.name}</div>
              <div className="relative flex justify-between">
                <div className="absolute right-0 -top-0 text-sm font-bold text-gray-700">
                  € {Number(product.regular_price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <span>Quantity: {orderData.quantities[product.id]}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-[#374C69] text-white p-2 rounded mt-4" onClick={handleOrderSubmit}>
        Place Order
      </button>
      {orderSuccess && <div className="mt-4 text-green-600 font-bold">Your order has been successfully booked!</div>}
      {errorMessage && <div className="mt-4 text-red-600 font-bold">{errorMessage}</div>}
    </div>
  );
}
