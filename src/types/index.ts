export interface NutritionData {
  protein: number;
  carbs: number;
  sugar: number;
  fiber: number;
  fat: number;
  calories: number;
}

export interface Additive {
  code: string;
  name: string;
  risk: 'high' | 'medium' | 'low';
}

export interface Product {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  nutrition: NutritionData; // always per 100g (canonical basis used for scoring)
  servingSize?: string; // human-readable, e.g. "15 g" (from the label, if known)
  servingQuantity?: number; // serving size in grams, e.g. 15 (if known)
  additives: Additive[];
  dietaryFlags: string[];
  score: number;
}

export type FitnessGoal = 'gain' | 'lose' | 'maintain';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  suitableFor: FitnessGoal[];
}
