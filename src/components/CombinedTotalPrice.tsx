'use client';
// components/CombinedTotalPrice.tsx

import { useTotalPrice } from '@/context/TotalPriceContext';

export default function CombinedTotalPrice() {
  const { getTotalPrice } = useTotalPrice();
  const totalPrice = getTotalPrice();

  return (
    <div className="">
      <h2 className="text-md">
        De totale Prijs is: € <span className="font-bold text-[#374c69]">{totalPrice.toFixed(2)}</span>
      </h2>
    </div>
  );
}
