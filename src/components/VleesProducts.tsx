// components/VleesProducts.tsx
import VleesList from './VleesList';
import { Zuivel } from '@/types/types'; // Import the Zuivel type from types

async function getDataVlees(): Promise<Product[]> {
  try {
    const res = await fetch(
      'https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=28&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc'
    );

    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch data');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default async function VleesProducts() {
  try {
    const products = await getDataVlees();
    // Assuming mapProductToZuivel is a function that needs to be defined or imported
    // For demonstration, let's assume it's a simple function that maps Product to Zuivel
    const vlees = products.map((product) => ({
      ...product,
      // Assuming Zuivel has additional properties that need to be set or modified
      // For demonstration, let's assume Zuivel has a property 'zuivelType' that needs to be set
      zuivelType: 'Vlees',
    }));

    return (
      <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <VleesList vlees={vlees} />
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <p>Error loading products. Please try again later.</p>
      </div>
    );
  }
}
