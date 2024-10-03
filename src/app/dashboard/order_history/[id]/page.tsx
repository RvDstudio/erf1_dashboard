import { createClient } from '@/utils/supabase/client';

export default async function OrderDetails({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params; // Destructure the params object to get the dynamic id

  // Fetch the order details from the 'orders' table
  const { data: order, error: orderError } = await supabase.from('orders').select('*').eq('id', id).single();

  // Fetch the order items from the 'order_items' table
  const { data: orderItems, error: itemsError } = await supabase.from('order_items').select('*').eq('order_id', id);

  // Handle errors
  if (orderError || itemsError || !order) {
    return <p>Order not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4 text-[#374c69]">Bestelgegevens</h1>
      <p className="text-lg">
        <strong className="text-[#374c69]">Order ID:</strong> {order.id}
      </p>
      <p className="text-[#374c69]">
        <strong>Totale Prijs:</strong> €{order.total_price}
      </p>
      <p className="text-[#374c69]">
        <strong>Status:</strong> {order.status}
      </p>

      <h2 className="text-[#374c69] font-medium mt-3 mb-4">Producten in deze order</h2>
      {orderItems.length > 0 ? (
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border border-gray-300 md:table-row absolute -top-full md:relative">
              <th className="bg-gray-100 p-2 text-left font-medium md:border md:border-gray-300">Afbeelding</th>
              <th className="bg-gray-100 p-2 text-left font-medium md:border md:border-gray-300">Product Naam</th>
              <th className="bg-gray-100 p-2 text-left font-medium md:border md:border-gray-300">Aantal</th>
              <th className="bg-gray-100 p-2 text-left font-medium md:border md:border-gray-300">Beschrijving</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {orderItems.map((item) => (
              <tr key={item.id} className="border border-gray-300 md:table-row">
                {/* Render the product image */}
                <td className="p-2 md:border md:border-gray-300 block md:table-cell">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.product_name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                </td>
                {/* Product name */}
                <td className="p-2 md:border md:border-gray-300 block md:table-cell">{item.product_name}</td>
                {/* Quantity */}
                <td className="p-2 md:border md:border-gray-300 block md:table-cell">{item.quantity}</td>
                {/* Description */}
                <td className="p-2 md:border md:border-gray-300 block md:table-cell">
                  <div dangerouslySetInnerHTML={{ __html: item.description }} className="prose max-w-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found for this order.</p>
      )}
    </div>
  );
}
