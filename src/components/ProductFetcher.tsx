// Path: src\components\ProductFetcher.tsx
import ProductList from './ProductList';
import { Zuivel, Vlees, Kaas } from '@/types/types';

async function getData(category: number): Promise<(Zuivel | Vlees | Kaas)[]> {
  try {
    const res = await fetch(
      `https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=${category}&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc`
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

export default async function ProductFetcher({ category }: { category: number }) {
  try {
    const products = await getData(category);
    let categoryName: 'zuivel' | 'vlees' | 'kaas';

    // Determine the category name based on the category ID
    switch (category) {
      case 29:
        categoryName = 'zuivel';
        break;
      case 28:
        categoryName = 'vlees';
        break;
      case 27:
        categoryName = 'kaas';
        break;
      default:
        throw new Error('Invalid category');
    }

    return (
      <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <ProductList products={products} category={categoryName} />
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
