'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// HOC for protecting routes
export default function withAuth(WrappedComponent, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { user, loading, initialCheckDone } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && initialCheckDone) {
        // If no user, redirect to login
        if (!user) {
          router.push('/signin');
          return;
        }

        // Check if user role is allowed
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          console.log(`🚫 Access denied for role: ${user.role}`);
          alert(`Access Denied: You don't have permission to access this page.`);
          router.push('/signin');
        }
      }
    }, [user, loading, initialCheckDone, router]);

    // Show loading while checking auth
    if (loading || !initialCheckDone) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Show nothing if not authenticated (will redirect)
    if (!user) {
      return null;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}