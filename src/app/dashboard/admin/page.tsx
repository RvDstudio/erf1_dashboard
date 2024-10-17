// Path: src\app\dashboard\admin\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import clsx from 'clsx'; // To conditionally apply classes

type Order = {
  id: string;
  total_price: number;
  status: 'Betaald' | 'Niet betaald';
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
      .update({ status: newStatus ? 'Betaald' : 'Niet betaald' })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
    } else {
      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus ? 'Betaald' : 'Niet betaald' } : order
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
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <div className="bg-white dark:bg-[#252525] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <h1 className="text-xl font-medium mb-4 text-[#6699CC]">Orders Page</h1>
        <Table>
          <TableCaption>Lijst met alle bestellingen in het systeem</TableCaption>
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
                  <TableCell className="flex items-center gap-2">
                    {/* Left Text: "Niet betaald" */}
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        order.status === 'Niet betaald' ? 'text-red-500' : 'text-gray-500'
                      )}
                    >
                      Niet betaald
                    </span>
                    {/* Switch Component */}
                    <Switch
                      checked={order.status === 'Betaald'}
                      onCheckedChange={(checked) => handleStatusChange(order.id, checked)}
                    />
                    {/* Right Text: "Betaald" */}
                    <span
                      className={clsx(
                        'text-sm font-medium',
                        order.status === 'Betaald' ? 'text-green-500' : 'text-gray-500'
                      )}
                    >
                      Betaald
                    </span>
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
    </div>
  );
}
