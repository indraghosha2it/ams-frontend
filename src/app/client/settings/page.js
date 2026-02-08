// // src/app/client/settings/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   Lock, 
//   Calendar,
//   Shield,
//   Save,
//   Eye,
//   EyeOff,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Home
// } from 'lucide-react';
// import Link from 'next/link';

// export default function ClientSettingsPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [activeTab, setActiveTab] = useState('account');

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const currentUser = JSON.parse(localStorage.getItem('user'));
      
//       if (!token || !currentUser) {
//         toast.error('Please login first');
//         router.push('/signin');
//         return;
//       }
      
//       if (currentUser.role !== 'client') {
//         toast.error('Only clients can access this page');
//         router.push('/dashboard');
//         return;
//       }

//       // Get user data - using client profile endpoint
//       const response = await axios.get('https://ams-backend-psi.vercel.app/api/client/profile', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         const user = response.data.user;
//         setUserData(user);
//         setFormData({
//           name: user.name,
//           phone: user.phone || '',
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
      
//       // Fallback to auth/me if client/profile doesn't work
//       if (error.response?.status === 404) {
//         try {
//           // Try the auth/me endpoint as fallback
//           const fallbackResponse = await axios.get('https://ams-backend-psi.vercel.app/api/auth/me', {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           if (fallbackResponse.data.success) {
//             const user = fallbackResponse.data.user;
//             setUserData(user);
//             setFormData({
//               name: user.name,
//               phone: user.phone || '',
//               currentPassword: '',
//               newPassword: '',
//               confirmPassword: ''
//             });
//             return;
//           }
//         } catch (fallbackError) {
//           console.error('Fallback error:', fallbackError);
//         }
//       }
      
//       toast.error('Failed to load profile data');
//       // For demo purposes, use sample data
//       setUserData(getSampleUser());
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSampleUser = () => {
//     return {
//       _id: '1',
//       name: 'Alex Johnson',
//       email: 'alex@example.com',
//       phone: '(555) 123-4567',
//       role: 'client',
//       isActive: true,
//       createdAt: '2024-01-15T10:30:00Z'
//     };
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateProfileForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
//       newErrors.phone = 'Invalid phone number';
//     }
    
//     return newErrors;
//   };

//   const validatePasswordForm = () => {
//     const newErrors = {};
    
//     if (formData.newPassword) {
//       if (!formData.currentPassword) {
//         newErrors.currentPassword = 'Current password is required to set new password';
//       }
      
//       if (formData.newPassword.length < 6) {
//         newErrors.newPassword = 'Password must be at least 6 characters';
//       }
      
//       if (formData.newPassword !== formData.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }
    
//     return newErrors;
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
    
//     const profileErrors = validateProfileForm();
//     if (Object.keys(profileErrors).length > 0) {
//       setErrors(profileErrors);
//       toast.error('Please fix the errors in the form');
//       return;
//     }
    
//     setSaving(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const updateData = {
//         name: formData.name,
//         phone: formData.phone
//       };
      
//       const response = await axios.put(
//         `https://ams-backend-psi.vercel.app/api/client/profile`,
//         updateData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         toast.success('Profile updated successfully');
        
//         // Update local user data
//         const updatedUser = { ...userData, ...updateData };
//         setUserData(updatedUser);
        
//         // Update localStorage
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };
// const handlePasswordSubmit = async (e) => {
//   e.preventDefault();
  
//   const passwordErrors = validatePasswordForm();
//   if (Object.keys(passwordErrors).length > 0) {
//     setErrors(passwordErrors);
//     toast.error('Please fix the errors in the form');
//     return;
//   }
  
//   if (!formData.newPassword) {
//     toast.error('Please enter a new password');
//     return;
//   }
  
//   setSaving(true);
  
//   try {
//     const token = localStorage.getItem('token');
    
//     const updateData = {
//       currentPassword: formData.currentPassword,
//       newPassword: formData.newPassword
//     };
    
//     const response = await axios.put(
//       `https://ams-backend-psi.vercel.app/api/client/password`,
//       updateData,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     if (response.data.success) {
//       toast.success('Password updated successfully');
      
//       // Clear password fields
//       setFormData(prev => ({
//         ...prev,
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       }));
      
//       setErrors({});
//     }
//   } catch (error) {
//     // Check if it's a 401 error with "Current password is incorrect" message
//     if (error.response?.status === 401) {
//       const errorMessage = error.response?.data?.message || '';
      
//       if (errorMessage.includes('Current password') || 
//           errorMessage.includes('incorrect')) {
//         // Set the error on the current password field
//         setErrors(prev => ({
//           ...prev,
//           currentPassword: 'Current password is incorrect'
//         }));
//         // Show toast notification
//         toast.error('Current password is incorrect');
//         return; // Exit early
//       } else {
//         // Other 401 errors (token expired, etc.)
//         toast.error('Session expired. Please login again.');
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         router.push('/signin');
//         return;
//       }
//     }
    
//     // Handle other errors
//     if (error.response?.status === 400) {
//       toast.error(error.response?.data?.message || 'Invalid request');
//     } else if (error.response?.status === 403) {
//       toast.error('Access denied');
//     } else if (error.response?.status === 500) {
//       toast.error('Server error. Please try again later.');
//     } else if (!error.response) {
//       toast.error('Network error. Please check your connection.');
//     } else {
//       toast.error('Failed to update password');
//     }
//   } finally {
//     setSaving(false);
//   }
// };
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Never';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <Link 
//                 href="/client/dashboard"
//                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   Account Settings
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Manage your profile and security settings
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//               userData?.isActive 
//                 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//                 : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//             }`}>
//               {userData?.isActive ? 'Active Account' : 'Account Inactive'}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Top Navigation Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200 dark:border-gray-700">
//           <nav className="flex space-x-1">
//             <button
//               onClick={() => setActiveTab('account')}
//               className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
//                 activeTab === 'account'
//                   ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
//               }`}
//             >
//               <div className="flex items-center">
//                 <Shield className="size-4 mr-2" />
//                 Account Information
//               </div>
//             </button>
            
//             <button
//               onClick={() => setActiveTab('profile')}
//               className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
//                 activeTab === 'profile'
//                   ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
//               }`}
//             >
//               <div className="flex items-center">
//                 <User className="size-4 mr-2" />
//                 Edit Profile Information
//               </div>
//             </button>
            
//             <button
//               onClick={() => setActiveTab('security')}
//               className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
//                 activeTab === 'security'
//                   ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
//                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
//               }`}
//             >
//               <div className="flex items-center">
//                 <Lock className="size-4 mr-2" />
//                 Security & Password
//               </div>
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* User Profile Card - Displayed on all tabs */}
//       <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
//         <div className="flex flex-col md:flex-row md:items-center gap-6">
//           <div className="flex items-center space-x-4">
//             <div className="size-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
//               {userData?.name?.charAt(0) || 'U'}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 {userData?.name}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {userData?.email}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Client ID: {userData?._id?.substring(0, 8)}... • Member since {formatDate(userData?.createdAt).split(',')[0]}
//               </p>
//             </div>
//           </div>
          
//           <div className="md:ml-auto flex flex-wrap gap-3">
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//               <div className="text-xs text-gray-500 dark:text-gray-400">Account Status</div>
//               <div className={`font-medium ${userData?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
//                 {userData?.isActive ? 'Active' : 'Inactive'}
//               </div>
//             </div>
            
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//               <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
//               <div className="font-medium text-gray-900 dark:text-white">
//                 {userData?.phone || 'Not provided'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div>
//         {/* Account Information Tab - Now first by default */}
//         {activeTab === 'account' && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
//                 <Shield className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
//                 Account Information
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 View your account details and status
//               </p>
//             </div>
            
//             <div className="p-6">
//               <div className="space-y-6">
//                 {/* Detailed Account Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
//                     <div className="flex items-center mb-4">
//                       <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
//                         <Shield className="size-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</div>
//                         <div className="text-gray-900 dark:text-white font-mono text-sm mt-1">
//                           {userData?._id || 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Unique identifier for your account
//                     </p>
//                   </div>
                  
//                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
//                     <div className="flex items-center mb-4">
//                       <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
//                         <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</div>
//                         <div className="mt-1">
//                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                             userData?.isActive
//                               ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//                               : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//                           }`}>
//                             {userData?.isActive ? 'Active' : 'Inactive'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {userData?.isActive ? 'Your account is active and functioning' : 'Your account is currently inactive'}
//                     </p>
//                   </div>
                  
//                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
//                     <div className="flex items-center mb-4">
//                       <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
//                         <User className="size-5 text-purple-600 dark:text-purple-400" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-500 dark:text-gray-400">User Role</div>
//                         <div className="text-gray-900 dark:text-white text-lg font-medium mt-1">
//                           {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Client'}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Your assigned role in the system
//                     </p>
//                   </div>
                  
                
//                 </div>

//                 {/* Contact Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
//                     <Mail className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
//                     Contact Information
//                   </h3>
//                   <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-800/30">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <div className="flex items-center mb-3">
//                           <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
//                             <Mail className="size-5 text-blue-500 dark:text-blue-400" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</div>
//                             <div className="text-gray-900 dark:text-white text-lg font-medium">
//                               {userData?.email}
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
//                           Primary contact email (cannot be changed)
//                         </p>
//                       </div>
                      
//                       <div>
//                         <div className="flex items-center mb-3">
//                           <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
//                             <Phone className="size-5 text-green-500 dark:text-green-400" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</div>
//                             <div className="text-gray-900 dark:text-white text-lg font-medium">
//                               {userData?.phone || 'Not provided'}
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
//                           Used for appointment reminders and notifications
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
//                     <div className="flex items-center mb-4">
//                       <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
//                         <Calendar className="size-5 text-yellow-600 dark:text-yellow-400" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</div>
//                         <div className="text-gray-900 dark:text-white text-lg font-medium mt-1">
//                           {formatDate(userData?.createdAt).split(',')[0]}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Date you joined our platform
//                     </p>
//                   </div>

             
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Profile Information Tab */}
//         {activeTab === 'profile' && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
//                 <User className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
//                 Profile Information
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 Update your personal information
//               </p>
//             </div>
            
//             <form onSubmit={handleProfileSubmit} className="p-6">
//               <div className="max-w-2xl mx-auto">
//                 <div className="space-y-6">
//                   {/* Name Field */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 rounded-lg border ${
//                         errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                       } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
//                       placeholder="John Doe"
//                     />
//                     {errors.name && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
//                     )}
//                   </div>

//                   {/* Email Field (Read-only) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="email"
//                         value={userData?.email || ''}
//                         readOnly
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
//                       />
//                       <div className="absolute right-3 top-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
//                         <Mail className="size-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                       Email cannot be changed. Contact support for assistance.
//                     </p>
//                   </div>

//                   {/* Phone Field */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 pl-12 rounded-lg border ${
//                           errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                         } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
//                         placeholder="(555) 123-4567"
//                       />
//                       <div className="absolute left-3 top-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
//                         <Phone className="size-5 text-green-600 dark:text-green-400" />
//                       </div>
//                     </div>
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
//                     )}
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                       Used for appointment reminders and notifications
//                     </p>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setActiveTab('account')}
//                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
//                     >
//                       <ArrowLeft className="size-4 mr-2" />
//                       Back to Account
//                     </button>
                    
//                     <div className="flex items-center space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData({
//                             name: userData?.name || '',
//                             phone: userData?.phone || '',
//                             currentPassword: '',
//                             newPassword: '',
//                             confirmPassword: ''
//                           });
//                           setErrors({});
//                         }}
//                         className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                       >
//                         Reset
//                       </button>
                      
//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center disabled:opacity-50"
//                       >
//                         {saving ? (
//                           <>
//                             <div className="animate-spin rounded-full size-5 border-b-2 border-white mr-2"></div>
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="size-5 mr-2" />
//                             Save Changes
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Security & Password Tab */}
//         {activeTab === 'security' && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
//                 <Lock className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
//                 Security & Password
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 mt-1">
//                 Update your password and security settings
//               </p>
//             </div>
            
//             <form onSubmit={handlePasswordSubmit} className="p-6">
//               <div className="max-w-2xl mx-auto">
//                 <div className="space-y-6">
//                   {/* Current Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Current Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showCurrentPassword ? "text" : "password"}
//                         name="currentPassword"
//                         value={formData.currentPassword}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 pr-10 rounded-lg border ${
//                           errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                         } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
//                         placeholder="Enter current password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                       >
//                         {showCurrentPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
//                       </button>
//                     </div>
//                     {errors.currentPassword && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
//                     )}
//                   </div>

//                   {/* New Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       New Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="newPassword"
//                         value={formData.newPassword}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 pr-10 rounded-lg border ${
//                           errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                         } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
//                         placeholder="Enter new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                       >
//                         {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
//                       </button>
//                     </div>
//                     {errors.newPassword && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
//                     )}
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                       Password must be at least 6 characters long
//                     </p>
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Confirm New Password *
//                     </label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       className={`w-full px-4 py-3 rounded-lg border ${
//                         errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                       } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
//                       placeholder="Confirm new password"
//                     />
//                     {errors.confirmPassword && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
//                     )}
//                   </div>

//                   {/* Password Requirements */}
//                   <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
//                     <h4 className="font-medium text-gray-900 dark:text-white mb-2">Password Requirements:</h4>
//                     <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                       <li className="flex items-center">
//                         <div className={`size-2 rounded-full mr-2 ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                         At least 6 characters
//                       </li>
//                       <li className="flex items-center">
//                         <div className={`size-2 rounded-full mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                         One uppercase letter
//                       </li>
//                       <li className="flex items-center">
//                         <div className={`size-2 rounded-full mr-2 ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                         One number
//                       </li>
//                       <li className="flex items-center">
//                         <div className={`size-2 rounded-full mr-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                         Passwords match
//                       </li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <button
//                       type="button"
//                       onClick={() => setActiveTab('account')}
//                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
//                     >
//                       <ArrowLeft className="size-4 mr-2" />
//                       Back to Account
//                     </button>
                    
//                     <div className="flex items-center space-x-3">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData(prev => ({
//                             ...prev,
//                             currentPassword: '',
//                             newPassword: '',
//                             confirmPassword: ''
//                           }));
//                           setErrors({});
//                         }}
//                         className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                       >
//                         Clear
//                       </button>
                      
//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center disabled:opacity-50"
//                       >
//                         {saving ? (
//                           <>
//                             <div className="animate-spin rounded-full size-5 border-b-2 border-white mr-2"></div>
//                             Updating...
//                           </>
//                         ) : (
//                           <>
//                             <Lock className="size-5 mr-2" />
//                             Update Password
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/app/client/settings/page.js - UPDATED WITH TOAST AND AUTO NAVIGATION
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster ,toast } from 'sonner'; // Using sonner toast
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  MapPin,
  CalendarDays,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ClientSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !currentUser) {
        toast.error('Please login first');
        router.push('/signin');
        return;
      }
      
      if (currentUser.role !== 'client') {
        toast.error('Only clients can access this page');
        router.push('/dashboard');
        return;
      }

      // Get user data - using client profile endpoint
      const response = await axios.get('https://ams-backend-psi.vercel.app/api/client/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const user = response.data.user;
        setUserData(user);
        setFormData({
          name: user.name,
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          gender: user.gender || '',
          address: user.address || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback to auth/me if client/profile doesn't work
      if (error.response?.status === 404) {
        try {
          // Try the auth/me endpoint as fallback
          const fallbackResponse = await axios.get('https://ams-backend-psi.vercel.app/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (fallbackResponse.data.success) {
            const user = fallbackResponse.data.user;
            setUserData(user);
            setFormData({
              name: user.name,
              phone: user.phone || '',
              dateOfBirth: user.dateOfBirth || '',
              gender: user.gender || '',
              address: user.address || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      }
      
      toast.error('Failed to load profile data');
      // For demo purposes, use sample data
      setUserData(getSampleUser());
    } finally {
      setLoading(false);
    }
  };

  const getSampleUser = () => {
    return {
      _id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      address: '123 Main St, New York, NY 10001',
      role: 'client',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z'
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Simple phone validation - only check if provided and if at least 10 digits
    if (formData.phone && formData.phone.trim()) {
      // Remove all non-digit characters
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }
    
    // Validate date of birth if provided
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const profileErrors = validateProfileForm();
    if (Object.keys(profileErrors).length > 0) {
      setErrors(profileErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        phone: formData.phone || '', // Send empty string if phone is cleared
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        address: formData.address
      };
      
      const response = await axios.put(
        `https://ams-backend-psi.vercel.app/api/client/profile`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Show success toast
        toast.success('Profile updated successfully!', {
          description: 'Your profile information has been saved.',
          duration: 3000,
        });
        
        // Update local user data
        const updatedUser = { ...userData, ...updateData };
        setUserData(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Navigate to account information tab
        setActiveTab('account');
        
        // Clear any errors
        setErrors({});
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error toast
      toast.error('Failed to update profile', {
        description: error.response?.data?.message || 'Please try again.',
        duration: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const passwordErrors = validatePasswordForm();
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      const response = await axios.put(
        `https://ams-backend-psi.vercel.app/api/client/password`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Show success toast
        toast.success('Password updated successfully!', {
          description: 'Your password has been changed.',
          duration: 3000,
        });
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Navigate to account information tab
        setActiveTab('account');
        
        // Clear errors
        setErrors({});
      }
    } catch (error) {
      // Check if it's a 401 error with "Current password is incorrect" message
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || '';
        
        if (errorMessage.includes('Current password') || 
            errorMessage.includes('incorrect')) {
          // Set the error on the current password field
          setErrors(prev => ({
            ...prev,
            currentPassword: 'Current password is incorrect'
          }));
          // Show error toast
          toast.error('Current password is incorrect', {
            description: 'Please enter your current password correctly.',
            duration: 4000,
          });
          return; // Exit early
        } else {
          // Other 401 errors (token expired, etc.)
          toast.error('Session expired', {
            description: 'Please login again to continue.',
            duration: 4000,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/signin');
          return;
        }
      }
      
      // Handle other errors with appropriate toasts
      if (error.response?.status === 400) {
        toast.error('Invalid request', {
          description: error.response?.data?.message || 'Please check your input.',
          duration: 4000,
        });
      } else if (error.response?.status === 403) {
        toast.error('Access denied', {
          description: 'You do not have permission to perform this action.',
          duration: 4000,
        });
      } else if (error.response?.status === 500) {
        toast.error('Server error', {
          description: 'Please try again later.',
          duration: 4000,
        });
      } else if (!error.response) {
        toast.error('Network error', {
          description: 'Please check your internet connection.',
          duration: 4000,
        });
      } else {
        toast.error('Failed to update password', {
          description: 'An unexpected error occurred.',
          duration: 4000,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set new password';
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBirthDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    return phone;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <Toaster 
        position="top-right" 
        expand={true}
        richColors
        toastOptions={{
          className: 'font-sans',
        }}
      />
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/client/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Account Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your profile and security settings
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              userData?.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {userData?.isActive ? 'Active Account' : 'Account Inactive'}
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'account'
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <Shield className="size-4 mr-2" />
                Account Information
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <User className="size-4 mr-2" />
                Edit Profile Information
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <Lock className="size-4 mr-2" />
                Security & Password
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* User Profile Card - Displayed on all tabs */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="size-20 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
              {userData?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {userData?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userData?.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData?.gender && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                    {userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)}
                  </span>
                )}
                {userData?.dateOfBirth && (
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                    Age: {calculateAge(userData.dateOfBirth)}
                  </span>
                )}
                {userData?.address && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    Has Address
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Client ID: {userData?._id?.substring(0, 8)}... • Member since {formatDate(userData?.createdAt).split(',')[0]}
              </p>
            </div>
          </div>
          
          <div className="md:ml-auto flex flex-wrap gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Account Status</div>
              <div className={`font-medium ${userData?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {userData?.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatPhoneNumber(userData?.phone)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Account Information Tab */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Shield className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Account Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    View your account details and status
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <User className="size-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Lock className="size-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Detailed Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                        <Shield className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</div>
                        <div className="text-gray-900 dark:text-white font-mono text-sm mt-1">
                          {userData?._id || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Unique identifier for your account
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                        <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            userData?.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {userData?.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userData?.isActive ? 'Your account is active and functioning' : 'Your account is currently inactive'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                        <User className="size-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">User Role</div>
                        <div className="text-gray-900 dark:text-white text-lg font-medium mt-1">
                          {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Client'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Your assigned role in the system
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <UserCircle className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Personal Information
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-800/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
                            <UserCircle className="size-5 text-purple-500 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</div>
                            <div className="text-gray-900 dark:text-white text-lg font-medium">
                              {userData?.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not specified'}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
                          Gender identity
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg mr-3">
                            <CalendarDays className="size-5 text-yellow-500 dark:text-yellow-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</div>
                            <div className="text-gray-900 dark:text-white text-lg font-medium">
                              {formatBirthDate(userData?.dateOfBirth)}
                              {userData?.dateOfBirth && (
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  (Age: {calculateAge(userData.dateOfBirth)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
                          Birth date
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Mail className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Contact Information
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-800/30">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                          <Mail className="size-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</div>
                          <div className="text-gray-900 dark:text-white text-lg font-medium">
                            {userData?.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                          <Phone className="size-5 text-green-500 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</div>
                          <div className="text-gray-900 dark:text-white text-lg font-medium">
                            {formatPhoneNumber(userData?.phone)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg mr-3 mt-1">
                          <MapPin className="size-5 text-red-500 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</div>
                          <div className="text-gray-900 dark:text-white">
                            {userData?.address ? (
                              <div>
                                <div className="font-medium">{userData.address}</div>
                              </div>
                            ) : 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Creation Info */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
                      <Calendar className="size-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</div>
                      <div className="text-gray-900 dark:text-white text-lg font-medium mt-1">
                        {formatDate(userData?.createdAt).split(',')[0]}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Date you joined our platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <User className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Profile Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Update your personal information
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('account')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Account
                </button>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={userData?.email || ''}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Mail className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        placeholder="1234567890 or (123) 456-7890"
                      />
                      <div className="absolute left-3 top-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                        <Phone className="size-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enter your 10-digit phone number (optional)
                    </p>
                  </div>

                  {/* Date of Birth Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                          errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      />
                      <div className="absolute left-3 top-3 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                        <CalendarDays className="size-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dateOfBirth}</p>
                    )}
                    {formData.dateOfBirth && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Age: {calculateAge(formData.dateOfBirth)} years old
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Used for age verification and personalized services (optional)
                    </p>
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                      >
                        <option value="">Select gender (optional)</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      <div className="absolute left-3 top-3 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                        <UserCircle className="size-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      For personalized communication and services (optional)
                    </p>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                          errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none`}
                        placeholder="123 Main St, Apt 4B, New York, NY 10001 (optional)"
                      />
                      <div className="absolute left-3 top-3 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                        <MapPin className="size-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Used for location-based services and directions (optional)
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: userData?.name || '',
                          phone: userData?.phone || '',
                          dateOfBirth: userData?.dateOfBirth || '',
                          gender: userData?.gender || '',
                          address: userData?.address || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Reset
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full size-5 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="size-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Security & Password Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Lock className="size-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Security & Password
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Update your password and security settings
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('account')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Account
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showCurrentPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
              <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Confirm New Password *
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleInputChange}
      className={`w-full px-4 py-3 pr-10 rounded-lg border ${
        errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
      } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
      placeholder="Confirm new password"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
    </button>
  </div>
  {errors.confirmPassword && (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
  )}
</div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Password Requirements:</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        At least 6 characters
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        One uppercase letter (recommended)
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        One number (recommended)
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Passwords match
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        }));
                        setErrors({});
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full size-5 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="size-5 mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}