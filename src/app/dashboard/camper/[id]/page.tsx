// Path: src\app\dashboard\camper\[id]\page.tsx
'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

import 'react-infinite-calendar/styles.css';

export default function Page() {
  return (
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#f7f7f7] dark:bg-[#171717]">
      <div className="bg-white dark:bg-[#252525] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <h2 className="mt-2 text-3xl mb-1 text-[#6699CC]">Camperplek 1</h2>
        <strong className="text-[#888888] text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit.</strong>
        <Image
          src="https://erf1.nl/wp-content/uploads/2024/06/Camper--2048x1536.jpeg"
          alt=""
          className="mt-4 inline-block h-full w-full rounded-lg object-cover"
          width={500}
          height={500}
        />
        <p className="mb-6 mt-6 text-[#888888]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, laudantium rerum recusandae dicta quas iusto
          cupiditate, id doloremque neque molestias officia quisquam quia corrupti reiciendis est nulla velit voluptates
          molestiae! Amet quaerat excepturi pariatur molestias tenetur cum veniam, doloribus, est porro aliquid nulla,
          neque commodi omnis ex dolorum quasi illum magnam in! Reprehenderit, totam nesciunt deleniti dignissimos ad
          aperiam earum recusandae natus expedita adipisci iste. Ut dolores animi quidem tenetur. Placeat laborum,
          eligendi error deserunt iste unde magnam animi asperiores quas! Et omnis optio quas id praesentium ad fugiat,
          earum unde quae suscipit officia ab a dicta facere, in impedit.
        </p>
        <Button className="mt-4 bg-[#374C69] hover:bg-[#374C69]/90 text-[#6699CC]">Verblijf boeken</Button>
      </div>
    </div>
  );
}
