import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await axios.post('/.netlify/functions/subscribe', { email }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        setEmail('');
      } else {
        throw new Error(response.data.message || 'Subscription failed. Please try again.');
      }
    } catch (error: any) {
      setStatus('error');
      if (error.response) {
        setMessage(error.response.data?.message || 'Server error. Please try again later.');
      } else if (error.request) {
        setMessage('Network error. Please check your connection and try again.');
      } else {
        setMessage(error.message || 'Something went wrong. Please try again.');
      }
      console.error('Subscription error:', error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-orange-400 font-semibold mb-2">Be the First to Know</h3>
        <p className="text-gray-400 text-sm">
          Join our exclusive list to receive early access, launch updates, and special offers when we go live.
        </p>
      </div>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-gray-900 p-2 rounded-lg transition-colors ${
                status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-400'
              }`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
          {status === 'error' && message && (
            <div className="mt-2 text-center text-red-400 text-sm bg-red-400/10 p-2 rounded-lg">
              {message}
            </div>
          )}
        </form>
      ) : (
        <div className="mt-4 text-center text-green-400 bg-green-400/10 p-4 rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
}