import { Product } from '@/types';

// These call our own Next.js API routes, which talk to USDA / Open Food Facts
// server-side. API keys stay on the server and never reach the browser.

// Barcode lookup (packaged foods) via Open Food Facts
export async function fetchProduct(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/product/${encodeURIComponent(barcode)}`);
    if (!response.ok) return null;
    return (await response.json()) as Product;
  } catch (error) {
    console.error('fetchProduct error:', error);
    return null;
  }
}

// Whole food search (fruits, vegetables, etc.) via USDA
export async function searchWholeFood(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    return (await response.json()) as Product[];
  } catch (error) {
    console.error('searchWholeFood error:', error);
    return [];
  }
}
