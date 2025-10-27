import productsData from '../data/products.json';

export interface Product {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  price: number;
  image_url: string;
  category_id: string;
  in_stock: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
}

export async function getProducts(): Promise<Product[]> {
  return productsData.products;
}

export async function getCategories(): Promise<Category[]> {
  return productsData.categories;
}

export async function getProductById(id: string): Promise<Product | null> {
  return productsData.products.find(p => p.id === id) || null;
}
