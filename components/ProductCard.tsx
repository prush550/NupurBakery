'use client';

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onOrder: () => void;
}

export default function ProductCard({ product, onClick, onOrder }: ProductCardProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div
        className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 cursor-pointer relative overflow-hidden"
        onClick={onClick}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-900 px-4 py-2 rounded-lg font-medium">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
          {product.category}
        </span>

        {/* Name */}
        <h3
          className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition-colors"
          onClick={onClick}
        >
          {product.name}
        </h3>

        {/* Price and Time */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Order Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOrder();
          }}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
