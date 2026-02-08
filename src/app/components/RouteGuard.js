// // src/app/components/RouteGuard.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';

// const RouteGuard = ({ children, allowedRoles = [] }) => {
//   const router = useRouter();
//   const [authorized, setAuthorized] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       setLoading(true);
      
//       // Get user from localStorage
//       const userString = localStorage.getItem('user');
//       const token = localStorage.getItem('token');
      
//       if (!token || !userString) {
//         // No token or user, redirect to signin
//         toast.error('Please sign in to continue');
//         router.push('/signin');
//         return;
//       }
      
//       try {
//         const user = JSON.parse(userString);
        
//         // Check if user role is allowed
//         if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//           toast.error('Access denied. You do not have permission to view this page.');
          
//           // Redirect based on role
//           switch(user.role) {
//             case 'admin':
//               router.push('/admin/dashboard');
//               break;
//             case 'staff':
//               router.push('/staff/dashboard');
//               break;
//             case 'client':
//               router.push('/client/dashboard');
//               break;
//             default:
//               router.push('/signin');
//           }
//           return;
//         }
        
//         // Optional: Verify token with backend (more secure)
//         verifyTokenWithBackend(token, user);
        
//         setAuthorized(true);
//       } catch (error) {
//         console.error('Auth check error:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         router.push('/signin');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     checkAuth();
    
//     // Listen for storage changes (if user logs out in another tab)
//     const handleStorageChange = (e) => {
//       if (e.key === 'token' && !e.newValue) {
//         router.push('/signin');
//       }
//     };
    
//     window.addEventListener('storage', handleStorageChange);
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [router, allowedRoles]);

//   // Optional: Verify token with backend
//   const verifyTokenWithBackend = async (token, user) => {
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
//       const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Token verification failed');
//       }
//     } catch (error) {
//       console.error('Token verification error:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       router.push('/signin');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <h3 className="text-xl font-semibold text-slate-800">Verifying Access...</h3>
//           <p className="text-slate-600 mt-2">Please wait while we verify your permissions</p>
//         </div>
//       </div>
//     );
//   }

//   return authorized ? children : null;
// };

// export default RouteGuard;


// src/app/components/RouteGuard.js - UPDATED VERSION
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const RouteGuard = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      
      // Get user from localStorage
      const userString = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!token || !userString) {
        // No token or user, redirect to signin
        toast.error('Session expired. Please sign in again.');
        router.push('/signin');
        return;
      }
      
      try {
        const user = JSON.parse(userString);
        
        // Check if user role is allowed
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          // LOG USER OUT IMMEDIATELY
          toast.error('Access denied. Unauthorized access detected. Logging out...');
          
          // Clear all user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Clear any other stored data
          localStorage.removeItem('darkMode');
          sessionStorage.clear();
          
          // Redirect to signin with error message
          setTimeout(() => {
            router.push('/signin?error=unauthorized');
          }, 1000);
          
          return;
        }
        
        // Optional: Verify token with backend for extra security
        verifyTokenWithBackend(token);
        
        setAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear data and redirect on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Authentication error. Please sign in again.');
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (if user logs out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        router.push('/signin');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, allowedRoles]);

  // Optional: Verify token with backend
  const verifyTokenWithBackend = async (token) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/signin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800">Verifying Access...</h3>
          <p className="text-slate-600 mt-2">Checking your permissions</p>
        </div>
      </div>
    );
  }

  return authorized ? children : null;
};

export default RouteGuard;