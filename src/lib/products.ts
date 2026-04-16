import { Product, Category } from "./types";

let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;

export function getProducts(): Product[] {
  if (!productsCache) {
    try {
      productsCache = require("@/data/products.json") as Product[];
    } catch {
      productsCache = [];
    }
  }
  return productsCache;
}

export function getCategories(): Category[] {
  if (!categoriesCache) {
    try {
      categoriesCache = require("@/data/categories.json") as Category[];
    } catch {
      categoriesCache = [];
    }
  }
  return categoriesCache;
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getProducts().filter((p) => p.category === categorySlug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return getProducts().filter((p) => p.name.toLowerCase().includes(q));
}
