// // src/app/signin/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { 
//   Calendar, 
//   ArrowLeft, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff,
//   User,
//   Phone,
//   Check,
//   X
// } from 'lucide-react';

// export default function SignInPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [justRegistered, setJustRegistered] = useState(false);
  
//   useEffect(() => {
//     const mode = searchParams.get('mode');
//     if (mode === 'signup') {
//       setIsLogin(false);
//     }
    
//     // Check if user just registered (from URL params)
//     const justRegisteredParam = searchParams.get('registered');
//     if (justRegisteredParam === 'true') {
//       toast.success('Registration successful! Please sign in to continue.');
//       setIsLogin(true);
//       // Clean up URL
//       const newUrl = window.location.pathname;
//       window.history.replaceState({}, '', newUrl);
//     }
//   }, [searchParams]);
  
//   const [loginData, setLoginData] = useState({
//     email: '',
//     password: '',
//   });
  
//   const [registerData, setRegisterData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     acceptTerms: false,
//   });

//   const [passwordStrength, setPasswordStrength] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });

//   const checkPasswordStrength = (password) => {
//     setPasswordStrength({
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[^A-Za-z0-9]/.test(password),
//     });
//   };

 

// const handleLogin = async (e) => {
//   e.preventDefault();
//   setLoading(true);
  
//   try {
//     const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
//     if (response.data.success) {
//       toast.success('Welcome back!');
      
//       // Store token and user data
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
      
//       // Redirect based on role
//       const role = response.data.user?.role || response.data.role;
      
//       console.log('Login successful, role:', role);
      
//       switch (role) {
//         case 'admin':
//           toast.success('Welcome Admin!');
//           router.push('/admin/dashboard');
//           break;
//         case 'staff':
//           toast.success('Welcome Staff!');
//           router.push('/staff/dashboard');
//           break;
//         case 'client':
//         default:
//           toast.success('Welcome!');
//           router.push('/client/dashboard');
//           break;
//       }
//     }
//   } catch (error) {
//     // Just show toast without console error
//     const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
//     toast.error(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleRegister = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (!registerData.name || !registerData.email || !registerData.password) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     if (registerData.password !== registerData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     if (!registerData.acceptTerms) {
//       toast.error('Please accept the terms and conditions');
//       return;
//     }
    
//     const allChecksPass = Object.values(passwordStrength).every(v => v);
//     if (!allChecksPass) {
//       toast.error('Please meet all password requirements');
//       return;
//     }
    
//     // Validate phone number (optional)
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     if (registerData.phone && !phoneRegex.test(registerData.phone.replace(/\D/g, ''))) {
//       toast.error('Please enter a valid phone number');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/register/client', {
//         name: registerData.name,
//         email: registerData.email,
//         phone: registerData.phone ? registerData.phone.replace(/\D/g, '') : '',
//         password: registerData.password,
//       });
      
//       if (response.data.success) {
//         // Show success toast
//         toast.success('Account created successfully! Please sign in to continue.');
//         setJustRegistered(true);
        
//         // Clear the registration form
//         setRegisterData({
//           name: '',
//           email: '',
//           phone: '',
//           password: '',
//           confirmPassword: '',
//           acceptTerms: false,
//         });
        
//         // Reset password strength
//         setPasswordStrength({
//           length: false,
//           uppercase: false,
//           lowercase: false,
//           number: false,
//           special: false,
//         });
        
//         // Pre-fill email in login form for convenience
//         setLoginData({
//           email: response.data.user?.email || registerData.email,
//           password: '',
//         });
        
//         // Switch to login form
//         setIsLogin(true);
//       }
//     } catch (error) {
//       console.error('Registration error:', error.response?.data || error.message);
//       toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPhoneNumber = (value) => {
//     const phoneNumber = value.replace(/\D/g, '');
    
//     if (phoneNumber.length === 0) return '';
//     if (phoneNumber.length <= 3) return `(${phoneNumber}`;
//     if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
//     if (phoneNumber.length <= 10) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
//     return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)} x${phoneNumber.slice(10)}`;
//   };

//   const PasswordRequirement = ({ label, met }) => (
//     <div className="flex items-center space-x-2">
//       {met ? (
//         <Check className="size-4 text-green-500" />
//       ) : (
//         <X className="size-4 text-red-400" />
//       )}
//       <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
//         {label}
//       </span>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div 
//               className="flex items-center space-x-3 cursor-pointer group"
//               onClick={() => router.push('/')}
//             >
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-60"></div>
//                 <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 size-10 rounded-xl flex items-center justify-center shadow-lg">
//                   <Calendar className="size-6 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   ScheduleFlow
//                 </span>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Professional Edition</p>
//               </div>
//             </div>

//             {/* Back to Home */}
//             <button
//               onClick={() => router.push('/')}
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
//             >
//               <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
//             {/* Logo in Form */}
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-60"></div>
//                 <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 size-16 rounded-xl flex items-center justify-center shadow-lg">
//                   <Calendar className="size-8 text-white" />
//                 </div>
//               </div>
//             </div>

//             {/* Toggle */}
//             <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
//               <button
//                 type="button"
//                 onClick={() => setIsLogin(true)}
//                 className={`flex-1 py-3 text-center font-semibold rounded-lg transition-all duration-300 ${
//                   isLogin
//                     ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
//                     : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 Sign In
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsLogin(false);
//                   setJustRegistered(false);
//                 }}
//                 className={`flex-1 py-3 text-center font-semibold rounded-lg transition-all duration-300 ${
//                   !isLogin
//                     ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
//                     : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>

//             {/* Success Banner */}
//             {justRegistered && isLogin && (
//               <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
//                 <div className="flex items-center">
//                   <Check className="size-5 text-green-600 dark:text-green-400 mr-3" />
//                   <div>
//                     <p className="font-medium text-green-800 dark:text-green-300">
//                       Registration Successful!
//                     </p>
//                     <p className="text-sm text-green-700 dark:text-green-400 mt-1">
//                       Please sign in with your credentials below
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Form Title */}
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
//               {isLogin ? 'Welcome Back' : 'Create Account'}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
//               {isLogin 
//                 ? 'Sign in to your account to continue' 
//                 : 'Start booking appointments with service providers'
//               }
//             </p>

//             {isLogin ? (
//               // Login Form
//               <form onSubmit={handleLogin} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={loginData.email}
//                       onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="you@example.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Password
//                     </label>
//                     <button
//                       type="button"
//                       className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//                       onClick={() => toast.info('Contact support to reset your password')}
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={loginData.password}
//                       onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                       className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="••••••••"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="size-5" />
//                       ) : (
//                         <Eye className="size-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     className="size-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-blue-500"
//                   />
//                   <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
//                     Remember me for 30 days
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : (
//                     'Sign In'
//                   )}
//                 </button>

//                 <div className="text-center">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Don't have an account?{' '}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsLogin(false);
//                         setJustRegistered(false);
//                       }}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
//                     >
//                       Sign up
//                     </button>
//                   </p>
//                 </div>
//               </form>
//             ) : (
//               // Registration Form (Client only)
//               <form onSubmit={handleRegister} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={registerData.name}
//                       onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
//                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="John Doe"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={registerData.email}
//                       onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
//                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="you@example.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Phone Number (Optional)
//                     <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
//                       For appointment reminders
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="tel"
//                       value={registerData.phone}
//                       onChange={(e) => setRegisterData({ 
//                         ...registerData, 
//                         phone: formatPhoneNumber(e.target.value) 
//                       })}
//                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="(123) 456-7890"
//                     />
//                   </div>
//                   {registerData.phone && (
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                       Format: (123) 456-7890
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Password *
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={registerData.password}
//                       onChange={(e) => {
//                         setRegisterData({ ...registerData, password: e.target.value });
//                         checkPasswordStrength(e.target.value);
//                       }}
//                       className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="••••••••"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="size-5" />
//                       ) : (
//                         <Eye className="size-5" />
//                       )}
//                     </button>
//                   </div>
                  
//                   {/* Password Requirements */}
//                   <div className="mt-3 space-y-2">
//                     <PasswordRequirement label="At least 8 characters" met={passwordStrength.length} />
//                     <PasswordRequirement label="At least one uppercase letter" met={passwordStrength.uppercase} />
//                     <PasswordRequirement label="At least one lowercase letter" met={passwordStrength.lowercase} />
//                     <PasswordRequirement label="At least one number" met={passwordStrength.number} />
//                     <PasswordRequirement label="At least one special character" met={passwordStrength.special} />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Confirm Password *
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={registerData.confirmPassword}
//                       onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
//                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                       placeholder="••••••••"
//                       required
//                     />
//                   </div>
//                   {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-600 dark:text-red-400">
//                       Passwords do not match
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-start">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     checked={registerData.acceptTerms}
//                     onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
//                     className="size-4 mt-1 text-blue-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-blue-500"
//                     required
//                   />
//                   <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     I agree to the{' '}
//                     <button
//                       type="button"
//                       onClick={() => window.open('/terms', '_blank')}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//                     >
//                       Terms of Service
//                     </button>{' '}
//                     and{' '}
//                     <button
//                       type="button"
//                       onClick={() => window.open('/privacy', '_blank')}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//                     >
//                       Privacy Policy
//                     </button>
//                   </label>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Creating account...
//                     </span>
//                   ) : (
//                     'Create Account'
//                   )}
//                 </button>

//                 <div className="text-center">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Already have an account?{' '}
//                     <button
//                       type="button"
//                       onClick={() => setIsLogin(true)}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
//                     >
//                       Sign in here
//                     </button>
//                   </p>
//                 </div>
//               </form>
//             )}

//             {/* Divider */}
//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                   {isLogin ? 'Or continue with' : 'Or sign up with'}
//                 </span>
//               </div>
//             </div>

//             {/* Social Login */}
//             {/* <div className="grid grid-cols-1 gap-3">
//               <button
//                 type="button"
//                 className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 onClick={() => toast.info('Google authentication coming soon!')}
//               >
//                 <svg className="size-5 mr-2" viewBox="0 0 24 24">
//                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Google
//               </button>
             
//             </div> */}

//             {/* Remove Demo Accounts Info Section */}
//           </div>
//         </div>
//       </div>

//       {/* Add custom animation styles */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }


// src/app/signin/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Phone,
  Check,
  X
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
    
    // Check if user just registered (from URL params)
    const justRegisteredParam = searchParams.get('registered');
    if (justRegisteredParam === 'true') {
      toast.success('Registration successful! Please sign in to continue.');
      setIsLogin(true);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handlePasswordChange = (password) => {
    setRegisterData({ ...registerData, password });
    checkPasswordStrength(password);
    
    // Hide requirements if all criteria are met
    const allChecksPass = checkAllPasswordRequirements(password);
    if (allChecksPass) {
      setShowPasswordRequirements(false);
    }
  };

  const checkAllPasswordRequirements = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handlePasswordBlur = () => {
    if (registerData.password && !checkAllPasswordRequirements(registerData.password)) {
      setShowPasswordRequirements(true);
    }
  };

  const handlePasswordFocus = () => {
    // Hide requirements when user focuses back on the field
    setShowPasswordRequirements(false);
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
    
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      
  //     if (response.data.success) {
  //       toast.success('Welcome back!');
        
  //       // Store token and user data
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
        
  //       // Redirect based on role
  //       const role = response.data.user?.role || response.data.role;
        
  //       console.log('Login successful, role:', role);
        
  //       switch (role) {
  //         case 'admin':
  //           toast.success('Welcome Admin!');
  //           router.push('/admin/dashboard');
  //           break;
  //         case 'staff':
  //           toast.success('Welcome Staff!');
  //           router.push('/staff/dashboard');
  //           break;
  //         case 'client':
  //         default:
  //           toast.success('Welcome!');
  //           router.push('/client/dashboard');
  //           break;
  //       }
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    if (response.data.success) {
      // Show success toast
      toast.success('Welcome back!', {
        duration: 3000,
        position: 'top-right',
      });
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Get role
      const role = response.data.user?.role || response.data.role;
      console.log('Login successful, role:', role);
      
      // Show role-specific welcome toast after a short delay
      setTimeout(() => {
        switch (role) {
          case 'admin':
            toast.success('Welcome Admin!', { 
              duration: 2000,
              position: 'top-right',
            });
            break;
          case 'staff':
            toast.success('Welcome Staff!', { 
              duration: 2000,
              position: 'top-right',
            });
            break;
          case 'client':
          default:
            toast.success('Welcome!', { 
              duration: 2000,
              position: 'top-right',
            });
            break;
        }
      }, 500);
      
      // Redirect after showing the first toast
      setTimeout(() => {
        switch (role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'staff':
            router.push('/staff/dashboard');
            break;
          case 'client':
          default:
            router.push('/client/dashboard');
            break;
        }
      }, 1500); // Give user time to see the toast
    }
  } catch (error) {
    // Catch the error to prevent it from appearing in console as uncaught
    console.log('Login error caught:', error.response?.status, error.response?.data);
    
    // Show appropriate error message
    let errorMessage = 'Invalid credentials. Please try again.';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Please check your input';
      } else if (error.response.status === 404) {
        errorMessage = 'User not found. Please sign up first';
      } else {
        errorMessage = error.response.data?.message || 'Login failed. Please try again.';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection';
    } else {
      errorMessage = 'An error occurred. Please try again.';
    }
    
    // Show error toast
    toast.error(errorMessage, {
      duration: 4000,
      position: 'top-right',
    });
    
  } finally {
    setLoading(false);
  }
};
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check password requirements
    const allChecksPass = Object.values(passwordStrength).every(v => v);
    if (!allChecksPass) {
      toast.error('Please meet all password requirements');
      setShowPasswordRequirements(true);
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!registerData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Validate phone number (optional)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (registerData.phone && !phoneRegex.test(registerData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register/client', {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone ? registerData.phone.replace(/\D/g, '') : '',
        password: registerData.password,
      });
      
      if (response.data.success) {
        toast.success('Account created successfully! Please sign in to continue.');
        setJustRegistered(true);
        
        // Clear the registration form
        setRegisterData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false,
        });
        
        // Reset password strength and hide requirements
        setPasswordStrength({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        });
        setShowPasswordRequirements(false);
        
        // Pre-fill email in login form for convenience
        setLoginData({
          email: response.data.user?.email || registerData.email,
          password: '',
        });
        
        // Switch to login form
        setIsLogin(true);
      }
    } catch (error) {
  const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
  toast.error(errorMessage);
} finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    if (phoneNumber.length <= 10) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)} x${phoneNumber.slice(10)}`;
  };

  const PasswordRequirement = ({ label, met }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <X className="size-4 text-red-400" />
      )}
      <span className={`text-sm ${met ? 'text-green-600' : 'text-red-600'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 size-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="size-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ScheduleFlow
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Edition</p>
              </div>
            </div>

            {/* Back to Home */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
            {/* Logo in Form */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 size-16 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="size-8 text-white" />
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center font-semibold rounded-lg transition-all duration-300 ${
                  isLogin
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setJustRegistered(false);
                  setShowPasswordRequirements(false);
                }}
                className={`flex-1 py-3 text-center font-semibold rounded-lg transition-all duration-300 ${
                  !isLogin
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Success Banner */}
            {justRegistered && isLogin && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
                <div className="flex items-center">
                  <Check className="size-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Registration Successful!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Please sign in with your credentials below
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Start booking appointments with service providers'
              }
            </p>

            {isLogin ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() => toast.info('Contact support to reset your password')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="size-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                        setJustRegistered(false);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              // Registration Form (Client only)
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      For appointment reminders
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ 
                        ...registerData, 
                        phone: formatPhoneNumber(e.target.value) 
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {registerData.phone && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format: (123) 456-7890
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements - Only show when user leaves field without meeting criteria */}
                  {showPasswordRequirements && registerData.password && (
                    <div className="mt-3 space-y-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg animate-fadeIn">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                        Password must contain:
                      </p>
                      <PasswordRequirement label="At least 8 characters" met={passwordStrength.length} />
                      <PasswordRequirement label="At least one uppercase letter" met={passwordStrength.uppercase} />
                      <PasswordRequirement label="At least one lowercase letter" met={passwordStrength.lowercase} />
                      <PasswordRequirement label="At least one number" met={passwordStrength.number} />
                      <PasswordRequirement label="At least one special character" met={passwordStrength.special} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={registerData.acceptTerms}
                    onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
                    className="size-4 mt-1 text-blue-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => window.open('/terms', '_blank')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => window.open('/privacy', '_blank')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {isLogin ? 'Or continue with' : 'Or sign up with'}
                </span>
              </div>
            </div>

            {/* Social Login (commented out) */}
            {/* <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toast.info('Google authentication coming soon!')}
              >
                <svg className="size-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}