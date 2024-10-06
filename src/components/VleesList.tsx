// components/VleesList.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Vlees } from '@/types/types';
import { useTotalPrice } from '@/context/TotalPriceContext';
import { PlusIcon } from 'lucide-react';

interface VleesListProps {
  vlees: Vlees[];
  initialQuantities?: { [key: string]: number };
}

export default function VleesList({ vlees, initialQuantities = {} }: VleesListProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(initialQuantities);
  const { setTotalPrice } = useTotalPrice();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const total = vlees.reduce((total, vlees) => {
      const quantity = quantities[vlees.id] || 0;
      return total + Number(vlees.regular_price) * quantity;
    }, 0);
    setTotalPrice('vlees', total);
  }, [quantities, vlees, setTotalPrice]);

  const handleInputChange = (vleesId: string, value: string) => {
    const quantity = parseInt(value, 10) || 0;
    setQuantities((prev) => ({
      ...prev,
      [vleesId]: quantity,
    }));
  };

  const handleProductClick = (vleesId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [vleesId]: (prev[vleesId] || 0) + 1,
    }));
  };
  const handleOrder = async () => {
    const { data: session } = await supabase.auth.getSession();

    if (!session) {
      alert('You must be logged in to place an order.');
      return;
    }

    const selectedProducts = vlees.filter((v) => quantities[v.id] > 0);

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
        {vlees.map((vlees: Vlees) => {
          const stockStatusText = vlees.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad';
          const stockStatusColor = vlees.stock_status === 'instock' ? 'bg-green-500/70' : 'bg-red-500/70';
          return (
            <div
              key={vlees.id}
              className="flex w-full items-center justify-between border border-gray-100 dark:border-[#242424] rounded-2xl bg-white dark:bg-[#414141] p-1 shadow-3xl shadow-xs hover:shadow-xl ease-in-out duration-300 cursor-pointer dark:!bg-navy-700 dark:shadow-none mb-4"
              onClick={() => handleProductClick(vlees.id)}
            >
              <div className="flex items-center">
                <div className="w-full">
                  <div>
                    <Image
                      className="h-[60px] w-[60px] md:w-[70px] md:h-[70px] rounded-lg"
                      src={vlees.images[0].src}
                      alt="vlees image"
                      loading="lazy"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>

              <div className="pl-4 pr-4 flex flex-col w-full">
                <div className="text-sm md:text-base font-medium text-navy-700 dark:text-gray-300 mb-2">
                  {vlees.name}
                </div>
                <div className="relative flex justify-between">
                  <div className={`text-xs text-white px-2 py-0.5 rounded ${stockStatusColor}`}>{stockStatusText}</div>
                  <div className="absolute right-0 -top-0 text-sm font-bold text-gray-300">
                    € {Number(vlees.regular_price).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
                <input
                  type="text"
                  className="w-10 h-10 rounded-md bg-[#374c69] text-gray-100 text-center"
                  placeholder="0"
                  value={quantities[vlees.id] || 0}
                  onChange={(e) => handleInputChange(vlees.id, e.target.value)}
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
