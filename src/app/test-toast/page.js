// src/app/components/ToastTest.js
'use client'; // IMPORTANT: This must be a Client Component

import { toast } from 'react-hot-toast';

export default function ToastTest() {
  const showToast = () => {
    toast.success('This is a test toast!');
    // or toast.error(), toast.loading(), etc.
  };

  return (
    <button 
      onClick={showToast}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Show Toast
    </button>
  );
}