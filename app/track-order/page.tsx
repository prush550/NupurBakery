'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/types';

type SearchType = 'orderNumber' | 'phone' | 'email';

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<SearchType>('orderNumber');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setError('Please enter a search value');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/track?type=${searchType}&value=${encodeURIComponent(searchValue.trim())}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
        if (data.data?.length === 0) {
          setError('No orders found. Please check your details and try again.');
        }
      } else {
        setError(data.error || 'Failed to find orders');
        setOrders([]);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-200 text-green-900';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Being Prepared';
      case 'ready': return 'Ready for Pickup/Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">
            Nupur Bakery
          </Link>
          <Link
            href="/products"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View Products
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
              <p className="text-gray-600">
                Enter your order number, phone number, or email to view your order status
              </p>
            </div>

            <form onSubmit={handleSearch}>
              {/* Search Type Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => { setSearchType('orderNumber'); setSearchValue(''); setError(''); }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'orderNumber'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Order Number
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchType('phone'); setSearchValue(''); setError(''); }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'phone'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Phone Number
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchType('email'); setSearchValue(''); setError(''); }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'email'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <input
                  type={searchType === 'email' ? 'email' : 'text'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'orderNumber'
                      ? 'Enter order number (e.g., NB2501210001)'
                      : searchType === 'phone'
                      ? 'Enter your phone number'
                      : 'Enter your email address'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Orders Results */}
          {searched && orders.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {orders.length === 1 ? 'Your Order' : `Found ${orders.length} Orders`}
              </h2>

              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    {/* Product Info */}
                    {order.productName && (
                      <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                        {order.productImage && (
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                          <p className="text-primary-600 font-bold">₹{order.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Order Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'} Time</p>
                        <p className="font-medium text-gray-900">{order.deliveryTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-bold text-primary-600">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Customization Details */}
                    {(order.cakeMessage || order.flavor || order.weight || order.specialInstructions) && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium text-gray-900 mb-3">Customization</h4>
                        <div className="space-y-2 text-sm">
                          {order.cakeMessage && (
                            <p><span className="text-gray-500">Message:</span> "{order.cakeMessage}"</p>
                          )}
                          {order.flavor && (
                            <p><span className="text-gray-500">Flavor:</span> {order.flavor}</p>
                          )}
                          {order.weight && (
                            <p><span className="text-gray-500">Size:</span> {order.weight}</p>
                          )}
                          {order.specialInstructions && (
                            <p><span className="text-gray-500">Instructions:</span> {order.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex items-center justify-between text-xs">
                      {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status, index) => {
                        const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
                        const currentIndex = statusOrder.indexOf(order.status);
                        const isCompleted = index <= currentIndex && order.status !== 'cancelled';
                        const isCurrent = status === order.status;

                        return (
                          <div key={status} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              } ${isCurrent ? 'ring-2 ring-green-300' : ''}`}
                            >
                              {isCompleted ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <span className={`text-center ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                              {status === 'pending' ? 'Received' :
                               status === 'confirmed' ? 'Confirmed' :
                               status === 'preparing' ? 'Preparing' :
                               status === 'ready' ? 'Ready' : 'Delivered'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center text-gray-600">
            <p className="mb-2">Need help with your order?</p>
            <a
              href="https://wa.me/917879797978"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
