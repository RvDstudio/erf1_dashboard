// Path: src\app\dashboard\admin\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

type Order = {
  id: string;
  total_price: number;
  status: 'Betaald' | 'Pending';
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdminAndFetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('profiles').select('isAdmin').eq('id', user.id).single();

        if (error || !data?.isAdmin) {
          router.push('/'); // Redirect non-admin users to home
          return;
        }

        // Fetch all orders from the database
        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');

        if (ordersError) {
          setError('Error fetching orders');
        } else {
          setOrders((ordersData || []) as Order[]);
        }
      } else {
        router.push('/login'); // Redirect unauthenticated users to login
      }

      setLoading(false);
    };

    checkAdminAndFetchOrders();
  }, [router, supabase]);

  const handleStatusChange = async (orderId: string, newStatus: boolean) => {
    // Update the order status in Supabase
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus ? 'Betaald' : 'Pending' })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
    } else {
      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus ? 'Betaald' : 'Pending' } : order
        )
      );
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Page</h1>
      <p className="mb-4">Welcome, admin!</p>
      <h2 className="text-xl font-medium mb-2">Orders</h2>
      <Table>
        <TableCaption>List of all orders in the system</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>€{order.total_price}</TableCell>
                <TableCell>
                  <Switch
                    checked={order.status === 'Betaald'}
                    onCheckedChange={(checked) => handleStatusChange(order.id, checked)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
