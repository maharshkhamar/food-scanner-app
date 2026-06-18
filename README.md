# Food Scanner App

A web app that scans food barcodes and provides nutritional analysis with health scores.

## Features

- **Barcode Scanning**: Use your camera to scan product barcodes
- **Nutrition Analysis**: View protein, carbs, sugar, fiber, fat, and calories per 100g
- **Health Score**: 0-100 score based on nutritional value and additives
- **Additive Classification**: High, medium, and low risk additive flags
- **Dietary Flags**: Vegan, vegetarian, gluten-free, kosher, halal, organic detection
- **Recipe Suggestions**: Get recipe ideas based on your fitness goal
- **Scan History**: Automatically saves your recent scans

## Tech Stack

- Next.js 16 with TypeScript
- Tailwind CSS
- html5-qrcode for barcode scanning
- Open Food Facts API for product data

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## How It Works

1. Select your fitness goal (Gain Muscle, Lose Fat, or Maintain Weight)
2. Tap "Scan" and point camera at a food product barcode
3. View nutritional breakdown and health score
4. See recipe suggestions based on your goal

## Scoring Algorithm

The health score (0-100) is calculated based on:
- **Protein**: +5 to +20 points
- **Fiber**: +5 to +15 points
- **Sugar**: -5 to -20 points penalty
- **Simple carbs**: -10 points if high carbs + low fiber
- **Additives**: -2 to -5 points per additive based on risk level

## Data Source

Product data is fetched from [Open Food Facts](https://world.openfoodfacts.org/), a free and open database of food products from around the world.

## Future Enhancements

- User authentication
- Daily nutrition tracking
- Mobile app (React Native)
- AI-powered recipe generation
- Compare products side-by-side
