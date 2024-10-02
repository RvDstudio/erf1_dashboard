'use client';

import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const { width, height } = useWindowSize();
  const router = useRouter();

  // Optional: Redirect to home or login page after a few seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login'); // Or any other page you'd like to redirect to
    }, 7000); // 7 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Confetti width={width} height={height} />
      <h1 className="text-4xl font-bold">Account Created Successfully!</h1>
      <h3 className="text-2xl font-bold">Dont forget to activate your account before login!</h3>
      <p className="text-xl mt-4">Redirecting you shortly...</p>
    </div>
  );
};

export default SuccessPage;
