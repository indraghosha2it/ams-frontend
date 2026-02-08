// // src/utils/roleProtection.js
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';

// // Helper to get token
// const getToken = () => {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('token');
// };

// // Get user role from token
// const getUserRole = () => {
//   const token = getToken();
//   if (!token) return null;
  
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.role || null;
//   } catch (error) {
//     return null;
//   }
// };

// // Check if route is allowed for a role
// const isRouteAllowed = (routePath, userRole) => {
//   // Define role-specific route prefixes
//   const roleRoutes = {
//     admin: ['/admin'],
//     staff: ['/staff'],
//     client: ['/client']
//   };

//   // Public routes that everyone can access
//   const publicRoutes = [
//     '/',
//     '/signin',
//     '/privacyPolicy',
//     '/termsOfService',
//     '/business/register',
//     '/debug'
//   ];

//   // Check if it's a public route
//   if (publicRoutes.some(publicRoute => routePath.startsWith(publicRoute))) {
//     return true;
//   }

//   // If no user role, only public routes allowed
//   if (!userRole) return false;

//   // Check if route matches any of the allowed routes for the role
//   const allowedRoutes = roleRoutes[userRole] || [];
//   return allowedRoutes.some(allowedRoute => routePath.startsWith(allowedRoute));
// };

// // Force logout and redirect to signin
// const forceLogout = (router, message = 'Access denied. Please log in again.') => {
//   console.log('🚫 Forcing logout:', message);
  
//   // Clear local storage
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('token');
//   }
  
//   // Show alert
//   alert(message);
  
//   // Redirect to signin
//   router.push('/signin');
// };

// // Main role protection hook
// export const useRoleProtection = (requiredRole = null) => {
//   const router = useRouter();
//   const [isChecking, setIsChecking] = useState(true);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const checkAccess = async () => {
//       setIsChecking(true);
      
//       try {
//         // Get token
//         const token = getToken();
//         if (!token) {
//           console.log('❌ No token found, redirecting to signin');
//           router.push('/signin');
//           return;
//         }

//         // Get user role from token
//         const role = getUserRole();
//         if (!role) {
//           console.log('❌ No role found in token');
//           forceLogout(router, 'Invalid session. Please log in again.');
//           return;
//         }

//         setUserRole(role);

//         // Get current path
//         const currentPath = window.location.pathname;

//         // Check if user can access this route based on role
//         const canAccess = isRouteAllowed(currentPath, role);

//         if (!canAccess) {
//           console.log(`🚫 Role "${role}" cannot access "${currentPath}"`);
//           forceLogout(router, `Access denied: You don't have permission to access this page.`);
//           return;
//         }

//         // If specific role required, check if user has that role
//         if (requiredRole && role !== requiredRole) {
//           console.log(`🚫 Required role "${requiredRole}" but user has "${role}"`);
//           forceLogout(router, `Access denied: This page is for ${requiredRole}s only.`);
//           return;
//         }

//         console.log(`✅ Access granted for "${role}" to "${currentPath}"`);
//         setIsChecking(false);

//       } catch (error) {
//         console.error('❌ Error in role protection:', error);
//         forceLogout(router, 'Session error. Please log in again.');
//       }
//     };

//     checkAccess();
//   }, [router, requiredRole]);

//   return { isChecking, userRole };
// };

// // HOC for role protection
// export const withRoleProtection = (WrappedComponent, requiredRole = null) => {
//   return function ProtectedComponent(props) {
//     const router = useRouter();
//     const [isAllowed, setIsAllowed] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//       const checkAccess = async () => {
//         setIsLoading(true);
        
//         try {
//           // Get token
//           const token = getToken();
//           if (!token) {
//             console.log('❌ No token found');
//             router.push('/signin');
//             return;
//           }

//           // Get user role from token
//           const role = getUserRole();
//           if (!role) {
//             console.log('❌ No role found in token');
//             forceLogout(router, 'Invalid session. Please log in again.');
//             return;
//           }

//           // Get current path
//           const currentPath = window.location.pathname;

//           // Check if user can access this route based on role
//           const canAccess = isRouteAllowed(currentPath, role);

//           if (!canAccess) {
//             console.log(`🚫 Role "${role}" cannot access "${currentPath}"`);
//             forceLogout(router, `Access denied: You don't have permission to access this page.`);
//             return;
//           }

//           // If specific role required, check if user has that role
//           if (requiredRole && role !== requiredRole) {
//             console.log(`🚫 Required role "${requiredRole}" but user has "${role}"`);
//             forceLogout(router, `Access denied: This page is for ${requiredRole}s only.`);
//             return;
//           }

//           console.log(`✅ Access granted for "${role}" to "${currentPath}"`);
//           setIsAllowed(true);
//           setIsLoading(false);

//         } catch (error) {
//           console.error('❌ Error in role protection:', error);
//           forceLogout(router, 'Session error. Please log in again.');
//         }
//       };

//       checkAccess();
//     }, [router, requiredRole]);

//     // Show loading while checking
//     if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Checking permissions...</p>
//           </div>
//         </div>
//       );
//     }

//     // If not allowed, don't render (will redirect in useEffect)
//     if (!isAllowed) {
//       return null;
//     }

//     return <WrappedComponent {...props} />;
//   };
// };

// // Helper functions for specific roles
// export const withAdminProtection = (Component) => 
//   withRoleProtection(Component, 'admin');

// export const withStaffProtection = (Component) => 
//   withRoleProtection(Component, 'staff');

// export const withClientProtection = (Component) => 
//   withRoleProtection(Component, 'client');