'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Product } from '@/lib/types';

interface AddProductFormProps {
  product?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Birthday Cakes',
  'Themed Cakes',
  'Specialty Cakes',
  'Wedding Cakes',
  'Cupcakes',
  'Muffins',
  'Pastries',
  'Cookies',
  'Other'
];

export default function AddProductForm({ product, onSaved, onCancel }: AddProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [preparationTime, setPreparationTime] = useState(product?.preparationTime?.toString() || '');
  const [image, setImage] = useState(product?.image || '');
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setPendingImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async (base64Image: string): Promise<string> => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data.data.url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const finalCategory = category === 'Other' ? customCategory : category;

    if (!name || !finalCategory || !price || !preparationTime) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = image;

      // If there's a new image to upload, upload it first
      if (pendingImage) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImageToCloudinary(pendingImage);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
          setLoading(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category: finalCategory,
          price: parseFloat(price),
          preparationTime: parseInt(preparationTime),
          image: imageUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg border flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG up to 5MB. Recommended: Square image (e.g., 500x500)
            </p>
            {pendingImage && (
              <p className="mt-1 text-xs text-blue-600">
                Image will be uploaded when you save
              </p>
            )}
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImage('');
                  setImagePreview('');
                  setPendingImage(null);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="e.g., Chocolate Truffle Cake"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {category === 'Other' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Enter custom category"
            required
          />
        )}
      </div>

      {/* Price and Preparation Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="e.g., 1500"
            min="0"
            step="1"
            required
          />
        </div>
        <div>
          <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700 mb-2">
            Preparation Time (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="preparationTime"
            value={preparationTime}
            onChange={(e) => setPreparationTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="e.g., 120"
            min="0"
            step="1"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {preparationTime && parseInt(preparationTime) >= 60
              ? `(${Math.floor(parseInt(preparationTime) / 60)} hr ${parseInt(preparationTime) % 60} min)`
              : ''}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (uploadingImage ? 'Uploading image...' : 'Saving...')
            : (product ? 'Update Product' : 'Add Product')
          }
        </button>
      </div>
    </form>
  );
}
