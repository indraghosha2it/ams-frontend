'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User from localStorage:', localStorage.getItem('user'));
    console.log('==================');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Debug Information</h1>
      <p>Check browser console for debug info</p>
    </div>
  );
}