'use client';

import { useState, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductDisplay from '@/components/ProductDisplay';
import { fetchProduct, searchWholeFood } from '@/lib/api';
import { calculateScore } from '@/lib/score';
import { Product, FitnessGoal } from '@/types';

interface ScanHistory {
  barcode: string;
  product: Product;
  scannedAt: string;
}

export default function Home() {
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Load goal from localStorage on mount
  useEffect(() => {
    const savedGoal = localStorage.getItem('fitnessGoal') as FitnessGoal;
    if (savedGoal) {
      setGoal(savedGoal);
    }
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save goal to localStorage
  const handleSetGoal = (newGoal: FitnessGoal) => {
    setGoal(newGoal);
    localStorage.setItem('fitnessGoal', newGoal);
  };

  // Handle barcode scan
  const handleScan = async (barcode: string) => {
    setLoading(true);
    setError(null);
    setProduct(null);

    const fetchedProduct = await fetchProduct(barcode);

    if (fetchedProduct) {
      // Calculate score
      fetchedProduct.score = calculateScore(
        fetchedProduct.nutrition,
        fetchedProduct.additives
      );
      setProduct(fetchedProduct);

      // Save to history
      const newHistory: ScanHistory = {
        barcode,
        product: fetchedProduct,
        scannedAt: new Date().toISOString(),
      };
      const updatedHistory = [newHistory, ...history].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
    } else {
      setError('Product not found. Try scanning a different barcode or searching by name.');
    }

    setLoading(false);
    setShowScanner(false);
  };

  // Handle whole food search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setProduct(null);
    setSearchResults([]);

    const results = await searchWholeFood(searchQuery);

    if (results.length > 0) {
      // Calculate scores for all results
      const scoredResults = results.map(p => ({
        ...p,
        score: calculateScore(p.nutrition, p.additives)
      }));
      setSearchResults(scoredResults);
    } else {
      setError('No foods found. Try searching for something like "apple", "broccoli", or "chicken breast"');
    }

    setLoading(false);
  };

  // Select a search result
  const selectSearchResult = (selectedProduct: Product) => {
    setProduct(selectedProduct);
    setSearchResults([]);
    setSearchQuery('');
    setShowSearch(false);

    // Save to history
    const newHistory: ScanHistory = {
      barcode: selectedProduct.barcode || 'search',
      product: selectedProduct,
      scannedAt: new Date().toISOString(),
    };
    const updatedHistory = [newHistory, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  // Goal Selection Screen
  if (!goal) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Food Scanner</h1>
            <p className="mt-2 text-gray-600">Scan packaged foods or search whole foods</p>
          </div>

          <h2 className="mb-4 text-center text-lg font-semibold">What is your goal?</h2>

          <div className="space-y-3">
            <button
              onClick={() => handleSetGoal('gain')}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white transition-transform hover:scale-[1.02]"
            >
              <p className="text-lg font-bold">Gain Muscle</p>
              <p className="text-sm opacity-90">High protein, calorie surplus</p>
            </button>

            <button
              onClick={() => handleSetGoal('lose')}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white transition-transform hover:scale-[1.02]"
            >
              <p className="text-lg font-bold">Lose Fat</p>
              <p className="text-sm opacity-90">Low calorie, nutrient dense</p>
            </button>

            <button
              onClick={() => handleSetGoal('maintain')}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white transition-transform hover:scale-[1.02]"
            >
              <p className="text-lg font-bold">Maintain Weight</p>
              <p className="text-sm opacity-90">Balanced nutrition</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main App Screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Food Scanner</h1>
            <p className="text-sm text-gray-500">
              Goal: {goal === 'gain' ? 'Gain Muscle' : goal === 'lose' ? 'Lose Fat' : 'Maintain Weight'}
            </p>
          </div>
          <button
            onClick={() => setGoal(null)}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Change
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md p-4">
        {!product && !loading && (
          <div className="mt-4 space-y-4">
            {/* Search Bar for Whole Foods */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whole foods (e.g., apple, broccoli)..."
                className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="rounded-2xl bg-white p-4 shadow-lg">
                <h3 className="mb-3 text-lg font-semibold">Search Results</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {searchResults.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => selectSearchResult(item)}
                      className="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 text-left hover:bg-gray-100"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.nutrition.calories} kcal | {item.nutrition.protein}g protein
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        item.score >= 70 ? 'bg-green-100 text-green-800' :
                        item.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.score}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Barcode Scanner Button */}
            <button
              onClick={() => setShowScanner(true)}
              className="flex h-40 w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg transition-transform hover:scale-[1.02]"
            >
              <svg className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg font-bold">Scan Barcode</p>
              <p className="text-sm opacity-90">For packaged foods</p>
            </button>

            {/* Quick History */}
            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 text-left text-lg font-semibold">Recent Scans</h3>
                <div className="space-y-2">
                  {history.slice(0, 5).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setProduct(item.product)}
                      className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm hover:bg-gray-50"
                    >
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Score: {item.product.score}/100
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-12 flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Looking up product...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  setShowScanner(true);
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Scan Barcode
              </button>
              <button
                onClick={() => setError(null)}
                className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {product && <ProductDisplay product={product} goal={goal} />}

        {product && (
          <button
            onClick={() => {
              setProduct(null);
              setError(null);
              setShowScanner(true);
            }}
            className="mt-6 w-full rounded-xl bg-green-500 py-4 font-bold text-white hover:bg-green-600"
          >
            Scan Another Product
          </button>
        )}
      </main>

      {/* Scanner Modal */}
      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}
