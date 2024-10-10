// Path: src\components\ProductList.tsx
'use client';

import Image from 'next/image';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTotalPrice } from '@/context/TotalPriceContext';
import { PlusIcon } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore'; // Using the Zustand store
import { Product } from '@/types/types';

interface ProductListProps {
  products: Product[];
  category: string;
  price: number;
}

export default function ProductList({ products, category }: ProductListProps) {
  const { addProduct, updateQuantity, selectedProducts, clearProductQuantities } = useProductStore(); // Access clearProductQuantities
  const { setTotalPrice } = useTotalPrice();
  const router = useRouter();

  // Memoize the total price calculation
  const calculateTotalPrice = useCallback(() => {
    const total = selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
    setTotalPrice(category, total);
  }, [selectedProducts, setTotalPrice, category]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleProductClick = (product: Product) => {
    const productId = Number(product.id); // Convert id to number
    const existingProduct = selectedProducts.find((p) => p.id === productId);
    if (existingProduct) {
      updateQuantity(productId, existingProduct.quantity + 1);
    } else {
      addProduct({ ...product, id: productId, quantity: 1 }); // Ensure the id is stored as a number
    }
  };

  const handleInputChange = (productId: string, value: string) => {
    const quantity = parseInt(value, 10) || 0;
    updateQuantity(Number(productId), quantity); // Convert productId to number
  };

  // Redirect to the order page when clicking "Bestellen" and clear form on success
  const handleOrderClick = () => {
    // Assuming the order submission was successful, we clear the quantities
    clearProductQuantities(); // Clear the form by resetting quantities

    // Redirect to order page
    router.push('/dashboard/orders');
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => {
          const stockStatusText = product.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad';
          const stockStatusColor = product.stock_status === 'instock' ? 'bg-green-500/70' : 'bg-red-500/70';
          const productInCart = selectedProducts.find((p) => p.id === product.id);
          return (
            <div
              key={product.id}
              className="flex w-full items-center justify-between border border-gray-100 dark:border-[#242424] rounded-2xl bg-white dark:bg-[#414141] p-1 shadow-3xl shadow-xs hover:shadow-xl ease-in-out duration-300 cursor-pointer dark:!bg-navy-700 dark:shadow-none mb-4"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex items-center">
                <div className="w-full">
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
                  value={productInCart?.quantity || 0}
                  onChange={(e) => handleInputChange(product.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleOrderClick} // Updated to clear form and navigate to the order page
        className="flex items-center mt-4 pl-2 pr-4 py-1 text-sm bg-[#374c69] mb-6 text-white rounded-md"
      >
        <PlusIcon className="w-4 h-4 inline mr-1" />
        Bestellen
      </button>
    </div>
  );
}
