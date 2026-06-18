'use client';

import { Product, FitnessGoal } from '@/types';
import { getScoreColor, getScoreText } from '@/lib/score';
import { getRecipesForGoal } from '@/lib/recipes';

interface ProductDisplayProps {
  product: Product;
  goal: FitnessGoal;
}

export default function ProductDisplay({ product, goal }: ProductDisplayProps) {
  const scoreColor = getScoreColor(product.score);
  const scoreText = getScoreText(product.score);
  const recipes = getRecipesForGoal(goal, product.name);

  const goalLabels: Record<FitnessGoal, string> = {
    gain: 'Gain Muscle',
    lose: 'Lose Fat',
    maintain: 'Maintain Weight',
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Product Header */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="mb-4 h-48 w-full rounded-lg object-contain"
          />
        )}
        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
        {product.brand && (
          <p className="text-gray-500">{product.brand}</p>
        )}

        {/* Score */}
        <div className="mt-6 flex items-center gap-4">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full ${scoreColor} text-2xl font-bold text-white`}>
            {product.score}
          </div>
          <div>
            <p className="text-sm text-gray-500">Health Score</p>
            <p className="text-lg font-semibold">{scoreText}</p>
          </div>
        </div>
      </div>

      {/* Nutrition Facts */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Nutrition (per 100g)</h3>
        <div className="grid grid-cols-2 gap-4">
          <NutritionItem label="Protein" value={product.nutrition.protein} unit="g" color="bg-green-100" />
          <NutritionItem label="Carbs" value={product.nutrition.carbs} unit="g" color="bg-yellow-100" />
          <NutritionItem label="Sugar" value={product.nutrition.sugar} unit="g" color="bg-orange-100" />
          <NutritionItem label="Fiber" value={product.nutrition.fiber} unit="g" color="bg-green-100" />
          <NutritionItem label="Fat" value={product.nutrition.fat} unit="g" color="bg-red-100" />
          <NutritionItem label="Calories" value={product.nutrition.calories} unit="kcal" color="bg-blue-100" />
        </div>
      </div>

      {/* Dietary Flags */}
      {product.dietaryFlags.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold">Dietary Info</h3>
          <div className="flex flex-wrap gap-2">
            {product.dietaryFlags.map((flag, i) => (
              <span
                key={i}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additives */}
      {product.additives.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold">Additives ({product.additives.length})</h3>
          <div className="space-y-2">
            {product.additives.map((additive, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg p-3 ${
                  additive.risk === 'high'
                    ? 'bg-red-50'
                    : additive.risk === 'medium'
                    ? 'bg-yellow-50'
                    : 'bg-green-50'
                }`}
              >
                <div>
                  <p className="font-medium">{additive.name}</p>
                  <p className="text-sm text-gray-500">{additive.code}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    additive.risk === 'high'
                      ? 'bg-red-500 text-white'
                      : additive.risk === 'medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {additive.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Suggestions */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">
          Recipes for {goalLabels[goal]}
        </h3>
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">{recipe.name}</h4>

              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">Ingredients:</p>
                <p className="text-sm text-gray-500">{recipe.ingredients.join(', ')}</p>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NutritionItem({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg ${color} p-3`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-bold">
        {Math.round(value * 10) / 10}
        <span className="ml-1 text-sm font-normal">{unit}</span>
      </p>
    </div>
  );
}
