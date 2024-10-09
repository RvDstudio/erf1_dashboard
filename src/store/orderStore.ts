// Path: src/store/orderStore.ts
import { create } from 'zustand';
import { Product } from '@/types/types';

interface OrderState {
  selectedProducts: Product[];
  quantities: { [key: string]: number };
  addProduct: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  selectedProducts: [],
  quantities: {},

  // Add product logic
  addProduct: (product: Product) =>
    set((state: OrderState) => {
      const existingProduct = state.selectedProducts.find((p: Product) => p.id === product.id);

      // If the product exists, we do not modify the quantity, just return the state
      if (existingProduct) {
        return {
          ...state,
        };
      }

      // If the product doesn't exist, add it to selectedProducts and set its quantity to 1
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, product],
        quantities: {
          ...state.quantities,
          [product.id]: (state.quantities[product.id] || 0) + 1, // Only increase the quantity for new products
        },
      };
    }),

  // Set quantity for a specific product
  setQuantity: (productId: string, quantity: number) =>
    set((state: OrderState) => ({
      quantities: {
        ...state.quantities,
        [productId]: quantity, // Update the specific product quantity
      },
    })),

  // Clear the order
  clearOrder: () =>
    set(() => ({
      selectedProducts: [],
      quantities: {},
    })),
}));
