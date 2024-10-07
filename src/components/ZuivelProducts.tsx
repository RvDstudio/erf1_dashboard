import ZuivelList from './ZuivelList';
import { Zuivel } from '@/types/types';

async function getData(): Promise<Zuivel[]> {
  try {
    const res = await fetch(
      'https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=29&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc'
    );

    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      throw new Error('Failed to fetch data');
    }

    const products = await res.json();

    // Transform the fetched products to match the Zuivel type
    return products.map((product: Zuivel) => ({
      id: product.id,
      name: product.name,
      regular_price: product.regular_price,
      description: product.description || 'No description available',
      short_description: product.short_description || 'No short description available',
      image_url: product.images[0]?.src || '',
      stock_status: product.stock_status,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default async function ZuivelProducts() {
  try {
    const zuivel = await getData();

    return (
      <div className="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <ZuivelList zuivel={zuivel} />
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
