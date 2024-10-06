// Path: src\app\dashboard\order_history\page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import html2pdf from 'html2pdf.js';

type Product = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  description: string;
};

type Order = {
  id: string;
  order_date: string;
  total_price: number;
  status: string;
  products: Product[];
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setErrorMessage('User not authenticated');
          return;
        }

        const userId = session.user.id;
        const response = await fetch(`/api/userOrders?user_id=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          setErrorMessage(data.error || 'Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        setErrorMessage('Error fetching order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [supabase.auth]);

  const generatePDFWithHtml2pdf = (order: Order) => {
    const element = document.getElementById(`order-pdf-${order.id}`);

    if (element) {
      // Ensure element is visible before generating PDF
      element.style.display = 'block';

      setTimeout(() => {
        const opt = {
          margin: 1,
          filename: `order_${order.id}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf()
          .from(element)
          .set(opt)
          .save()
          .then(() => {
            // Hide the element again after PDF generation
            element.style.display = 'none';
          });
      }, 500); // Allow some time for the content to fully render
    }
  };

  return (
    <div className="p-4 pt-6">
      <h1 className="text-xl font-medium mb-2">Order History</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableCaption>A list of your orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/dashboard/order_history/${order.id}`}>
                      <Button className="text-white bg-[#374C69] hover:bg-[#374C69]/90">{order.id}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>€ {order.total_price.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => generatePDFWithHtml2pdf(order)}
                      className="text-white text-xs  bg-[#374C69] hover:bg-[#374C69]/90"
                    >
                      Download PDF
                    </Button>

                    <div
                      id={`order-pdf-${order.id}`}
                      style={{
                        display: 'none', // Start hidden until needed for PDF generation
                      }}
                    >
                      <h1>Order ID: {order.id}</h1>
                      <p>
                        <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Total Price:</strong> €{order.total_price.toFixed(2)}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <table>
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product) => (
                            <tr key={product.id}>
                              <td>{product.product_name}</td>
                              <td>{product.quantity}</td>
                              <td>€{product.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
