import { NutritionData, Additive } from '@/types';

export function calculateScore(nutrition: NutritionData, additives: Additive[]): number {
  let score = 50; // Base score

  // Protein bonus (max +20)
  if (nutrition.protein >= 20) score += 20;
  else if (nutrition.protein >= 10) score += 10;
  else if (nutrition.protein >= 5) score += 5;

  // Fiber bonus (max +15)
  if (nutrition.fiber >= 5) score += 15;
  else if (nutrition.fiber >= 3) score += 10;
  else if (nutrition.fiber >= 1) score += 5;

  // Sugar penalty (max -20)
  if (nutrition.sugar > 20) score -= 20;
  else if (nutrition.sugar > 10) score -= 10;
  else if (nutrition.sugar > 5) score -= 5;

  // Carbs penalty for simple carbs (max -10)
  if (nutrition.carbs > 50 && nutrition.fiber < 3) score -= 10;

  // Additive penalties
  const highRisk = additives.filter(a => a.risk === 'high').length;
  const mediumRisk = additives.filter(a => a.risk === 'medium').length;
  score -= (highRisk * 5) + (mediumRisk * 2);

  return Math.max(0, Math.min(100, score));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getScoreText(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}
