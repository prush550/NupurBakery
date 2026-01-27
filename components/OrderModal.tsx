'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface OrderModalProps {
  product: Product | null;
  onClose: () => void;
}

const FLAVORS = [
  'Chocolate',
  'Vanilla',
  'Butterscotch',
  'Red Velvet',
  'Black Forest',
  'Pineapple',
  'Strawberry',
  'Mango',
  'Coffee',
  'Custom (specify in instructions)'
];

const WEIGHTS = [
  '500g (Half Kg)',
  '1 Kg',
  '1.5 Kg',
  '2 Kg',
  '2.5 Kg',
  '3 Kg',
  'Custom (specify in instructions)'
];

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [cakeMessage, setCakeMessage] = useState('');
  const [flavor, setFlavor] = useState('');
  const [weight, setWeight] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, loading]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() })
      });

      const data = await response.json();
      if (data.success && data.data.valid) {
        setCouponApplied(true);
        setCouponDiscount(data.data.discount);
        setCouponMessage(data.data.message);
      } else {
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponMessage(data.data?.message || 'Invalid coupon');
      }
    } catch {
      setCouponMessage('Failed to validate coupon');
    }
  };

  const getDiscountedPrice = () => {
    const basePrice = product?.price || 1000;
    if (couponApplied && couponDiscount > 0) {
      return Math.round(basePrice * (1 - couponDiscount / 100));
    }
    return basePrice;
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          deliveryDate,
          deliveryTime,
          deliveryType,
          cakeMessage,
          flavor,
          weight,
          specialInstructions,
          couponCode: couponApplied ? couponCode : undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setOrderNumber(data.data.orderNumber);
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to place an order.\n\n` +
      `Order Number: ${orderNumber}\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n` +
      (product ? `Product: ${product.name}\n` : '') +
      (flavor ? `Flavor: ${flavor}\n` : '') +
      (weight ? `Weight: ${weight}\n` : '') +
      `Delivery: ${deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}\n` +
      `Date: ${deliveryDate}\n` +
      `Time: ${deliveryTime}\n` +
      (cakeMessage ? `Cake Message: "${cakeMessage}"\n` : '') +
      (specialInstructions ? `Special Instructions: ${specialInstructions}` : '')
    );
    window.open(`https://wa.me/917879797978?text=${message}`, '_blank');
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-2">Your order number is:</p>
          <p className="text-2xl font-bold text-primary-600 mb-4">{orderNumber}</p>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a confirmation email to <strong>{customerEmail}</strong>
          </p>

          <div className="space-y-3">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onClose()} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {product ? `Order: ${product.name}` : 'Place Your Order'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={() => !loading && onClose()}
            className="text-gray-400 hover:text-gray-600 p-2"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Customer Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Your Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery/Pickup</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'delivery'}
                      onChange={() => setDeliveryType('delivery')}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="ml-2">Delivery</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="ml-2">Pickup</span>
                  </label>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full delivery address"
                    rows={3}
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customization */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Customize Your Order</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flavor</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                >
                  <option value="">Select a flavor</option>
                  {FLAVORS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight/Size</label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
                >
                  <option value="">Select weight</option>
                  {WEIGHTS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message on Cake</label>
                <input
                  type="text"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Happy Birthday John!"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">{cakeMessage.length}/50 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requests, allergies, or design preferences..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Review Your Order</h3>

              {product && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-primary-600 font-bold">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-900 font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{customerEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{customerPhone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900">{deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Address</span>
                    <span className="text-gray-900 text-right max-w-[60%]">{customerAddress}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Date & Time</span>
                  <span className="text-gray-900">{deliveryDate} at {deliveryTime}</span>
                </div>
                {flavor && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Flavor</span>
                    <span className="text-gray-900">{flavor}</span>
                  </div>
                )}
                {weight && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Weight</span>
                    <span className="text-gray-900">{weight}</span>
                  </div>
                )}
                {cakeMessage && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Cake Message</span>
                    <span className="text-gray-900">&quot;{cakeMessage}&quot;</span>
                  </div>
                )}
                {specialInstructions && (
                  <div className="py-2 border-b">
                    <span className="text-gray-500 block mb-1">Special Instructions</span>
                    <span className="text-gray-900">{specialInstructions}</span>
                  </div>
                )}
              </div>

              {/* Coupon Code */}
              <div className="border rounded-lg p-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponApplied(false);
                      setCouponMessage('');
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponApplied(false);
                        setCouponCode('');
                        setCouponDiscount(0);
                        setCouponMessage('');
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`text-sm mt-2 ${couponApplied ? 'text-green-600' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="bg-primary-50 p-4 rounded-lg mt-4">
                {couponApplied && (
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Original Price</span>
                    <span className="text-gray-500 line-through">₹{(product?.price || 1000).toLocaleString()}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-green-600">Discount ({couponDiscount}%)</span>
                    <span className="text-green-600">-₹{Math.round((product?.price || 1000) * couponDiscount / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Estimated Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{getDiscountedPrice().toLocaleString()}+
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Final price may vary based on customization. We&apos;ll confirm the exact price.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => {
                // Validate step 1
                if (step === 1) {
                  if (!customerName || !customerEmail || !customerPhone || !deliveryDate || !deliveryTime) {
                    setError('Please fill in all required fields');
                    return;
                  }
                  if (deliveryType === 'delivery' && !customerAddress) {
                    setError('Please enter your delivery address');
                    return;
                  }
                }
                setError('');
                setStep(step + 1);
              }}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
