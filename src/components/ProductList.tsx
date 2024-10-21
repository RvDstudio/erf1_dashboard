// Path: src\components\ProductList.tsx
'use client';

import Image from 'next/image';
import { useEffect, useCallback } from 'react';
import { useTotalPrice } from '@/context/TotalPriceContext';
import { createClient } from '@/utils/supabase/client';
import { Zuivel, Vlees, Kaas } from '@/types/types';
import { useOrder } from '@/context/OrderContext'; // Use Order Context
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  products: (Zuivel | Vlees | Kaas)[];
  category: 'zuivel' | 'vlees' | 'kaas';
}

export default function ProductList({ products, category }: ProductListProps) {
  const { orderData, updateProductQuantity } = useOrder(); // Use Order Context
  const { quantities } = orderData;
  const { setTotalPrice } = useTotalPrice();
  const supabase = createClient();
  const router = useRouter(); // Initialize the router hook

  // Update total price for the category
  useEffect(() => {
    const total = products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0;
      return total + Number(product.regular_price) * quantity;
    }, 0);
    setTotalPrice(category, total);
  }, [quantities, products, setTotalPrice, category]);

  const handleInputChange = useCallback(
    (product: Zuivel | Vlees | Kaas, value: string) => {
      const quantity = parseInt(value, 10) || 0;
      updateProductQuantity(product, quantity); // Update quantity in Order Context
    },
    [updateProductQuantity]
  );

  const handleProductClick = useCallback(
    (product: Zuivel | Vlees | Kaas) => {
      const newQuantity = (quantities[product.id] || 0) + 1;
      updateProductQuantity(product, newQuantity); // Increment quantity in Order Context
    },
    [quantities, updateProductQuantity]
  );

  const handleOrder = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      alert('You must be logged in to place an order.');
      return;
    }

    const selectedProducts = orderData.selectedProducts;

    await fetch('/api/storeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ selectedProducts, quantities }),
    });

    router.push('/dashboard/orders');
  }, [orderData.selectedProducts, quantities, router, supabase.auth]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const stockStatusText = product.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad';
          const stockStatusColor = product.stock_status === 'instock' ? 'bg-green-500/70' : 'bg-red-500/70';

          return (
            <div
              key={product.id}
              className="flex w-full items-center justify-between border border-gray-100 dark:border-[#242424] rounded-2xl bg-white dark:bg-[#414141] p-1 px-2 shadow-3xl shadow-xs hover:shadow-xl ease-in-out duration-300 cursor-pointer dark:!bg-navy-700 dark:shadow-none mb-2"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex items-center">
                <div className="w-full">
                  <Image
                    className="h-[60px] w-[60px] md:w-[70px] md:h-[70px] rounded-lg"
                    src={product.images[0]?.src}
                    alt={`${category} image`}
                    loading="lazy"
                    width={500}
                    height={500}
                  />
                </div>
              </div>

              <div className="pl-4 pr-4 flex flex-col w-full">
                <div className="text-sm md:text-base font-medium text-navy-700 dark:text-gray-300 mb-2">
                  {product.name}
                </div>
                <div className="relative flex justify-between">
                  <div className={`text-xs text-white px-2 py-0.5 rounded ${stockStatusColor}`}>{stockStatusText}</div>
                  <div className="absolute right-0 -top-0 text-sm font-bold text-gray-300">
                    € {Number(product.regular_price).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
                <input
                  type="text"
                  className="w-10 h-10 rounded-md bg-[#374c69] text-gray-100 text-center"
                  placeholder="0"
                  value={quantities[product.id] || 0}
                  onChange={(e) => handleInputChange(product, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleOrder}
        className="flex items-center mt-4 pl-2 pr-4 py-1 text-sm bg-[#374c69] mb-6 text-white rounded-md"
      >
        <PlusIcon className="w-4 h-4 inline mr-1" />
        Bestellen
      </button>
    </div>
  );
}
