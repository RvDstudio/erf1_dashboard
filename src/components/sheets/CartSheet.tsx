// Path: src\components\sheets\CartSheet.tsx
import { useCartStore } from '@/store/CartProduct';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CartSheet() {
  const products = useCartStore((state) => state.products);
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const router = useRouter(); // Use Next.js router

  // Calculate subtotal
  const subtotal = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const shipping = 8.0; // Example flat shipping rate
  const total = subtotal + shipping;

  // Handle checkout navigation
  const handleCheckout = () => {
    // Close the cart sheet
    toggleCart(false);
    // Navigate to the checkout page
    router.push('/dashboard/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => toggleCart(open)}>
      <SheetTrigger asChild>
        <button className="z-50 fixed bottom-4 right-4 bg-[#374C69] text-white p-3 rounded-full">
          <ShoppingBag />
        </button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Your Cart</h2>
        {products.length > 0 ? (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-4">
                  <Image src={product.image_url} alt={product.name} width={60} height={60} className="rounded-md" />
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-gray-500 text-sm mt-1">€{product.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-gray-200 px-2 py-1 rounded-md" onClick={() => decrementQuantity(product.id)}>
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button className="bg-gray-200 px-2 py-1 rounded-md" onClick={() => incrementQuantity(product.id)}>
                    +
                  </button>
                </div>
                <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => removeProduct(product.id)}>
                  ✕
                </button>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Shipping</span>
                <span>€{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <button
                className="mt-6 w-full bg-[#374C69] text-white py-3 rounded-md hover:bg-[#2c3d55]"
                onClick={handleCheckout}
              >
                Checkout →
              </button>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
