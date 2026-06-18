import { Recipe, FitnessGoal } from '@/types';

// Recipes organized by main ingredient with goal-specific variations
const recipesByIngredient: Record<string, Record<FitnessGoal, Recipe[]>> = {
  'yogurt': {
    gain: [
      {
        id: 'yogurt-gain-1',
        name: 'Protein Yogurt Bowl',
        ingredients: ['Greek yogurt', 'Protein powder', 'Banana', 'Peanut butter', 'Granola'],
        instructions: ['Mix protein powder into yogurt', 'Slice banana', 'Top with granola and peanut butter'],
        tags: ['high-protein', 'post-workout'],
        suitableFor: ['gain'],
      },
      {
        id: 'yogurt-gain-2',
        name: 'Yogurt Protein Smoothie',
        ingredients: ['Greek yogurt', 'Whey protein', 'Oats', 'Honey', 'Almond milk'],
        instructions: ['Blend all ingredients', 'Add ice if needed', 'Serve immediately'],
        tags: ['high-calorie', 'quick'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'yogurt-lose-1',
        name: 'Light Yogurt with Berries',
        ingredients: ['0% fat Greek yogurt', 'Mixed berries', 'Chia seeds', 'Stevia'],
        instructions: ['Add berries to yogurt', 'Sprinkle chia seeds', 'Sweeten with stevia'],
        tags: ['low-calorie', 'high-protein'],
        suitableFor: ['lose'],
      },
      {
        id: 'yogurt-lose-2',
        name: 'Yogurt Cucumber Dip',
        ingredients: ['Low-fat yogurt', 'Cucumber', 'Dill', 'Lemon juice', 'Garlic'],
        instructions: ['Grate cucumber', 'Mix with yogurt and herbs', 'Serve with raw veggies'],
        tags: ['low-calorie', 'fresh'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'yogurt-maintain-1',
        name: 'Classic Yogurt Parfait',
        ingredients: ['Greek yogurt', 'Granola', 'Mixed berries', 'Honey'],
        instructions: ['Layer yogurt in glass', 'Add granola and berries', 'Drizzle honey'],
        tags: ['balanced', 'quick'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'chicken': {
    gain: [
      {
        id: 'chicken-gain-1',
        name: 'High-Protein Chicken Bowl',
        ingredients: ['Chicken breast', 'Brown rice', 'Black beans', 'Avocado', 'Cheese'],
        instructions: ['Grill seasoned chicken', 'Cook rice and beans', 'Combine with avocado and cheese'],
        tags: ['high-protein', 'high-calorie'],
        suitableFor: ['gain'],
      },
      {
        id: 'chicken-gain-2',
        name: 'Chicken Pasta Alfredo',
        ingredients: ['Chicken', 'Pasta', 'Heavy cream', 'Parmesan', 'Garlic'],
        instructions: ['Cook pasta', 'Sauté chicken', 'Make Alfredo sauce', 'Combine'],
        tags: ['high-calorie', 'comfort'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'chicken-lose-1',
        name: 'Grilled Chicken Salad',
        ingredients: ['Chicken breast', 'Mixed greens', 'Cucumber', 'Tomato', 'Lemon dressing'],
        instructions: ['Grill chicken', 'Chop vegetables', 'Toss with dressing'],
        tags: ['low-carb', 'fresh'],
        suitableFor: ['lose'],
      },
      {
        id: 'chicken-lose-2',
        name: 'Chicken Lettuce Wraps',
        ingredients: ['Ground chicken', 'Lettuce cups', 'Water chestnuts', 'Soy sauce', 'Ginger'],
        instructions: ['Cook chicken with aromatics', 'Serve in lettuce cups'],
        tags: ['low-carb', 'light'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'chicken-maintain-1',
        name: 'Chicken Stir-Fry',
        ingredients: ['Chicken', 'Mixed vegetables', 'Brown rice', 'Soy sauce', 'Sesame oil'],
        instructions: ['Stir-fry chicken', 'Add vegetables', 'Serve over rice'],
        tags: ['balanced', 'quick'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'egg': {
    gain: [
      {
        id: 'egg-gain-1',
        name: '3-Egg Breakfast Burrito',
        ingredients: ['Whole eggs', 'Tortilla', 'Cheese', 'Avocado', 'Salsa'],
        instructions: ['Scramble eggs', 'Fill tortilla', 'Add toppings', 'Wrap and serve'],
        tags: ['high-protein', 'breakfast'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'egg-lose-1',
        name: 'Egg White Omelette',
        ingredients: ['Egg whites', 'Spinach', 'Mushrooms', 'Feta cheese'],
        instructions: ['Sauté vegetables', 'Pour in egg whites', 'Add feta', 'Fold and serve'],
        tags: ['low-calorie', 'high-protein'],
        suitableFor: ['lose'],
      },
      {
        id: 'egg-lose-2',
        name: 'Boiled Eggs with Veggies',
        ingredients: ['Hard-boiled eggs', 'Cherry tomatoes', 'Cucumber', 'Salt', 'Pepper'],
        instructions: ['Boil eggs', 'Cut vegetables', 'Season and serve'],
        tags: ['simple', 'low-calorie'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'egg-maintain-1',
        name: 'Classic Scrambled Eggs',
        ingredients: ['Eggs', 'Whole grain toast', 'Butter', 'Chives'],
        instructions: ['Scramble eggs', 'Toast bread', 'Garnish with chives'],
        tags: ['classic', 'balanced'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'oats': {
    gain: [
      {
        id: 'oats-gain-1',
        name: 'Protein Oatmeal',
        ingredients: ['Oats', 'Protein powder', 'Peanut butter', 'Banana', 'Milk'],
        instructions: ['Cook oats in milk', 'Stir in protein', 'Top with banana and peanut butter'],
        tags: ['high-calorie', 'breakfast'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'oats-lose-1',
        name: 'Overnight Oats with Berries',
        ingredients: ['Oats', 'Almond milk', 'Chia seeds', 'Berries', 'Cinnamon'],
        instructions: ['Mix oats with milk and chia', 'Refrigerate overnight', 'Top with berries'],
        tags: ['low-calorie', 'fiber-rich'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'oats-maintain-1',
        name: 'Classic Oatmeal',
        ingredients: ['Oats', 'Milk', 'Honey', 'Cinnamon', 'Apple'],
        instructions: ['Cook oats', 'Add toppings', 'Serve warm'],
        tags: ['classic', 'heart-healthy'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'banana': {
    gain: [
      {
        id: 'banana-gain-1',
        name: 'Peanut Butter Banana Smoothie',
        ingredients: ['Banana', 'Peanut butter', 'Protein powder', 'Oats', 'Milk'],
        instructions: ['Blend all ingredients', 'Add ice if desired'],
        tags: ['high-calorie', 'quick'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'banana-lose-1',
        name: 'Banana with Almond Butter',
        ingredients: ['Banana', 'Almond butter', 'Cinnamon'],
        instructions: ['Slice banana', 'Top with almond butter', 'Sprinkle cinnamon'],
        tags: ['simple', 'portion-controlled'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'banana-maintain-1',
        name: 'Banana Toast',
        ingredients: ['Banana', 'Whole grain bread', 'Honey', 'Chia seeds'],
        instructions: ['Toast bread', 'Top with sliced banana', 'Drizzle honey and chia'],
        tags: ['quick', 'balanced'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'salmon': {
    gain: [
      {
        id: 'salmon-gain-1',
        name: 'Salmon with Quinoa',
        ingredients: ['Salmon fillet', 'Quinoa', 'Olive oil', 'Lemon', 'Asparagus'],
        instructions: ['Bake salmon', 'Cook quinoa', 'Roast asparagus', 'Serve together'],
        tags: ['omega-3', 'high-protein'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'salmon-lose-1',
        name: 'Grilled Salmon Salad',
        ingredients: ['Salmon', 'Mixed greens', 'Cucumber', 'Tomato', 'Light dressing'],
        instructions: ['Grill salmon', 'Toss salad', 'Serve together'],
        tags: ['low-carb', 'omega-3'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'salmon-maintain-1',
        name: 'Baked Salmon with Veggies',
        ingredients: ['Salmon', 'Broccoli', 'Sweet potato', 'Olive oil', 'Herbs'],
        instructions: ['Bake salmon and vegetables', 'Season with herbs', 'Serve'],
        tags: ['balanced', 'healthy-fats'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'milk': {
    gain: [
      {
        id: 'milk-gain-1',
        name: 'Protein Milkshake',
        ingredients: ['Whole milk', 'Protein powder', 'Peanut butter', 'Banana', 'Ice cream'],
        instructions: ['Blend all ingredients', 'Serve immediately'],
        tags: ['high-calorie', 'treat'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'milk-lose-1',
        name: 'Golden Milk (Turmeric)',
        ingredients: ['Skim milk', 'Turmeric', 'Honey', 'Cinnamon'],
        instructions: ['Warm milk', 'Add turmeric and spices', 'Sweeten lightly'],
        tags: ['low-calorie', 'anti-inflammatory'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'milk-maintain-1',
        name: 'Classic Hot Chocolate',
        ingredients: ['Milk', 'Cocoa powder', 'Honey', 'Vanilla'],
        instructions: ['Heat milk', 'Mix in cocoa', 'Add vanilla and honey'],
        tags: ['comfort', 'moderate'],
        suitableFor: ['maintain'],
      },
    ],
  },
  'cheese': {
    gain: [
      {
        id: 'cheese-gain-1',
        name: 'Loaded Cheese Nachos',
        ingredients: ['Cheese', 'Tortilla chips', 'Beans', 'Sour cream', 'Salsa', 'Guacamole'],
        instructions: ['Layer chips on plate', 'Add toppings', 'Melt cheese', 'Serve'],
        tags: ['high-calorie', 'indulgent'],
        suitableFor: ['gain'],
      },
    ],
    lose: [
      {
        id: 'cheese-lose-1',
        name: 'Caprese Salad',
        ingredients: ['Mozzarella', 'Tomato', 'Basil', 'Balsamic', 'Olive oil'],
        instructions: ['Slice cheese and tomato', 'Layer with basil', 'Drizzle with balsamic'],
        tags: ['light', 'fresh'],
        suitableFor: ['lose'],
      },
    ],
    maintain: [
      {
        id: 'cheese-maintain-1',
        name: 'Cheese and Whole Grain Crackers',
        ingredients: ['Cheese', 'Whole grain crackers', 'Apple slices', 'Nuts'],
        instructions: ['Arrange cheese and crackers', 'Add fruit and nuts'],
        tags: ['balanced', 'snack'],
        suitableFor: ['maintain'],
      },
    ],
  },
};

// Generic fallback recipes by goal
const fallbackRecipes: Record<FitnessGoal, Recipe[]> = {
  gain: [
    {
      id: 'fallback-gain-1',
      name: 'Add to a Protein Shake',
      ingredients: ['Your product', 'Protein powder', 'Banana', 'Peanut butter', 'Milk'],
      instructions: ['Combine all ingredients', 'Blend until smooth', 'Enjoy post-workout'],
      tags: ['high-protein', 'customizable'],
      suitableFor: ['gain'],
    },
    {
      id: 'fallback-gain-2',
      name: 'Create a Calorie-Dense Bowl',
      ingredients: ['Your product', 'Rice or pasta', 'Olive oil', 'Nuts', 'Avocado'],
      instructions: ['Prepare your product', 'Add base carbs', 'Top with healthy fats'],
      tags: ['high-calorie', 'bulking'],
      suitableFor: ['gain'],
    },
  ],
  lose: [
    {
      id: 'fallback-lose-1',
      name: 'Make a Light Salad',
      ingredients: ['Your product', 'Leafy greens', 'Lemon juice', 'Minimal dressing'],
      instructions: ['Prepare your product', 'Toss with greens', 'Use light dressing'],
      tags: ['low-calorie', 'fresh'],
      suitableFor: ['lose'],
    },
    {
      id: 'fallback-lose-2',
      name: 'Pair with Vegetables',
      ingredients: ['Your product', 'Raw or steamed vegetables', 'Herbs', 'Lemon'],
      instructions: ['Prepare your product', 'Serve with vegetables', 'Season with herbs'],
      tags: ['low-calorie', 'filling'],
      suitableFor: ['lose'],
    },
  ],
  maintain: [
    {
      id: 'fallback-maintain-1',
      name: 'Balanced Plate',
      ingredients: ['Your product', 'Whole grain', 'Vegetables', 'Healthy fat'],
      instructions: ['Prepare your product', 'Add whole grain', 'Include vegetables', 'Add healthy fat'],
      tags: ['balanced', 'complete'],
      suitableFor: ['maintain'],
    },
    {
      id: 'fallback-maintain-2',
      name: 'Simple Preparation',
      ingredients: ['Your product', 'Seasonings', 'Side of choice'],
      instructions: ['Prepare simply', 'Season to taste', 'Serve with balanced side'],
      tags: ['simple', 'versatile'],
      suitableFor: ['maintain'],
    },
  ],
};

// Known product mappings for common items
const productMappings: Record<string, string> = {
  'diet coke': 'beverage',
  'coke': 'beverage',
  'coca-cola': 'beverage',
  'pepsi': 'beverage',
  'sprite': 'beverage',
  'fanta': 'beverage',
  'water': 'beverage',
  'evian': 'beverage',
  'nutella': 'spread',
  'peanut butter': 'spread',
  'jelly': 'spread',
  'jam': 'spread',
  'honey': 'spread',
  'bread': 'bread',
  'bagel': 'bread',
  'tortilla': 'bread',
  'wrap': 'bread',
};

export function getRecipesForGoal(goal: FitnessGoal, productName: string): Recipe[] {
  const normalizedName = productName.toLowerCase();

  // Find matching ingredient
  let matchedIngredient: string | null = null;

  for (const ingredient of Object.keys(recipesByIngredient)) {
    if (normalizedName.includes(ingredient)) {
      matchedIngredient = ingredient;
      break;
    }
  }

  // If we found a matching ingredient, return its recipes for this goal
  if (matchedIngredient && recipesByIngredient[matchedIngredient][goal]) {
    const recipes = recipesByIngredient[matchedIngredient][goal];
    // Add "using [product name]" to each recipe name
    return recipes.map(r => ({
      ...r,
      name: `${r.name} using ${productName}`,
    }));
  }

  // For beverages - special handling
  if (normalizedName.includes('coke') || normalizedName.includes('pepsi') || normalizedName.includes('soda')) {
    return [{
      id: 'beverage-recipe',
      name: `Healthy Alternative to ${productName}`,
      ingredients: ['Sparkling water', 'Fresh lime juice', 'Stevia or natural sweetener', 'Ice'],
      instructions: ['Mix sparkling water with lime', 'Add stevia to taste', 'Serve over ice', 'Consider herbal teas or infused water for daily hydration'],
      tags: ['zero-calorie', 'hydration', 'alternative'],
      suitableFor: [goal],
    }];
  }

  // Return fallback recipes with product name inserted
  return fallbackRecipes[goal].map(r => ({
    ...r,
    name: r.name,
    ingredients: r.ingredients.map(i => i === 'Your product' ? productName : i),
  }));
}
