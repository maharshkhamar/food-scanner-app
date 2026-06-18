import { Product, Additive, NutritionData } from '@/types';
import { calculateScore } from '@/lib/score';

// USDA FoodData Central API configuration
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// NutritionDataix API configuration
const NUTRITIONIX_APP_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID || '';
const NUTRITIONIX_API_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY || '';
const NUTRITIONIX_BASE_URL = 'https://trackapi.nutritionix.com/v2';

// Open Food Facts as fallback
const OFF_BASE_URL = 'https://world.openfoodfacts.org/api/v0/product';

// High-risk additives database
const ADDITIVE_RISKS: Record<string, 'high' | 'medium' | 'low'> = {
  'e211': 'high', 'e212': 'high', 'e213': 'high',
  'e150d': 'high', 'e621': 'high', 'e951': 'high',
  'e950': 'high', 'e955': 'high', 'e320': 'high',
  'e321': 'high', 'e102': 'high', 'e104': 'high',
  'e110': 'high', 'e122': 'high', 'e124': 'high',
  'e129': 'high', 'e131': 'high', 'e142': 'high',
  'e407': 'medium', 'e407a': 'medium', 'e414': 'medium',
  'e330': 'medium', 'e338': 'medium', 'e339': 'medium',
  'e340': 'medium', 'e341': 'medium', 'e450': 'medium',
  'e451': 'medium', 'e452': 'medium',
  'e300': 'low', 'e306': 'low', 'e322': 'low',
  'e440': 'low', 'e441': 'low', 'e460': 'low',
  'e461': 'low', 'e464': 'low', 'e466': 'low',
  'e471': 'low', 'e472': 'low', 'e500': 'low',
};

const ADDITIVE_NAMES: Record<string, string> = {
  'e211': 'Sodium Benzoate',
  'e212': 'Potassium Benzoate',
  'e213': 'Calcium Benzoate',
  'e150d': 'Caramel Color (Sulfite)',
  'e621': 'Monosodium Glutamate (MSG)',
  'e951': 'Aspartame',
  'e950': 'Acesulfame K',
  'e955': 'Sucralose',
  'e320': 'BHA',
  'e321': 'BHT',
  'e407': 'Carrageenan',
  'e330': 'Citric Acid',
  'e300': 'Ascorbic Acid (Vitamin C)',
  'e322': 'Lecithin',
};

// ========== NUTRITIONIX API (Best for packaged foods with barcodes) ==========

async function fetchFromNutritionDataix(barcode: string): Promise<Product | null> {
  if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_API_KEY) {
    console.warn('NutritionDataix API keys not configured');
    return null;
  }

  try {
    const response = await fetch(`${NUTRITIONIX_BASE_URL}/search/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
      },
      body: JSON.stringify({ upc: barcode }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const food = data.foods?.[0];
    if (!food) return null;

    const nutrition: NutritionData = {
      protein: food.nf_protein || 0,
      carbs: food.nf_total_carbohydrate || 0,
      sugar: food.nf_sugars || 0,
      fiber: food.nf_dietary_fiber || 0,
      fat: food.nf_total_fat || 0,
      calories: food.nf_calories || 0,
    };

    // Calculate per 100g if serving size is available
    const servingWeight = food.serving_weight_grams || 100;
    if (servingWeight !== 100) {
      const factor = 100 / servingWeight;
      nutrition.protein *= factor;
      nutrition.carbs *= factor;
      nutrition.sugar *= factor;
      nutrition.fiber *= factor;
      nutrition.fat *= factor;
      nutrition.calories *= factor;
    }

    const dietaryFlags: string[] = [];
    if (food.item_description?.toLowerCase().includes('organic')) dietaryFlags.push('Organic');

    return {
      barcode,
      name: food.item_name || food.food_name || 'Unknown Product',
      brand: food.brand_name,
      imageUrl: food.photo?.highres || food.photo?.thumb,
      nutrition,
      additives: [], // NutritionDataix doesn't provide additive data
      dietaryFlags,
      score: calculateScore(nutrition, []),
    };
  } catch (error) {
    console.error('NutritionDataix error:', error);
    return null;
  }
}

// ========== USDA FOODDATA CENTRAL API (Best for whole foods) ==========

export async function searchUSDAFoods(query: string, pageSize: number = 10): Promise<Product[]> {
  if (!USDA_API_KEY) {
    console.warn('USDA API key not configured');
    return [];
  }

  try {
    // First try Foundation foods (whole foods like raw fruits, vegetables, meats)
    const foundationResponse = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation`
    );

    // Also get SR Legacy foods (standard reference - whole foods)
    const srLegacyResponse = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=SR%20Legacy`
    );

    let foods: any[] = [];

    if (foundationResponse.ok) {
      const foundationData = await foundationResponse.json();
      foods = [...foods, ...(foundationData.foods || [])];
    }

    if (srLegacyResponse.ok) {
      const srData = await srLegacyResponse.json();
      foods = [...foods, ...(srData.foods || [])];
    }

    // Remove duplicates by fdcId
    const seen = new Set();
    foods = foods.filter((food: any) => {
      if (seen.has(food.fdcId)) return false;
      seen.add(food.fdcId);
      return true;
    });

    // Sort: prioritize raw/whole foods, filter out branded/processed
    foods = foods
      .filter((food: any) => {
        // Exclude branded/packaged foods
        if (food.dataType === 'Branded') return false;
        // Exclude foods with brand owners (usually packaged)
        if (food.brandOwner || food.brandName) return false;
        return true;
      })
      .sort((a: any, b: any) => {
        // Prioritize descriptions with "raw", "fresh", or simple names
        const aDesc = a.description?.toLowerCase() || '';
        const bDesc = b.description?.toLowerCase() || '';
        const aIsRaw = aDesc.includes('raw') || aDesc.includes('fresh');
        const bIsRaw = bDesc.includes('raw') || bDesc.includes('fresh');
        const aIsSimple = !aDesc.includes(',') && aDesc.split(' ').length <= 2;
        const bIsSimple = !bDesc.includes(',') && bDesc.split(' ').length <= 2;

        // Score for sorting
        const aScore = (aIsRaw ? 2 : 0) + (aIsSimple ? 1 : 0);
        const bScore = (bIsRaw ? 2 : 0) + (bIsSimple ? 1 : 0);

        return bScore - aScore;
      });

    return foods.slice(0, pageSize).map((food: any) => {
      const nutrients = food.foodNutrients?.reduce((acc: any, n: any) => {
        acc[n.nutrientId] = n.value;
        return acc;
      }, {}) || {};

      // Nutrient IDs: 1003=protein, 1004=fat, 1005=carbs, 1008=energy, 2000=sugar, 1079=fiber
      const nutrition: NutritionData = {
        protein: nutrients[1003] || 0,
        carbs: nutrients[1005] || 0,
        sugar: nutrients[2000] || 0,
        fiber: nutrients[1079] || 0,
        fat: nutrients[1004] || 0,
        calories: nutrients[1008] || 0,
      };

      // Determine dietary flags from food category
      const category = food.foodCategory?.toLowerCase() || '';
      const dietaryFlags: string[] = [];
      if (category.includes('fruit') || category.includes('vegetable')) dietaryFlags.push('Whole Food');
      if (category.includes('dairy')) dietaryFlags.push('Dairy');

      return {
        barcode: food.fdcId?.toString() || '',
        name: food.description || 'Unknown Food',
        brand: food.brandOwner || 'USDA Database',
        imageUrl: undefined,
        nutrition,
        additives: [],
        dietaryFlags,
        score: calculateScore(nutrition, []),
      };
    });
  } catch (error) {
    console.error('USDA API error:', error);
    return [];
  }
}

// ========== OPEN FOOD FACTS (Free fallback) ==========

async function fetchFromOpenFoodFacts(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(`${OFF_BASE_URL}/${barcode}.json`);
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    const nutrition: NutritionData = {
      protein: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      fiber: nutriments.fiber_100g || 0,
      fat: nutriments.fat_100g || 0,
      calories: nutriments['energy-kcal_100g'] || nutriments.energy_100g / 4.184 || 0,
    };

    const additives = parseAdditives(product.additives_tags || []);
    const dietaryFlags = parseDietaryFlags(product);

    return {
      barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands,
      imageUrl: product.image_url || product.image_front_url,
      nutrition,
      additives,
      dietaryFlags,
      score: calculateScore(nutrition, additives),
    };
  } catch (error) {
    console.error('Open Food Facts error:', error);
    return null;
  }
}

// ========== HELPER FUNCTIONS ==========

function parseAdditives(additivesTags: string[]): Additive[] {
  return additivesTags.map(tag => {
    const code = tag.toLowerCase().replace('en:', '');
    const eNumber = code.match(/e\d{3,4}[a-z]?/)?.[0] || '';
    return {
      code: eNumber || code,
      name: ADDITIVE_NAMES[eNumber] || code,
      risk: ADDITIVE_RISKS[eNumber] || 'low',
    };
  });
}

function parseDietaryFlags(productData: any): string[] {
  const flags: string[] = [];

  if (productData.labels_tags) {
    const labels = productData.labels_tags.map((l: string) => l.toLowerCase());
    if (labels.some((l: string) => l.includes('vegan'))) flags.push('Vegan');
    if (labels.some((l: string) => l.includes('vegetarian'))) flags.push('Vegetarian');
    if (labels.some((l: string) => l.includes('gluten-free'))) flags.push('Gluten-Free');
    if (labels.some((l: string) => l.includes('organic'))) flags.push('Organic');
    if (labels.some((l: string) => l.includes('kosher'))) flags.push('Kosher');
    if (labels.some((l: string) => l.includes('halal'))) flags.push('Halal');
    if (labels.some((l: string) => l.includes('dairy-free') || l.includes('lactose-free'))) flags.push('Dairy-Free');
    if (labels.some((l: string) => l.includes('non-gmo'))) flags.push('Non-GMO');
  }

  if (productData.allergens_tags) {
    const allergens = productData.allergens_tags.map((a: string) => a.toLowerCase());
    if (allergens.some((a: string) => a.includes('nuts') || a.includes('peanut'))) flags.push('Contains Nuts');
    if (allergens.some((a: string) => a.includes('soy'))) flags.push('Contains Soy');
    if (allergens.some((a: string) => a.includes('dairy') || a.includes('milk'))) flags.push('Contains Dairy');
  }

  return flags;
}

// ========== MAIN FETCH FUNCTION ==========

export async function fetchProduct(barcode: string): Promise<Product | null> {
  // Strategy: Try NutritionDataix first (best for packaged foods with barcodes)
  // Then fallback to Open Food Facts if needed

  // Try NutritionDataix
  const nutritionixResult = await fetchFromNutritionDataix(barcode);
  if (nutritionixResult) {
    console.log('Product found via NutritionDataix');
    return nutritionixResult;
  }

  // Fallback to Open Food Facts
  const offResult = await fetchFromOpenFoodFacts(barcode);
  if (offResult) {
    console.log('Product found via Open Food Facts');
    return offResult;
  }

  return null;
}

// For whole food searches (fruits, vegetables, etc.)
export async function searchWholeFood(query: string): Promise<Product[]> {
  // Try USDA first for whole foods
  const usdaResults = await searchUSDAFoods(query);
  if (usdaResults.length > 0) {
    return usdaResults;
  }
  return [];
}
