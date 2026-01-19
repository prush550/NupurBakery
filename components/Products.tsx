'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  preparationTime: number;
  image: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  };

  // Default categories to show when no products in database
  const defaultCategories = [
    {
      category: "Birthday Cakes",
      items: ["Classic Birthday Cakes", "Number Cakes", "Photo Cakes", "Multi-Tier Celebration Cakes"],
      priceRange: "₹1,000 - ₹3,000+"
    },
    {
      category: "Themed Cakes",
      items: ["Minecraft Cakes", "Car Cakes", "Doll & Dress Cakes", "Teddy Bear Cakes", "Custom Character Cakes"],
      priceRange: "₹1,500 - ₹3,500+"
    },
    {
      category: "Specialty Cakes",
      items: ["Chocolate Cakes", "Rose Cakes", "Fruit Cakes", "Designer Cakes", "Anniversary Cakes"],
      priceRange: "₹1,000 - ₹3,000+"
    },
    {
      category: "Baked Goods",
      items: ["Muffins with Frosting", "Cupcakes", "Filled Muffins", "Custom Pastries"],
      priceRange: "₹200 - ₹500"
    }
  ];

  const popularFlavors = [
    "Chocolate",
    "Vanilla",
    "Butterscotch",
    "Red Velvet",
    "Black Forest",
    "Pineapple",
    "Strawberry",
    "Mango",
    "Coffee",
    "Custom Flavors"
  ];

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <section id="products" className="section-padding bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From classic favorites to elaborate themed creations - we have something for every celebration
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          /* Display products from database */
          <div className="space-y-12 mb-12">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full">
                    {category}
                  </span>
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-2 border-primary-100"
                    >
                      {/* Product Image */}
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-600">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(product.preparationTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Default category display when no products in database */
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {defaultCategories.map((product, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border-2 border-primary-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{product.category}</h3>
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.priceRange}
                  </span>
                </div>
                <ul className="space-y-2">
                  {product.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 mt-0.5 text-primary-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-secondary-100 to-primary-100 p-8 md:p-12 rounded-2xl shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Popular Flavors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularFlavors.map((flavor, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-gray-800 font-medium">{flavor}</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-gray-700 text-lg">
            Don&apos;t see what you&apos;re looking for? <strong>We customize!</strong>
          </p>
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border-l-4 border-primary-600">
          <h4 className="text-xl font-bold text-gray-900 mb-4">Ordering Information</h4>
          <div className="space-y-2 text-gray-700">
            <p><strong>Minimum Order:</strong> ₹1,000 (1 kg base price)</p>
            <p><strong>Customization:</strong> Pricing varies based on design complexity, flavor, and personalization</p>
            <p><strong>Lead Time:</strong> Please order at least 1 day in advance</p>
            <p><strong>Delivery:</strong> Available within Bhopal (charges apply based on distance and timing)</p>
            <p><strong>Portfolio:</strong> We have created 30+ unique designs - contact us to see our full portfolio!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
