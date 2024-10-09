// Path: src/components/ProductFetcher.tsx
import ProductList from './ProductList';
import { Product } from '@/types/types';

interface ProductFetcherProps {
  category: string;
  apiCategoryId: string; // WooCommerce category ID for the API call
}

// Since this is a server component, we can directly fetch the data here.
async function fetchProducts(apiCategoryId: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=${apiCategoryId}&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc`,
      { cache: 'no-store' } // 'no-store' ensures fresh data on each request
    );

    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch data');
    }

    const products = await res.json();

    // Convert regular_price to number
    return products.map((product: Product) => ({
      ...product,
      regular_price: Number(product.regular_price), // Convert price to number
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Server component fetching products
export default async function ProductFetcher({ category, apiCategoryId }: ProductFetcherProps) {
  try {
    const products = await fetchProducts(apiCategoryId);

    return (
      <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <ProductList products={products} category={category} />
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
