// Path: src\store\useProductStore.ts
import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductStore {
  selectedProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProducts: [],
  addProduct: (product) =>
    set((state) => ({
      selectedProducts: [...state.selectedProducts, product],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((p) => p.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p)),
    })),
  clearProducts: () => set({ selectedProducts: [] }),
}));
