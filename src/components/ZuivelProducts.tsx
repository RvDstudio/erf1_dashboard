import ZuivelList from './ZuivelList';
import { Zuivel } from '@/types/types'; // Import the Zuivel type from types

interface Product {
  id: number;
  name: string;
  price: string | number;
  category: string;
  images?: { src: string }[]; // Optional images field
}

async function getData(): Promise<Product[]> {
  try {
    const res = await fetch(
      'https://erf1.nl/wp-json/wc/v3/products?per_page=50&category=29&consumer_key=ck_1e0d6a42370bf5fe7931b936a18bd61b757dcf71&consumer_secret=cs_754a9131b06a77a29116c966d0d99b83783b4efc'
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

function mapProductToZuivel(products: Product[]): Zuivel[] {
  const fallbackImageUrl = 'https://via.placeholder.com/500'; // Valid fallback image URL

  return products.map((product) => ({
    id: product.id.toString(),
    name: product.name,
    // Ensure price is a number before applying toFixed()
    regular_price: typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2),
    description: 'Default description', // Default or actual description
    short_description: 'Default short description', // Default or actual short description
    stock_status: 'instock', // Modify based on actual stock status if available
    images: product.images && product.images.length > 0 ? product.images : [{ src: fallbackImageUrl }],
    // Add the missing fields
    price: product.price.toString(),
    category: product.category,
    quantity: 0, // Set quantity to a default value (e.g., 0)
    src: product.images && product.images.length > 0 ? product.images[0].src : fallbackImageUrl, // Main image URL or fallback
  }));
}

export default async function ZuivelProducts() {
  try {
    const products = await getData();
    const zuivel = mapProductToZuivel(products); // Convert Product[] to Zuivel[]

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
