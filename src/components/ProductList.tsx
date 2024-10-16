// Path: src\components\ProductList.tsx
'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTotalPrice } from '@/context/TotalPriceContext';
import { PlusIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Zuivel, Vlees, Kaas } from '@/types/types';
import { useOrder } from '@/context/OrderContext'; // Import Order Context

interface ProductListProps {
  products: (Zuivel | Vlees | Kaas)[];
  category: 'zuivel' | 'vlees' | 'kaas';
}

export default function ProductList({ products, category }: ProductListProps) {
  const { orderData, updateProductQuantity } = useOrder(); // Use Order Context
  const { setTotalPrice } = useTotalPrice();
  const router = useRouter();
  const supabase = createClient();

  const quantities = orderData.quantities; // Get quantities from Order Context

  useEffect(() => {
    const total = products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0; // Safely access the quantity
      return total + Number(product.regular_price) * quantity;
    }, 0);
    setTotalPrice(category, total); // Set total price for the current category
  }, [quantities, products, setTotalPrice, category]);

  const handleInputChange = (productId: string, value: string, product: Zuivel | Vlees | Kaas) => {
    const quantity = parseInt(value, 10) || 0;
    updateProductQuantity(product as Zuivel, quantity); // Update quantity in Order Context
  };

  const handleProductClick = (productId: string, product: Zuivel | Vlees | Kaas) => {
    const currentQuantity = quantities?.[productId] || 0;
    updateProductQuantity(product as Zuivel, currentQuantity + 1); // Increment quantity in Order Context
  };

  const handleOrder = async () => {
    const { data: session } = await supabase.auth.getSession();

    if (!session) {
      alert('You must be logged in to place an order.');
      return;
    }

    const selectedProducts = products.filter((p) => quantities?.[p.id] > 0);

    await fetch('/api/storeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.session?.access_token}`,
      },
      body: JSON.stringify({ selectedProducts, quantities }),
    });

    router.push('/dashboard/orders');
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const stockStatusText = product.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad';
          const stockStatusColor = product.stock_status === 'instock' ? 'bg-green-500/70' : 'bg-red-500/70';
          return (
            <div
              key={product.id}
              className="flex w-full items-center justify-between border border-gray-100 dark:border-[#242424] rounded-2xl bg-white dark:bg-[#414141] p-1 shadow-3xl shadow-xs hover:shadow-xl ease-in-out duration-300 cursor-pointer dark:!bg-navy-700 dark:shadow-none mb-4"
              onClick={() => handleProductClick(product.id, product)}
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
                  value={quantities?.[product.id] || 0} // Safely access quantities
                  onChange={(e) => handleInputChange(product.id, e.target.value, product)}
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
