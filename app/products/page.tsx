'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import OrderModal from '@/components/OrderModal';
import HiddenNut from '@/components/HiddenNut';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'time-asc' | 'time-desc';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  // Get price range from products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'time-asc':
          return a.preparationTime - b.preparationTime;
        case 'time-desc':
          return b.preparationTime - a.preparationTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, priceRange, sortBy]);

  const handleOrderClick = (product: Product) => {
    setOrderProduct(product);
    setShowOrderModal(true);
    setSelectedProduct(null);
  };

  const handleGeneralOrder = () => {
    setOrderProduct(null);
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-primary-700">
            Nupur Bakery
          </a>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-primary-600">Home</a>
            <a href="/products" className="text-primary-600 font-medium">Products</a>
            <a href="/#contact" className="text-gray-600 hover:text-primary-600">Contact</a>
            <button
              onClick={handleGeneralOrder}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Order Now
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Explore our delicious collection of cakes and baked goods</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">₹{priceRange[0]}</span>
                    <span className="text-sm text-gray-500">-</span>
                    <span className="text-sm text-gray-500">₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="time-asc">Prep Time (Fastest)</option>
                  <option value="time-desc">Prep Time (Longest)</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, maxPrice]);
                  setSortBy('name-asc');
                }}
                className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, maxPrice]);
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      onOrder={() => handleOrderClick(product)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrder={() => handleOrderClick(selectedProduct)}
        />
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          product={orderProduct}
          onClose={() => {
            setShowOrderModal(false);
            setOrderProduct(null);
          }}
        />
      )}

      {/* Hidden Nut for Treasure Hunt */}
      <HiddenNut />
    </div>
  );
}
