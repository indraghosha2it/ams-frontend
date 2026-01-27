'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ToastTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <h3 className="font-semibold mb-2">Toast Test</h3>
      <div className="space-y-2">
        <button
          onClick={() => {
            toast.success(`Success toast #${count}!`);
            setCount(count + 1);
          }}
          className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600"
        >
          Test Success
        </button>
        <button
          onClick={() => {
            toast.error(`Error toast #${count}!`);
            setCount(count + 1);
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Test Error
        </button>
        <button
          onClick={() => {
            toast('Default toast #' + count);
            setCount(count + 1);
          }}
          className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Test Default
        </button>
      </div>
    </div>
  );
}