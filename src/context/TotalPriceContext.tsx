"use client";
// context/TotalPriceContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface TotalPriceContextType {
  totalPrices: { [key: string]: number };
  setTotalPrice: (category: string, price: number) => void;
  getTotalPrice: () => number;
}

const TotalPriceContext = createContext<TotalPriceContextType | undefined>(
  undefined
);

export const TotalPriceProvider = ({ children }: { children: ReactNode }) => {
  const [totalPrices, setTotalPrices] = useState<{ [key: string]: number }>({});

  const setTotalPrice = useCallback((category: string, price: number) => {
    setTotalPrices((prev) => ({
      ...prev,
      [category]: price,
    }));
  }, []);

  const getTotalPrice = useCallback(() => {
    return Object.values(totalPrices).reduce((sum, price) => sum + price, 0);
  }, [totalPrices]);

  return (
    <TotalPriceContext.Provider
      value={{ totalPrices, setTotalPrice, getTotalPrice }}
    >
      {children}
    </TotalPriceContext.Provider>
  );
};

export const useTotalPrice = () => {
  const context = useContext(TotalPriceContext);
  if (!context) {
    throw new Error("useTotalPrice must be used within a TotalPriceProvider");
  }
  return context;
};
