'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TestToastPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Auto show a toast when page loads
    setTimeout(() => {
      toast.success('Page loaded! Toasts should appear top-right.');
    }, 500);
  }, []);

  const showToast = (type) => {
    const newCount = count + 1;
    setCount(newCount);
    
    switch(type) {
      case 'success':
        toast.success(`Success toast #${newCount}!`);
        break;
      case 'error':
        toast.error(`Error toast #${newCount}!`);
        break;
      case 'loading':
        const loadingId = toast.loading(`Loading #${newCount}...`);
        setTimeout(() => {
          toast.dismiss(loadingId);
          toast.success(`Finished #${newCount}!`);
        }, 1500);
        break;
      default:
        toast(`Default toast #${newCount}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Toast Test Page</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Check the top-right corner of your screen for toast notifications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => showToast('success')}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Show Success Toast
          </button>
          
          <button
            onClick={() => showToast('error')}
            className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Show Error Toast
          </button>
          
          <button
            onClick={() => showToast('loading')}
            className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
          >
            Show Loading Toast
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">Debug Information</h2>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li className="flex items-start">
              <div className="size-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
              <span>Toast Count: <strong>{count}</strong></span>
            </li>
            <li className="flex items-start">
              <div className="size-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
              <span>Look for notifications at the <strong>top-right</strong> corner</span>
            </li>
            <li className="flex items-start">
              <div className="size-2 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></div>
              <span>Check browser console for errors (F12)</span>
            </li>
          </ul>
        </div>

        {/* Debug indicator in top-right */}
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          ↑ Toasts should appear here ↑
        </div>
      </div>
    </div>
  );
}