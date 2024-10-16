// Path: src\context\OrderContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Zuivel } from '@/types/types'; // Assuming types are defined in a separate file

interface OrderContextType {
  orderData: {
    selectedProducts: Zuivel[];
    quantities: { [key: string]: number };
  };
  setOrderData: (data: { selectedProducts: Zuivel[]; quantities: { [key: string]: number } }) => void;
  updateProductQuantity: (product: Zuivel, quantity: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderData, setOrderData] = useState<{
    selectedProducts: Zuivel[];
    quantities: { [key: string]: number };
  }>({ selectedProducts: [], quantities: {} });

  const updateProductQuantity = (product: Zuivel, quantity: number) => {
    setOrderData((prevData) => {
      const updatedQuantities = { ...prevData.quantities, [product.id]: quantity };

      // Check if the product is already selected and if the quantity is greater than 0
      let updatedSelectedProducts = prevData.selectedProducts.filter((p) => p.id !== product.id);

      if (quantity > 0) {
        updatedSelectedProducts = [...updatedSelectedProducts, product]; // Add or update product if quantity > 0
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
