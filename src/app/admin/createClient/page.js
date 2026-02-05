// // src/app/admin/createClient/page.js
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { 
//   User, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   Phone, 
//   UserPlus,
//   ArrowLeft,
//   Check,
//   X
// } from 'lucide-react';
// import Link from 'next/link';

// export default function CreateClientPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
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

//   const handlePasswordChange = (password) => {
//     setFormData({ ...formData, password });
//     checkPasswordStrength(password);
    
//     // Hide requirements if all criteria are met
//     const allChecksPass = checkAllPasswordRequirements(password);
//     if (allChecksPass) {
//       setShowPasswordRequirements(false);
//     }
//   };

//   const checkAllPasswordRequirements = (password) => {
//     return (
//       password.length >= 8 &&
//       /[A-Z]/.test(password) &&
//       /[a-z]/.test(password) &&
//       /[0-9]/.test(password) &&
//       /[^A-Za-z0-9]/.test(password)
//     );
//   };

//   const handlePasswordBlur = () => {
//     if (formData.password && !checkAllPasswordRequirements(formData.password)) {
//       setShowPasswordRequirements(true);
//     }
//   };

//   const handlePasswordFocus = () => {
//     setShowPasswordRequirements(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (!formData.name || !formData.email || !formData.password) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     const allChecksPass = Object.values(passwordStrength).every(v => v);
//     if (!allChecksPass) {
//       toast.error('Please meet all password requirements');
//       setShowPasswordRequirements(true);
//       return;
//     }
    
//     // Validate phone number format
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
//       toast.error('Please enter a valid phone number');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const currentUser = JSON.parse(localStorage.getItem('user'));
      
//       if (!token || !currentUser) {
//         toast.error('Please login first');
//         router.push('/signin');
//         return;
//       }
      
//       if (currentUser.role !== 'admin') {
//         toast.error('Only admins can create client accounts');
//         return;
//       }
      
//    const response = await axios.post('http://localhost:5000/api/admin/users', {
//   name: formData.name,
//   email: formData.email,
//   phone: formData.phone ? formData.phone.replace(/\D/g, '') : '',
//   password: formData.password,
//   role: 'client' // Add this line - specify role as 'client'
// }, {
//   headers: {
//     'Authorization': `Bearer ${token}`
//   }
// });
      
//       if (response.data.success) {
//         toast.success('Client account created successfully!');
        
//         // Reset form
//         setFormData({
//           name: '',
//           email: '',
//           phone: '',
//           password: '',
//           confirmPassword: '',
//         });
        
//         // Reset password strength
//         setPasswordStrength({
//           length: false,
//           uppercase: false,
//           lowercase: false,
//           number: false,
//           special: false,
//         });
//         setShowPasswordRequirements(false);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Failed to create client account. Please try again.';
//       toast.error(errorMessage);
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
//       <span className={`text-sm ${met ? 'text-green-600' : 'text-red-600'}`}>
//         {label}
//       </span>
//     </div>
//   );

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <Link 
//                 href="/admin/dashboard"
//                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   Create New Client
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Add a new client to the system
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center space-x-2">
//             <div className="bg-gradient-to-r from-teal-600 to-emerald-600  size-12 rounded-xl flex items-center justify-center">
//               <UserPlus className="size-6 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Form */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
//                       placeholder="John Doe"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
//                       placeholder="client@example.com"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Phone Number (Optional)
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ 
//                         ...formData, 
//                         phone: formatPhoneNumber(e.target.value) 
//                       })}
//                       className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
//                       placeholder="(123) 456-7890"
//                     />
//                   </div>
//                   {formData.phone && (
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                       Format: (123) 456-7890
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Password *
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={formData.password}
//                       onChange={(e) => handlePasswordChange(e.target.value)}
//                       onFocus={handlePasswordFocus}
//                       onBlur={handlePasswordBlur}
//                       className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
//                       placeholder="••••••••"
//                       required
//                       minLength="8"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
                  
//                   {/* Password Requirements */}
//                   {showPasswordRequirements && formData.password && (
//                     <div className="mt-3 space-y-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
//                       <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
//                         Password must contain:
//                       </p>
//                       <PasswordRequirement label="At least 8 characters" met={passwordStrength.length} />
//                       <PasswordRequirement label="At least one uppercase letter" met={passwordStrength.uppercase} />
//                       <PasswordRequirement label="At least one lowercase letter" met={passwordStrength.lowercase} />
//                       <PasswordRequirement label="At least one number" met={passwordStrength.number} />
//                       <PasswordRequirement label="At least one special character" met={passwordStrength.special} />
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Confirm Password *
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
//                     <input
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       value={formData.confirmPassword}
//                       onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                       className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
//                       placeholder="••••••••"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                   {formData.confirmPassword && formData.password !== formData.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-600 dark:text-red-400">
//                       Passwords do not match
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                       Creating Client Account...
//                     </>
//                   ) : (
//                     <>
//                       <UserPlus className="size-5 mr-2" />
//                       Create Client Account
//                     </>
//                   )}
//                 </button>
                
//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
//                   Client will be able to book appointments immediately
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Side Panel - Information */}
//         <div className="space-y-6">
//           {/* Instructions */}
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
//               <UserPlus className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
//               Creating Client Accounts
//             </h3>
//             <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span><strong>Clients</strong> can book appointments and manage their bookings through the client portal.</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Clients will receive their login credentials after account creation.</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Clients can update their profile information after logging in.</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>All client accounts are managed under <strong>ScheduleFlow</strong> system</span>
//               </li>
//             </ul>
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//               📊 Client Statistics
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">142</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Total Clients</div>
//               </div>
//               <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">87</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Active Clients</div>
//               </div>
//               <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">New This Month</div>
//               </div>
//               <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
//                 <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">92%</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Clients */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//               Recently Added Clients
//             </h3>
//             <div className="space-y-3">
//               {[
//                 { name: 'Alex Johnson', email: 'alex@example.com', date: 'Today' },
//                 { name: 'Maria Garcia', email: 'maria@example.com', date: 'Yesterday' },
//                 { name: 'David Wilson', email: 'david@example.com', date: '2 days ago' }
//               ].map((client, index) => (
//                 <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                   <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
//                     {client.name.charAt(0)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-gray-900 dark:text-white truncate">{client.name}</h4>
//                     <div className="flex items-center justify-between mt-1">
//                       <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{client.email}</p>
//                       <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full whitespace-nowrap">
//                         {client.date}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Link
//               href="/admin/clients"
//               className="mt-4 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//             >
//               View all clients
//               <svg className="size-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>

//           {/* Help Tips */}
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//               💡 Helpful Tips
//             </h3>
//             <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Use client's primary email address for communication</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Phone number is optional but helps with appointment reminders</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Use strong passwords to ensure account security</span>
//               </li>
//               <li className="flex items-start">
//                 <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 mr-3 flex-shrink-0"></div>
//                 <span>Clients can reset their password after first login</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





// src/app/admin/createClient/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  UserPlus,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function CreateClientPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    setFormData({ ...formData, password });
    checkPasswordStrength(password);
    
    // Clear password error when typing
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
    
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
    if (formData.password && !checkAllPasswordRequirements(formData.password)) {
      setShowPasswordRequirements(true);
    }
  };

  const handlePasswordFocus = () => {
    setShowPasswordRequirements(false);
  };

  const validateForm = () => {
    let newErrors = {};
    let hasError = false;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      hasError = true;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        hasError = true;
      }
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const digitsOnly = formData.phone.replace(/\D/g, '');
      
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
        hasError = true;
      } else if (!phoneRegex.test(digitsOnly)) {
        newErrors.phone = 'Please enter a valid phone number';
        hasError = true;
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else {
      const allChecksPass = Object.values(passwordStrength).every(v => v);
      if (!allChecksPass) {
        newErrors.password = 'Password does not meet all requirements';
        hasError = true;
        setShowPasswordRequirements(true);
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setErrors(newErrors);
    return { isValid: !hasError, errors: newErrors };
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   // Validate form and get validation result
  //   const validation = validateForm();
    
  //   if (!validation.isValid) {
  //     // Show specific error toasts based on which fields have errors
  //     const errorFields = Object.entries(validation.errors).filter(([field, error]) => error !== '');
      
  //     if (errorFields.length > 0) {
  //       // Show toast for the first error found
  //       const [firstField, firstError] = errorFields[0];
        
  //       // Custom toast messages based on field
  //       let toastMessage = '';
        
  //       if (firstField === 'name') {
  //         toastMessage = firstError.includes('required') 
  //           ? 'Please enter client name' 
  //           : 'Name must be at least 2 characters';
  //       } else if (firstField === 'email') {
  //         toastMessage = firstError.includes('required') 
  //           ? 'Please enter email address' 
  //           : 'Please enter a valid email address';
  //       } else if (firstField === 'phone') {
  //         toastMessage = 'Please enter a valid phone number (10+ digits)';
  //       } else if (firstField === 'password') {
  //         toastMessage = firstError.includes('required') 
  //           ? 'Please enter a password' 
  //           : 'Password must meet all requirements';
  //       } else if (firstField === 'confirmPassword') {
  //         toastMessage = firstError.includes('match') 
  //           ? 'Passwords do not match' 
  //           : 'Please confirm your password';
  //       } else {
  //         toastMessage = 'Please fix the errors in the form';
  //       }
        
  //       toast.error(toastMessage);
  //     }
  //     return;
  //   }
    
  //   setLoading(true);
    
  //   try {
  //     const token = localStorage.getItem('token');
  //     const currentUser = JSON.parse(localStorage.getItem('user'));
      
  //     if (!token || !currentUser) {
  //       toast.error('Please login first');
  //       router.push('/signin');
  //       setLoading(false);
  //       return;
  //     }
      
  //     if (currentUser.role !== 'admin') {
  //       toast.error('Only admins can create client accounts');
  //       setLoading(false);
  //       return;
  //     }
      
  //     // Clean phone number - remove all non-digits
  //     const phoneDigits = formData.phone ? formData.phone.replace(/\D/g, '') : '';
      
  //     const response = await axios.post('http://localhost:5000/api/admin/users', {
  //       name: formData.name.trim(),
  //       email: formData.email.trim(),
  //       phone: phoneDigits,
  //       password: formData.password,
  //       role: 'client'
  //     }, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
      
  //     if (response.data.success) {
  //       toast.success('Client account created successfully!');
        
  //       // Reset form
  //       setFormData({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         password: '',
  //         confirmPassword: '',
  //       });
        
  //       // Reset errors
  //       setErrors({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         password: '',
  //         confirmPassword: '',
  //       });
        
  //       // Reset password strength
  //       setPasswordStrength({
  //         length: false,
  //         uppercase: false,
  //         lowercase: false,
  //         number: false,
  //         special: false,
  //       });
  //       setShowPasswordRequirements(false);
        
  //       // Redirect to view clients page after 1.5 seconds
  //       setTimeout(() => {
  //         router.push('/admin/viewClients');
  //       }, 1500);
  //     } else {
  //       toast.error(response.data.message || 'Failed to create client account');
  //     }
  //   } catch (error) {
  //     console.error('Create client error:', error);
      
  //     // Better error handling with specific messages
  //     if (error.response) {
  //       const errorMessage = error.response.data?.message || 
  //                          error.response.data?.error || 
  //                          'Failed to create client account';
        
  //       if (error.response.status === 409) {
  //         toast.error('A client with this email already exists');
  //         setErrors({ ...errors, email: 'This email is already registered' });
  //       } else if (error.response.status === 401) {
  //         toast.error('Session expired. Please login again');
  //         router.push('/signin');
  //       } else if (error.response.status === 403) {
  //         toast.error('You do not have permission to create client accounts');
  //       } else if (error.response.status === 400) {
  //         // Handle validation errors from backend
  //         if (error.response.data.errors) {
  //           const backendErrors = error.response.data.errors;
  //           let newErrors = { ...errors };
  //           let backendErrorMsg = '';
            
  //           if (backendErrors.name) {
  //             newErrors.name = backendErrors.name;
  //             backendErrorMsg = 'Name: ' + backendErrors.name;
  //           }
  //           if (backendErrors.email) {
  //             newErrors.email = backendErrors.email;
  //             backendErrorMsg = backendErrorMsg ? backendErrorMsg + ', Email: ' + backendErrors.email : 'Email: ' + backendErrors.email;
  //           }
  //           if (backendErrors.phone) {
  //             newErrors.phone = backendErrors.phone;
  //             backendErrorMsg = backendErrorMsg ? backendErrorMsg + ', Phone: ' + backendErrors.phone : 'Phone: ' + backendErrors.phone;
  //           }
  //           if (backendErrors.password) {
  //             newErrors.password = backendErrors.password;
  //             backendErrorMsg = backendErrorMsg ? backendErrorMsg + ', Password: ' + backendErrors.password : 'Password: ' + backendErrors.password;
  //           }
            
  //           setErrors(newErrors);
  //           toast.error(backendErrorMsg || 'Please fix the validation errors');
  //         } else {
  //           toast.error(errorMessage);
  //         }
  //       } else {
  //         toast.error(errorMessage);
  //       }
  //     } else if (error.request) {
  //       toast.error('No response from server. Please check your connection');
  //     } else {
  //       toast.error('Error: ' + error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Clear error when user starts typing in a field
 

const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Form submitted - Checking validation');
  console.log('Toast function available:', typeof toast !== 'undefined');
  
  // Test toast immediately to verify
  toast.success('🔄 Form submission started...', {
    duration: 2000,
    style: {
      background: '#3b82f6',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
  
  // Validate form and get validation result
  const validation = validateForm();
  console.log('Validation errors:', validation.errors);
  
  if (!validation.isValid) {
    console.log('Form validation failed');
    
    // Show all validation errors as one toast
    const errorMessages = Object.entries(validation.errors)
      .filter(([_, error]) => error !== '')
      .map(([field, error]) => `${field}: ${error}`);
    
    if (errorMessages.length > 0) {
      toast.error(`Please fix the following errors:\n• ${errorMessages.join('\n• ')}`, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '500px',
          whiteSpace: 'pre-line',
        },
      });
    }
    
    return;
  }
  
  setLoading(true);
  
  // Show loading toast
  const loadingToastId = toast.loading('Creating client account...', {
    style: {
      background: '#3b82f6',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
  
  try {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !currentUser) {
      toast.dismiss(loadingToastId);
      toast.error('Please login first to create client accounts', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
      router.push('/signin');
      setLoading(false);
      return;
    }
    
    if (currentUser.role !== 'admin') {
      toast.dismiss(loadingToastId);
      toast.error('Only administrators can create client accounts', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
      setLoading(false);
      return;
    }
    
    // Clean phone number - remove all non-digits
    const phoneDigits = formData.phone ? formData.phone.replace(/\D/g, '') : '';
    
    console.log('Sending request to create client...');
    
    const response = await axios.post('http://localhost:5000/api/admin/users', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: phoneDigits,
      password: formData.password,
      role: 'client'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response received:', response.data);
    
    if (response.data.success) {
      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success('✅ Client account created successfully!', {
        duration: 3000,
        style: {
          background: '#10b981',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      
      // Reset errors
      setErrors({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      
      // Reset password strength
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      setShowPasswordRequirements(false);
      
      // Show redirect toast after 1 second
      setTimeout(() => {
        toast.success('✅ Redirecting to clients list...', {
          duration: 2000,
          style: {
            background: '#10b981',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
      }, 1000);
      
      // Redirect to view clients page after 2.5 seconds
      setTimeout(() => {
        router.push('/admin/viewClients');
      }, 2500);
    } else {
      toast.dismiss(loadingToastId);
      toast.error(response.data.message || 'Failed to create client account', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    }
  } catch (error) {
    console.error('Create client error:', error);
    
    // Dismiss loading toast
    toast.dismiss(loadingToastId);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      console.log('Error response:', error.response);
      
      if (error.response.status === 409) {
        errorMessage = 'A client with this email already exists';
        setErrors({ ...errors, email: 'This email is already registered' });
      } else if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again';
        router.push('/signin');
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to create client accounts';
      } else if (error.response.status === 400) {
        if (error.response.data.errors) {
          const backendErrors = error.response.data.errors;
          let newErrors = { ...errors };
          
          if (backendErrors.name) {
            newErrors.name = backendErrors.name;
            errorMessage = `Name: ${backendErrors.name}`;
          }
          if (backendErrors.email) {
            newErrors.email = backendErrors.email;
            errorMessage = errorMessage.includes('Name:') 
              ? `${errorMessage}, Email: ${backendErrors.email}`
              : `Email: ${backendErrors.email}`;
          }
          if (backendErrors.phone) {
            newErrors.phone = backendErrors.phone;
            errorMessage = errorMessage.includes('Email:') || errorMessage.includes('Name:')
              ? `${errorMessage}, Phone: ${backendErrors.phone}`
              : `Phone: ${backendErrors.phone}`;
          }
          if (backendErrors.password) {
            newErrors.password = backendErrors.password;
            errorMessage = errorMessage.includes('Phone:') || errorMessage.includes('Email:') || errorMessage.includes('Name:')
              ? `${errorMessage}, Password: ${backendErrors.password}`
              : `Password: ${backendErrors.password}`;
          }
          
          setErrors(newErrors);
        } else {
          errorMessage = error.response.data.message || 'Invalid data provided';
        }
      } else {
        errorMessage = error.response.data?.message || 'Server error occurred';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your connection';
    } else {
      errorMessage = error.message;
    }
    
    toast.error(`❌ ${errorMessage}`, {
      duration: 5000,
      style: {
        background: '#ef4444',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  } finally {
    setLoading(false);
  }
};
 
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/admin/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Client
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Add a new client to the system
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 size-12 rounded-xl flex items-center justify-center">
              <UserPlus className="size-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                      placeholder="client@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.phone 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                  {!errors.phone && formData.phone && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter numbers only (no spaces or dashes)
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                      placeholder="••••••••"
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                  
                  {/* Password Requirements */}
                  {showPasswordRequirements && formData.password && (
                    <div className="mt-3 space-y-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
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

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  ) : formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Client Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-5 mr-2" />
                      Create Client Account
                    </>
                  )}
                </button>
               

                
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Client will be able to book appointments immediately
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Side Panel - Information */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <UserPlus className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
              Creating Client Accounts
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span><strong>Clients</strong> can book appointments and manage their bookings through the client portal.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Clients will receive their login credentials after account creation.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Clients can update their profile information after logging in.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>All client accounts are managed under <strong>ScheduleFlow</strong> system</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              📊 Client Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">142</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Clients</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">87</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Clients</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New This Month</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">92%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Recently Added Clients
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Alex Johnson', email: 'alex@example.com', date: 'Today' },
                { name: 'Maria Garcia', email: 'maria@example.com', date: 'Yesterday' },
                { name: 'David Wilson', email: 'david@example.com', date: '2 days ago' }
              ].map((client, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{client.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{client.email}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full whitespace-nowrap">
                        {client.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/viewClients"
              className="mt-4 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all clients
              <svg className="size-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Help Tips */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              💡 Helpful Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Use client's primary email address for communication</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Phone number is optional but helps with appointment reminders</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Use strong passwords to ensure account security</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Clients can reset their password after first login</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}