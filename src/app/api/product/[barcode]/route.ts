import { fetchFromOpenFoodFacts } from '@/lib/foodSources';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  if (!barcode || !/^\d+$/.test(barcode)) {
    return Response.json({ error: 'Invalid barcode' }, { status: 400 });
  }

  const product = await fetchFromOpenFoodFacts(barcode);

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json(product);
}
