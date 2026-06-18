import { searchUSDAFoods } from '@/lib/foodSources';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return Response.json({ error: 'Missing query' }, { status: 400 });
  }

  const results = await searchUSDAFoods(query);
  return Response.json(results);
}
