'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import necessary components

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

export default function UserProducts() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      const fetchUserProducts = async () => {
        try {
          const userId = session?.user?.id; // Use optional chaining to avoid undefined error
          if (!userId) throw new Error('User ID is undefined.'); // Handle case where userId is not available
          const response = await fetch(`/api/userProducts?user_id=${userId}`);
          const data = await response.json();

          console.log('API Response:', data); // Log the response for debugging

          if (response.ok && data.products) {
            setProducts(data.products); // Set products state
          } else {
            setErrorMessage(data.error || 'Failed to fetch products.');
          }
        } catch (error) {
          console.error('Error fetching user products:', error);
          setErrorMessage('Error fetching user products.');
        }
      };

      fetchUserProducts(); // Call the function directly
    }
  }, [session]);

  return (
    <div className="p-4 pt-16">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {products.length > 0 ? (
        <Table>
          <TableCaption>A list of your products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Short Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
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
