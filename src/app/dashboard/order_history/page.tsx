'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Product = {
  id: string;
  product_name: string;
  description: string;
  short_description: string;
  quantity: string;
  price: string;
  image_url: string;
  createdAt: string;
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function UserProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setErrorMessage('Failed to retrieve session.');
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchUserProducts = async () => {
        try {
          const userId = session.user?.id;
          if (!userId) throw new Error('User ID is undefined.');

          const response = await fetch(`/api/userProducts?user_id=${userId}`);
          const data = await response.json();

          if (response.ok && data.products) {
            setProducts(data.products);
          } else {
            setErrorMessage(data.error || 'Failed to fetch products.');
          }
        } catch (error) {
          console.error('Error fetching user products:', error);
          setErrorMessage('Error fetching user products.');
        }
      };

      fetchUserProducts();
    }
  }, [session]);

  console.debug('Products:', products);

  return (
    <div className="p-4 pt-16">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {products.length > 0 ? (
        <Table>
          <TableCaption>A list of your products, ordered by latest first.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Short Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Created At</TableHead> {/* Display Created At */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <TableCell>
                  <Image
                    src={product.image_url}
                    alt={product.product_name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.product_name}</TableCell>
                <TableCell>{product.short_description}</TableCell>
                <TableCell className="text-right">{product.price}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell className="text-right">{new Date(product.createdAt).toLocaleString()}</TableCell>{' '}
                {/* Format Created At */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
