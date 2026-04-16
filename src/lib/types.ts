export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  image: string;
  imageFull: string;
  images: string[];
  category: string;
  categoryName: string;
  description: string;
  url: string;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderData {
  name: string;
  phone: string;
  city: string;
  delivery: string;
  comment: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
}
