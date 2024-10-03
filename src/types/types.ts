export interface User {
  id: string;
  email: string;
  username?: string;
  fullname?: string;
  website?: string;
  avatar_url?: string;
}
export interface Zuivel {
  id: string;
  name: string;
  price: number;
  category: string;
  regular_price: number;
  description: string;
  short_description: string;
  image_url: string;
  quantity: number;
  images: string;
  stock_status: string;
  src: string
}