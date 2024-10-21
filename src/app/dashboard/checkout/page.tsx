// Path: src\app\dashboard\checkout\page.tsx
'use client';

import { useCartStore } from '@/store/CartProduct';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const products = useCartStore((state) => state.products);
  const subtotal = products.reduce((total, product) => total + product.price * product.quantity, 0);
  const shipping = 8.0; // Example flat shipping rate
  const total = subtotal + shipping;
  const router = useRouter();

  const handlePayment = () => {
    // Placeholder for payment logic (e.g., Stripe integration)
    alert('Proceeding to payment...');
    // Redirect to a success page or handle payment confirmation
    router.push('/order-confirmation'); // Example redirect after payment
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        {products.length > 0 ? (
          <div>
            {products.map((product) => (
              <div key={product.id} className="flex justify-between mb-4">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <p className="text-gray-500">Quantity: {product.quantity}</p>
                </div>
                <span>€{(product.price * product.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
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
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <button
        className="w-full bg-[#374C69] text-white py-3 rounded-md hover:bg-[#2c3d55] mt-4"
        onClick={handlePayment}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
