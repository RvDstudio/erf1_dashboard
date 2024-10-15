// Path: src\app\dashboard\camper\page.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductsPage() {
  return (
    <div className="pl-10 pt-10 pb-10">
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e] mr-8 p-6">
        <section>
          <h2 className="text-center text-2xl mt-6 font-medium md:text-5xl text-[#374C69]">Camper plek huren?</h2>
          <p className="msm:text-base mb-8 mt-4 text-center text-sm text-gray-500 md:mb-10 lg:mb-10">
            Van harte welkom op ERF-1. Op deze boerderij staan de droge koeien, pinken en de kalfjes.
          </p>
          <div className="mx-auto grid justify-items-stretch gap-6 md:grid-cols-2 lg:gap-6">
            {/* Item */}
            <Link href="/dashboard/camper/1" className="relative flex h-[300px] items-end">
              <Image
                src="https://erf1.nl/wp-content/uploads/2024/06/Camper--2048x1536.jpeg"
                alt=""
                className="inline-block h-full w-full rounded-lg object-cover"
                width={500}
                height={500}
              />
              <div className="absolute bottom-5 left-5 flex flex-col justify-center rounded-lg bg-[#374C69] text-white px-8 py-4">
                <p className="text-sm font-medium sm:text-xl">Camperplek 1</p>
                <p className="text-sm sm:text-base">Erf1 zuivel & meer</p>
              </div>
            </Link>
            {/* Item */}
            <Link href="/dashboard/camper/2" className="relative flex h-[300px] items-end">
              <Image
                src="https://erf1.nl/wp-content/uploads/2024/06/Camper--2048x1536.jpeg"
                alt=""
                className="inline-block h-full w-full rounded-lg object-cover"
                width={500}
                height={500}
              />
              <div className="absolute bottom-5 left-5 flex flex-col justify-center rounded-lg bg-[#374C69] text-white px-8 py-4">
                <p className="text-sm font-medium sm:text-xl">Camperplek 2</p>
                <p className="text-sm sm:text-base">Erf1 zuivel & meer</p>
              </div>
            </Link>
            {/* Item */}
            <Link href="/dashboard/camper/3" className="relative flex h-[300px] items-end">
              <Image
                src="https://erf1.nl/wp-content/uploads/2024/06/Camper--2048x1536.jpeg"
                alt=""
                className="inline-block h-full w-full rounded-lg object-cover"
                width={500}
                height={500}
              />
              <div className="absolute bottom-5 left-5 flex flex-col justify-center rounded-lg bg-[#374C69] text-white px-8 py-4">
                <p className="text-sm font-medium sm:text-xl">Camperplek 3</p>
                <p className="text-sm sm:text-base">Erf1 zuivel & meer</p>
              </div>
            </Link>
            {/* Item */}
            <Link href="/dashboard/camper/4" className="relative flex h-[300px] items-end">
              <Image
                src="https://erf1.nl/wp-content/uploads/2024/06/Camper--2048x1536.jpeg"
                alt=""
                className="inline-block h-full w-full rounded-lg object-cover"
                width={500}
                height={500}
              />
              <div className="absolute bottom-5 left-5 flex flex-col justify-center rounded-lg bg-[#374C69] text-white px-8 py-4">
                <p className="text-sm font-medium sm:text-xl">Camperplek 4</p>
                <p className="text-sm sm:text-base">Erf1 zuivel & meer</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
