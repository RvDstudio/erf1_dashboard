// Path: src\store\CartProduct.tsx
import { create } from 'zustand';

type CartProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

type CartStore = {
  products: CartProduct[];
  isOpen: boolean;
  addProduct: (product: CartProduct) => void;
  removeProduct: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  toggleCart: (isOpen: boolean) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  products: [],
  isOpen: false,
  addProduct: (product) =>
    set((state) => {
      const existingProduct = state.products.find((p) => p.id === product.id);
      if (existingProduct) {
        return {
          products: state.products.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)),
        };
      }
      return { products: [...state.products, { ...product, quantity: 1 }] };
    }),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  incrementQuantity: (id) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)),
    })),
  decrementQuantity: (id) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)),
    })),
  toggleCart: (isOpen) => set(() => ({ isOpen })),
}));
