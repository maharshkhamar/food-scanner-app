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
  nutrition: NutritionData;
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
