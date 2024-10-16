// Path: src\context\OrderContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Zuivel, Vlees, Kaas } from '@/types/types';

// Define a common product type (combining Zuivel, Vlees, and Kaas)
type Product = Zuivel | Vlees | Kaas;

interface OrderContextType {
  orderData: {
    selectedProducts: Product[];
    quantities: { [key: string]: number };
  };
  setOrderData: (data: { selectedProducts: Product[]; quantities: { [key: string]: number } }) => void;
  updateProductQuantity: (product: Product, quantity: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderData, setOrderData] = useState<{
    selectedProducts: Product[];
    quantities: { [key: string]: number };
  }>({ selectedProducts: [], quantities: {} });

  const updateProductQuantity = (product: Product, quantity: number) => {
    setOrderData((prevData) => {
      const updatedQuantities = { ...prevData.quantities, [product.id]: quantity };

      let updatedSelectedProducts = [...prevData.selectedProducts];

      // Find product by ID in the selected products
      const productIndex = prevData.selectedProducts.findIndex((p) => p.id === product.id);

      if (quantity > 0) {
        if (productIndex !== -1) {
          // Update product if it exists
          updatedSelectedProducts[productIndex] = { ...product };
        } else {
          // Add new product if it does not exist
          updatedSelectedProducts.push(product);
        }
      } else {
        // Remove product if quantity is zero
        updatedSelectedProducts = updatedSelectedProducts.filter((p) => p.id !== product.id);
      }

      return {
        selectedProducts: updatedSelectedProducts,
        quantities: updatedQuantities,
      };
    });
  };

  return (
    <OrderContext.Provider value={{ orderData, setOrderData, updateProductQuantity }}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
