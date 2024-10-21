// Path: src\app\dashboard\uitgekookt\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/CartProduct';
import { CartSheet } from '@/components/sheets/CartSheet';

const supabase = createClient();
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
};

export default function ZuivelProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addProduct);
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          setError('Failed to retrieve session');
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('isUitgekookt, isAdmin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to fetch profile');
          setLoading(false);
          return;
        }

        if (data?.isUitgekookt && data?.isAdmin) {
          fetchProducts();
        } else {
          setError('Access denied');
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        setError('Failed to check user role');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('zuivel_products').select('*').eq('category', 'zuivel');

        if (error) throw error;

        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pt-10 pl-5 pr-5 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <CartSheet /> {/* Include the cart sheet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="cursor-pointer relative flex flex-row rounded-lg bg-white group">
            <Image
              className="m-2 h-24 w-24 rounded-md border object-cover object-center"
              src={product.image_url}
              alt={product.name}
              width={300}
              height={300}
            />
            <div className="flex w-full flex-col px-4 py-4">
              <span className="font-semibold text-[#6699cc]">{product.name}</span>
              <span className="float-right text-gray-400">{product.category}</span>
              <p className="text-lg font-bold text-gray-500">€ {product.price.toFixed(2)}</p>
            </div>
            <div className="absolute bottom-0 right-0 m-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-[#374C69] w-8 h-8 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-100 hover:text-[#6699cc] cursor-pointer" />
              </span>
              <span
                className="bg-[#374C69] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => {
                  addToCart({ ...product, quantity: 1 });
                  toggleCart(true); // Open the cart when adding a product
                }}
              >
                <ShoppingBag className="w-5 h-5 text-gray-100 hover:text-[#6699cc]" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
