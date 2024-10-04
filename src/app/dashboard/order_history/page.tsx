// Path: src\app\dashboard\order_history\page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import necessary components
import { Button } from '@/components/ui/button';

type Order = {
  id: string;
  order_date: string;
  total_price: number;
  status: string;
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
