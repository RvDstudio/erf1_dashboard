// Path: src\app\dashboard\orders\page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore'; // Import Zustand store for selected products
import { useTotalPrice } from '@/context/TotalPriceContext';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Session } from '@supabase/supabase-js';
import { Product } from '@/types/types';

export default function Order() {
  const { selectedProducts } = useProductStore(); // Get selected products from Zustand store
  const { getTotalPrice } = useTotalPrice();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      // Log the session data
      console.log('Fetched session:', session);
    };

    fetchSession();
  }, [supabase.auth]);

  const handleOrderSubmit = async () => {
    if (!session) {
      setErrorMessage('User not authenticated');
      console.error('User not authenticated');
      return;
    }

    const totalPrice = getTotalPrice();

    // Log selected products and total price
    console.log('Selected Products:', selectedProducts);
    console.log('Total Price:', totalPrice);
    console.log('Session User ID:', session?.user?.id);

    try {
      const response = await fetch('/api/customerOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: {
            selectedProducts,
            totalPrice,
          },
          userId: session?.user?.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setOrderSuccess(true);
        setErrorMessage('');
      } else {
        // Log the error response
        console.error('Error Response:', result);
        setErrorMessage(result.message || 'An error occurred while submitting your order.');
      }
    } catch (error) {
      // Catch and log any errors
      if (error instanceof Error) {
        console.error('Error submitting order:', error);
        setErrorMessage(`Error submitting order: ${error.message}`);
      } else {
        console.error('Unknown error submitting order:', error);
        setErrorMessage(`Unknown error submitting order: ${error}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="flex w-full items-center justify-between border border-gray-100 rounded-2xl bg-gray-50 dark:bg-[#414141] dark:border-[#242424] p-3 shadow-3xl shadow-xs mb-4"
          >
            <div className="flex items-center">
              <div className="w-full">
                <Image
                  className="h-[60px] w-[60px] md:w-[70px] md:h-[70px] rounded-lg"
                  src={(product as Product).images[0]?.src} // Type assertion to ensure TypeScript recognizes the type
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
                  € {Number(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <span>Quantity: {product.quantity}</span>
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
