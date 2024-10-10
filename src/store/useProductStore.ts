// Path: src\store\useProductStore.ts
import { create } from 'zustand';

interface Product {
  price: number;
  id: string;
  name: string;
  quantity: number;
}

interface ProductStore {
  selectedProducts: Product[];
  addProduct: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearProductQuantities: () => void; // Add function to clear product quantities
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProducts: [],
  addProduct: (product) =>
    set((state) => ({
      selectedProducts: [...state.selectedProducts, product],
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      ),
    })),
  clearProductQuantities: () =>
    set((state) => ({
      selectedProducts: state.selectedProducts.map((product) => ({
        ...product,
        quantity: 0, // Reset quantity to 0
      })),
    })),
}));
