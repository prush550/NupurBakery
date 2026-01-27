'use client';

import { useState, useEffect } from 'react';

interface TreasureVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TreasureVault({ isOpen, onClose }: TreasureVaultProps) {
  const [puzzle, setPuzzle] = useState('');
  const [couponsRemaining, setCouponsRemaining] = useState(0);
  const [passcode, setPasscode] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    couponCode?: string;
  } | null>(null);
  const [vaultOpen, setVaultOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPuzzle();
      setPasscode(['', '', '']);
      setResult(null);
      setVaultOpen(false);
    }
  }, [isOpen]);

  const fetchPuzzle = async () => {
    try {
      const response = await fetch('/api/treasure-hunt/puzzle');
      const data = await response.json();
      if (data.success) {
        setPuzzle(data.data.puzzle);
        setCouponsRemaining(data.data.couponsRemaining);
      }
    } catch (error) {
      console.error('Failed to fetch puzzle:', error);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    // Auto-focus next input
    if (value && index < 2) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !passcode[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = passcode.join('');
    if (code.length !== 3) {
      setResult({ success: false, message: 'Please enter all 3 digits' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/treasure-hunt/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: code })
      });

      const data = await response.json();
      if (data.success) {
        if (data.data.correct) {
          setVaultOpen(true);
          setResult({
            success: true,
            message: data.data.message,
            couponCode: data.data.coupon?.code
          });
        } else {
          setResult({ success: false, message: data.data.message });
          setPasscode(['', '', '']);
        }
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong' });
      }
    } catch {
      setResult({ success: false, message: 'Failed to verify. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-yellow-900 hover:text-yellow-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-yellow-900">Secret Vault</h2>
          <p className="text-yellow-800 text-sm mt-1">
            {couponsRemaining > 0
              ? `${couponsRemaining} coupon${couponsRemaining > 1 ? 's' : ''} remaining today!`
              : 'All coupons claimed today!'
            }
          </p>
        </div>

        <div className="p-6">
          {!vaultOpen ? (
            <>
              {/* Vault Door Animation */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border-8 border-gray-500 flex items-center justify-center shadow-inner relative">
                  <div className="absolute inset-4 rounded-full border-4 border-gray-600"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Puzzle */}
              <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
                <h3 className="text-yellow-400 font-semibold mb-2 text-center">Solve the Puzzle</h3>
                <p className="text-gray-200 text-center text-sm">{puzzle}</p>
              </div>

              {/* Passcode Input */}
              <div className="mb-6">
                <p className="text-gray-400 text-center text-sm mb-3">Enter the 3-digit passcode:</p>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2].map((index) => (
                    <input
                      key={index}
                      id={`digit-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={passcode[index]}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-16 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Result Message */}
              {result && !result.success && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center text-sm">
                  {result.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || passcode.join('').length !== 3}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-yellow-900 disabled:text-gray-400 py-3 rounded-lg font-bold transition-all"
              >
                {loading ? 'Verifying...' : 'Unlock Vault'}
              </button>
            </>
          ) : (
            /* Vault Opened - Show Coupon */
            <div className="text-center">
              {/* Success Animation */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
              <p className="text-gray-300 mb-6">{result?.message}</p>

              {/* Coupon Code */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                  }}></div>
                </div>
                <p className="text-primary-200 text-sm mb-2">Your Discount Code</p>
                <p className="text-3xl font-bold text-white tracking-wider">{result?.couponCode}</p>
                <p className="text-primary-200 text-sm mt-2">30% OFF</p>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full"></div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <p className="text-yellow-400 text-sm">
                  Valid today only! Use this code while placing your order.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(result?.couponCode || '');
                  alert('Coupon code copied!');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-3"
              >
                Copy Code
              </button>
              <button
                onClick={onClose}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
