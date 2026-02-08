// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ams-backend-psi.vercel.app';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [hasChecked, setHasChecked] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   // Get token from localStorage
//   const getToken = () => {
//     if (typeof window === 'undefined') return null;
//     return localStorage.getItem('token');
//   };

//   // Clear auth
//   const clearAuth = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//     }
//     setUser(null);
//   };

//   // Initial auth check - RUNS ONLY ONCE
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();
      
//       if (!token) {
//         console.log('🔍 No token found');
//         setLoading(false);
//         setHasChecked(true);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.success) {
//             setUser(data.user);
//           } else {
//             clearAuth();
//           }
//         } else {
//           clearAuth();
//         }
//       } catch (error) {
//         console.error('Auth check error:', error);
//         clearAuth();
//       } finally {
//         setLoading(false);
//         setHasChecked(true);
//       }
//     };

//     checkAuth();
//   }, []); // Empty dependency array - runs only once

//   // CRITICAL FIX: Handle redirects in a SINGLE useEffect
//   useEffect(() => {
//     // Don't run until initial check is done
//     if (loading || !hasChecked) return;
    
//     // Don't run during SSR
//     if (typeof window === 'undefined') return;

//     const currentPath = window.location.pathname;
//     console.log(`📍 Route check: ${currentPath}, User: ${user?.role || 'none'}`);
    
//     // Public routes
//     const publicRoutes = ['/', '/signin', '/privacyPolicy', '/termsOfService', '/business/register', '/debug'];
//     const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

//     // Case 1: No user on protected route → go to signin
//     if (!user && !isPublicRoute) {
//       console.log('➡️ No user → redirecting to signin');
//       router.replace('/signin');
//       return;
//     }

//     // Case 2: User on signin/home → go to dashboard
//     if (user && (currentPath === '/signin' || currentPath === '/')) {
//       const roleRoutes = {
//         'admin': '/admin/dashboard',
//         'staff': '/staff/dashboard', 
//         'client': '/client/dashboard'
//       };
//       const target = roleRoutes[user.role];
      
//       // Only redirect if not already there
//       if (currentPath !== target) {
//         console.log(`➡️ User on signin → redirecting to ${target}`);
//         router.replace(target);
//       }
//       return;
//     }

//     // Case 3: User trying to access wrong role's route → logout
//     if (user) {
//       if (currentPath.startsWith('/admin') && user.role !== 'admin') {
//         console.log('❌ Wrong role for admin route');
//         alert('Access Denied!');
//         clearAuth();
//         router.replace('/signin');
//         return;
//       }
//       if (currentPath.startsWith('/staff') && !['staff', 'admin'].includes(user.role)) {
//         console.log('❌ Wrong role for staff route');
//         alert('Access Denied!');
//         clearAuth();
//         router.replace('/signin');
//         return;
//       }
//       if (currentPath.startsWith('/client') && user.role !== 'client') {
//         console.log('❌ Wrong role for client route');
//         alert('Access Denied!');
//         clearAuth();
//         router.replace('/signin');
//         return;
//       }
//     }

//     console.log('✅ Route check passed');
//   }, [pathname, user, loading, hasChecked, router]); // Only depend on these

//   const login = async (email, password) => {
//     try {
//       clearAuth(); // Clear any old token
      
//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         const { token, user } = data;
        
//         // Store token
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('token', token);
//         }
        
//         // Update state
//         setUser(user);
        
//         // Redirect will be handled by the main useEffect
//         return { success: true };
//       }
      
//       return { success: false, message: data.message };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'Login failed' };
//     }
//   };

//   const logout = () => {
//     clearAuth();
//     router.replace('/signin');
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     hasChecked
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };