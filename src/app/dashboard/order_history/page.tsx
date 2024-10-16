// Path: src\app\dashboard\order_history\page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

type Product = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  description: string;
};

type Order = {
  id: string;
  created_at: string; // Change order_date to created_at
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

  const styles = StyleSheet.create({
    page: { padding: 40 },
    section: { marginBottom: 20 },
    heading: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
    orderInfo: { fontSize: 12, marginBottom: 6 },
    bold: { fontWeight: 'bold' },
    tableHeader: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textAlign: 'left' },
    tableCell: { fontSize: 10, paddingVertical: 2 },
    tableRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    tableColumn: { width: '33.3%' },
  });

  const OrderPDFDocument = ({ order }: { order: Order }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Order Details</Text>
          <Text style={styles.orderInfo}>
            <Text style={styles.bold}>Order ID:</Text> {order.id}
          </Text>
          <Text style={styles.orderInfo}>
            <Text style={styles.bold}>Order Date:</Text> {new Date(order.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.orderInfo}>
            <Text style={styles.bold}>Total Price:</Text> €{order.total_price.toFixed(2)}
          </Text>
          <Text style={styles.orderInfo}>
            <Text style={styles.bold}>Status:</Text> {order.status}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Products</Text>
          <View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.tableColumn]}>Product Name</Text>
              <Text style={[styles.tableHeader, styles.tableColumn]}>Quantity</Text>
              <Text style={[styles.tableHeader, styles.tableColumn]}>Price</Text>
            </View>
            {order.products.map((product) => (
              <View key={product.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableColumn]}>{product.product_name}</Text>
                <Text style={[styles.tableCell, styles.tableColumn]}>{product.quantity}</Text>
                <Text style={[styles.tableCell, styles.tableColumn]}>€{product.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="p-4 pt-6">
      <h1 className="text-xl font-medium mb-2">Order History</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableCaption className="text-[#374C69]">Een lijst met uw bestellingen..</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Totale Prijs</TableHead>
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
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>€ {order.total_price.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <PDFDownloadLink document={<OrderPDFDocument order={order} />} fileName={`order_${order.id}.pdf`}>
                      <Button className="text-white text-xs bg-[#374C69] hover:bg-[#374C69]/90">Download PDF</Button>
                    </PDFDownloadLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Geen orders gevonden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
