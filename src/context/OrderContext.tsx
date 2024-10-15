'use client';
// context/OrderContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Zuivel } from '@/types/types'; // Assuming types are defined in a separate file

interface OrderContextType {
  orderData: {
    selectedProducts: Zuivel[];
    quantities: { [key: string]: number };
  };
  setOrderData: (data: { selectedProducts: Zuivel[]; quantities: { [key: string]: number } }) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderData, setOrderData] = useState<{
    selectedProducts: Zuivel[];
    quantities: { [key: string]: number };
  }>({ selectedProducts: [], quantities: {} });

  return <OrderContext.Provider value={{ orderData, setOrderData }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
