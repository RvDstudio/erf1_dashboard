// Path: src\app\dashboard\uitgekookt\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

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
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Fetch the current user session
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

        // Fetch the user's profile to check for roles
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

        console.log('User profile data:', data);

        if (data?.isUitgekookt && data?.isAdmin) {
          setHasAccess(true);
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
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative bg-white shadow-md rounded-xl duration-500 hover:shadow-xl group">
              <a href="#">
                <div className="overflow-hidden rounded-t-xl">
                  <Image
                    src={product.image_url}
                    alt="Product"
                    className="h-80 w-72 object-cover rounded-t-xl duration-500 transform group-hover:scale-110"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="px-4 py-3 w-72">
                  <span className="text-gray-400 mr-3 uppercase text-xs">{product.category}</span>
                  <p className="text-lg text-[#6699cc] font-medium truncate block capitalize">{product.name}</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-black cursor-auto my-3">€ {product.price.toFixed(2)}</p>
                    <div className="ml-auto"></div>
                  </div>
                </div>
              </a>

              {/* Icons that slide in */}
              <div className="absolute inset-0 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col space-y-4 mr-4 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                  <span className="bg-white rounded-md p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-paper-bag"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 3h8a2 2 0 0 1 2 2v1.82a5 5 0 0 0 .528 2.236l.944 1.888a5 5 0 0 1 .528 2.236v5.82a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-5.82a5 5 0 0 1 .528 -2.236l1.472 -2.944v-3a2 2 0 0 1 2 -2z" />
                      <path d="M14 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M6 21a2 2 0 0 0 2 -2v-5.82a5 5 0 0 0 -.528 -2.236l-1.472 -2.944" />
                      <path d="M11 7h2" />
                    </svg>
                  </span>
                  <span className="bg-white rounded-md p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-heart"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
