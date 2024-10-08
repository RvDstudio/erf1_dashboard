// Path: src\app\page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Example() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        setIsLoggedIn(true);
      }
    };
    checkAuth();
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <section className="pt-8 lg:pt-32 bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
        <h1 className="max-w-3xl mx-auto text-center amatic font-bold text-4xl text-[#374C69] mb-5 md:text-5xl leading-[50px]">
          Welkom bij Erf1 zuivel & Meer
          <span className=""> Bestellingen </span>
        </h1>
        <p className="max-w-lg mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
          Het erf waarop onze boerderij staat is al in gebruik sinds 1432 toen in de monding van de IJsseldelta eilanden
          aaneen groeiden op de grens van zoet en zout.
        </p>
        <a
          onClick={handleClick}
          className="cursor-pointer w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-[#374C69] shadow-xs hover:bg-[#374C69]/90 transition-all duration-500"
        >
          Account Aanmaken
          <svg
            className="ml-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
        <div className="flex justify-center">
          <img src="/images/front_bg.png" alt="Dashboard image" />
        </div>
      </div>
    </section>
  );
}
