// components/VleesProducts.tsx
import VleesList from "./VleesList";
import { Product } from "@/types";

async function getData(): Promise<any> {
  const res = await fetch(
    "https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=28&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

interface VleesProductsProps {
  onPriceChange: (totalPrice: number) => void;
}
export default async function VleesProducts({
  onPriceChange,
}: VleesProductsProps) {
  const vlees = await getData();

  return (
    <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
      <VleesList vlees={vlees} />
    </div>
  );
}
