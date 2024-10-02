'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Zuivel } from '@/types'; // Assuming types are defined in a separate file
import { useOrder } from '@/context/OrderContext';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client

export default function Order() {
  const { orderData, setOrderData } = useOrder();
  const [orderSuccess, setOrderSuccess] = useState(false); // State for order success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [session, setSession] = useState(null); // State for session
  const supabase = createClient();

  useEffect(() => {
    const fetchSessionAndOrderData = async () => {
      // Fetch the current session from Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      // Fetch the order data
      const response = await fetch('/api/storeOrder');
      const data = await response.json();
      setOrderData(data);
    };

    fetchSessionAndOrderData();
  }, [setOrderData]);

  const handleOrderSubmit = async () => {
    if (!session) {
      // Check if session exists
      setErrorMessage('User not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/customerOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData, userId: session.user.id }), // Use the Supabase session user ID
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        setOrderSuccess(true); // Set success message
        setErrorMessage(''); // Clear any previous error messages
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
        {orderData.selectedProducts.map((product: Zuivel) => (
          <div
            key={product.id}
            className="flex w-full items-center justify-between border border-gray-100 rounded-2xl bg-gray-50 dark:bg-[#414141] dark:border-[#242424] p-3 shadow-3xl shadow-xs mb-4"
          >
            <div className="flex items-center">
              <div className="w-full">
                <div>
                  <Image
                    className="h-[60px] w-[60px] md:w-[70px] md:h-[70px] rounded-lg"
                    src={product.images[0].src}
                    alt="product image"
                    loading="lazy"
                    width={500}
                    height={500}
                  />
                </div>
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
