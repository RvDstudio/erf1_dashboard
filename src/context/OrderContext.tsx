// Path: src\context\OrderContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/types'; // Assuming this is a generic type for products

interface OrderContextType {
  orderData: {
    selectedProducts: Product[];
    quantities: { [key: string]: number };
  };
  setOrderData: (data: { selectedProducts: Product[]; quantities: { [key: string]: number } }) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderData, setOrderData] = useState<{
    selectedProducts: Product[];
    quantities: { [key: string]: number };
  }>({ selectedProducts: [], quantities: {} });

  const mergeOrderData = (newData: { selectedProducts: Product[]; quantities: { [key: string]: number } }) => {
    setOrderData((prevData) => {
      const newSelectedProducts = [...prevData.selectedProducts];
      const newQuantities = { ...prevData.quantities };

      // Merge quantities and avoid duplicates in selected products
      newData.selectedProducts.forEach((product) => {
        if (!newSelectedProducts.find((p) => p.id === product.id)) {
          newSelectedProducts.push(product);
        }
        newQuantities[product.id] = (newQuantities[product.id] || 0) + (newData.quantities[product.id] || 0);
      });

      return {
        selectedProducts: newSelectedProducts,
        quantities: newQuantities,
      };
    });
  };

  return <OrderContext.Provider value={{ orderData, setOrderData: mergeOrderData }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
