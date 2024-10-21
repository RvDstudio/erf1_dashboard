// Path: src\app\order-confirmation\page.tsx
export default function OrderConfirmation() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
      <p className="text-lg">
        Thank you for your order! We’ve received your order and are preparing it for shipment. You will receive an email
        confirmation shortly.
      </p>
      <button
        className="mt-6 bg-[#374C69] text-white py-3 rounded-md hover:bg-[#2c3d55]"
        onClick={() => (window.location.href = '/')}
      >
        Back to Home
      </button>
    </div>
  );
}
