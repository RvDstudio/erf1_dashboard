// components/KaasList.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Kaas } from "@/types";
import { useTotalPrice } from "../context/TotalPriceContext";

interface KaasListProps {
  kaas: Kaas[];
  initialQuantities?: { [key: string]: number };
}

export default function KaasList({
  kaas,
  initialQuantities = {},
}: KaasListProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    initialQuantities
  );
  const { setTotalPrice } = useTotalPrice();

  useEffect(() => {
    const total = kaas.reduce((total, kaas) => {
      const quantity = quantities[kaas.id] || 0;
      return total + Number(kaas.regular_price) * quantity;
    }, 0);
    setTotalPrice("kaas", total);
  }, [quantities, kaas, setTotalPrice]);

  const handleInputChange = (kaasId: string, value: string) => {
    const quantity = parseInt(value, 10) || 0;
    setQuantities((prev) => ({
      ...prev,
      [kaasId]: quantity,
    }));
  };

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kaas.map((kaas: Kaas) => {
        const stockStatusText =
          kaas.stock_status === "instock" ? "Op voorraad" : "Niet op voorraad";
        const stockStatusColor =
          kaas.stock_status === "instock" ? "bg-green-500/70" : "bg-red-500/70";
        return (
          <div
            key={kaas.id}
            className="flex w-full items-center justify-between border border-gray-100 rounded-2xl bg-white p-1 shadow-3xl shadow-xs hover:shadow-xl ease-in-out duration-300 cursor-pointer dark:!bg-navy-700 dark:shadow-none mb-4"
          >
            <div className="flex items-center">
              <div className="w-full">
                <div>
                  <Image
                    className="h-[60px] w-[60px]  md:w-[70px] md:h-[70px] rounded-lg"
                    src={kaas.images[0].src}
                    alt="kaas image"
                    loading="lazy"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>

            <div className="pl-4 pr-4 flex flex-col w-full">
              <div className="text-sm md:text-base font-medium text-navy-700 dark:text-white mb-2">
                {kaas.name}
              </div>
              <div className="relative flex justify-between">
                <div
                  className={`text-xs text-white px-2 py-0.5 rounded ${stockStatusColor}`}
                >
                  {stockStatusText}
                </div>
                <div className="absolute right-0 -top-0 md:-top-4 text-sm font-bold text-gray-700">
                  € {Number(kaas.regular_price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <input
                type="text"
                className="w-10 h-10 rounded-md bg-gray-100 text-center"
                placeholder="0"
                onChange={(e) => handleInputChange(kaas.id, e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
