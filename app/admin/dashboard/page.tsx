'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Order } from '@/lib/types';
import { OrderStats } from '@/lib/db';
import AddProductForm from '@/components/admin/AddProductForm';
import ProductList from '@/components/admin/ProductList';

type TabType = 'overview' | 'orders' | 'products';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (!data.success || !data.data?.authenticated) {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/orders/stats')
      ]);

      const [productsData, ordersData, statsData] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        statsRes.json()
      ]);

      if (productsData.success) setProducts(productsData.data || []);
      if (ordersData.success) setOrders(ordersData.data || []);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle product saved
  const handleProductSaved = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    fetchData();
  };

  // Handle delete product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        alert('Failed to delete product');
      }
    } catch {
      alert('Failed to delete product');
    }
  };

  // Handle edit product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Failed to update order status');
      }
    } catch {
      alert('Failed to update order status');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary-700">Nupur Bakery</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              View Website
            </a>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
              {stats && stats.pending > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Products
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Revenue Stats */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <h3 className="text-gray-500 text-sm font-medium">Today</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.today.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.today.count} orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <h3 className="text-gray-500 text-sm font-medium">This Week</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.thisWeek.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.thisWeek.count} orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                  <h3 className="text-gray-500 text-sm font-medium">This Month</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.thisMonth.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.thisMonth.count} orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
                  <h3 className="text-gray-500 text-sm font-medium">All Time</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.allTime.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{stats.allTime.count} orders</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
                  <p className="text-sm text-yellow-600 mt-1">Pending</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">{stats.confirmed}</p>
                  <p className="text-sm text-blue-600 mt-1">Confirmed</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-700">{stats.preparing}</p>
                  <p className="text-sm text-purple-600 mt-1">Preparing</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-700">{stats.ready}</p>
                  <p className="text-sm text-green-600 mt-1">Ready</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{stats.delivered}</p>
                  <p className="text-sm text-emerald-600 mt-1">Delivered</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
                  <p className="text-sm text-red-600 mt-1">Cancelled</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {new Set(products.map(p => p.category)).size}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Avg. Price</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {products.length > 0
                      ? `₹${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}`
                      : '₹0'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{order.customerName}</div>
                            <div className="text-xs text-gray-500">{order.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {order.productName || 'General Order'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ₹{order.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>
              <button
                onClick={fetchData}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">₹{order.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Customer</h4>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerPhone}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          <p className="text-sm text-gray-600 mt-1">{order.customerAddress}</p>
                        </div>

                        {/* Product/Order Info */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Order Details</h4>
                          {order.productName ? (
                            <div className="flex items-start gap-3">
                              {order.productImage && (
                                <img
                                  src={order.productImage}
                                  alt={order.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{order.productName}</p>
                                {order.flavor && <p className="text-sm text-gray-600">Flavor: {order.flavor}</p>}
                                {order.weight && <p className="text-sm text-gray-600">Size: {order.weight}</p>}
                                {order.cakeMessage && <p className="text-sm text-gray-600">Message: "{order.cakeMessage}"</p>}
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600">General Order</p>
                          )}
                          {order.specialInstructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Notes:</span> {order.specialInstructions}
                            </p>
                          )}
                        </div>

                        {/* Delivery Info */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                            {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                          </h4>
                          <p className="font-medium text-gray-900">
                            {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{order.deliveryTime}</p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-500">Update Status:</span>
                        {(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order.id, status)}
                            disabled={order.status === status}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              order.status === status
                                ? `${getStatusColor(status)} ring-2 ring-offset-1 ring-gray-400`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddForm(true);
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                + Add Product
              </button>
            </div>

            {/* Add/Edit Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingProduct(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <AddProductForm
                    product={editingProduct}
                    onSaved={handleProductSaved}
                    onCancel={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Product List */}
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}
