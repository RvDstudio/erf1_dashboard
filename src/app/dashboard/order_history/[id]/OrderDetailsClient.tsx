// Path: src\app\dashboard\order_history\[id]\OrderDetailsClient.tsx
'use client';

type OrderDetailsClientProps = {
  orderId: string;
  totalPrice: number;
  status: string;
};

export default function OrderDetailsClient({ orderId, status }: OrderDetailsClientProps) {
  console.log('Order status:', status); // Log the status to check its value

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }), // Only the orderId is needed as the API route fetches the details
      });

      const data = await response.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Error initiating checkout:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Only show the button if the status is not 'betaald'
  if (status === 'betaald') {
    return null;
  }

  return (
    <button onClick={handleCheckout} className="bg-[#374C69] text-white p-2 rounded mt-4">
      Order afrekenen
    </button>
  );
}
