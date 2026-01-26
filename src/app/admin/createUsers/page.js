// src/app/admin/createUsers/page.js
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
  Briefcase, 
  Shield,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function CreateUsersPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     if (formData.password.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Get current user token
//       const token = localStorage.getItem('token');
//       const currentUser = JSON.parse(localStorage.getItem('user'));
      
//       if (!token || !currentUser) {
//         toast.error('Please login first');
//         router.push('/');
//         return;
//       }
      
//       if (currentUser.role !== 'admin') {
//         toast.error('Only admins can create users');
//         return;
//       }
      
//       // Try the admin endpoint first
//       let response;
//       try {
//         response = await axios.post('http://localhost:5000/api/admin/users', {
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//           role: formData.role
//         }, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//       } catch (adminError) {
//         // If admin endpoint fails, try business register endpoint as fallback
//         console.log('Admin endpoint failed, trying business register endpoint...');
//         response = await axios.post('http://localhost:5000/api/auth/register/business', {
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//           role: formData.role
//         }, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//       }
      
//       if (response.data.success) {
//         toast.success(`${formData.role === 'admin' ? 'Admin' : 'Staff'} account created successfully!`);
        
//         // Reset form
//         setFormData({
//           name: '',
//           email: '',
//           phone: '',
//           password: '',
//           confirmPassword: '',
//           role: 'staff'
//         });
        
//         // Show success details
//         toast.success(`Login credentials sent to ${formData.email}`);
//       }
//     } catch (error) {
//       console.error('Error creating user:', error);
      
//       // Better error messages
//       if (error.response) {
//         if (error.response.status === 401) {
//           toast.error('Session expired. Please login again.');
//           router.push('/signin');
//         } else if (error.response.status === 403) {
//           toast.error('You do not have permission to create users');
//         } else if (error.response.status === 400) {
//           toast.error(error.response.data.message || 'Invalid data. Please check all fields.');
//         } else if (error.response.status === 409) {
//           toast.error('Email already exists. Please use a different email.');
//         } else {
//           toast.error(error.response.data.message || 'Failed to create user');
//         }
//       } else if (error.request) {
//         toast.error('Network error. Please check if backend server is running.');
//         console.log('Backend URL:', 'http://localhost:5000');
//         console.log('Is backend running? Check: http://localhost:5000/api/health');
//       } else {
//         toast.error('Error: ' + error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }
  
  if (formData.password.length < 8) {
    toast.error('Password must be at least 8 characters');
    return;
  }
  
  setLoading(true);
  
  try {
    // Get current user token
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !currentUser) {
      toast.error('Please login first');
      router.push('/');
      return;
    }
    
    if (currentUser.role !== 'admin') {
      toast.error('Only admins can create users');
      return;
    }
    
    // Try the admin endpoint first
    let response;
    try {
      response = await axios.post('http://localhost:5000/api/admin/users', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (adminError) {
      // If admin endpoint fails, try business register endpoint as fallback
      try {
        response = await axios.post('http://localhost:5000/api/auth/register/business', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (businessError) {
        // If business endpoint also fails, use the admin error
        throw adminError;
      }
    }
    
    if (response.data.success) {
      toast.success(`${formData.role === 'admin' ? 'Admin' : 'Staff'} account created successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'staff'
      });
      
      // Show success details
      toast.success(`Login credentials sent to ${formData.email}`);
    }
  } catch (error) {
    // Better error messages
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Session expired. Please login again.');
        router.push('/signin');
      } else if (error.response.status === 403) {
        toast.error('You do not have permission to create users');
      } else if (error.response.status === 400) {
        toast.error(error.response.data.message || 'Invalid data. Please check all fields.');
      } else if (error.response.status === 409) {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error(error.response.data.message || 'Failed to create user');
      }
    } else if (error.request) {
      toast.error('Network error. Please check if backend server is running.');
    } else {
      toast.error('Error: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};
  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

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
                  Create New User
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create new admin or staff accounts
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 size-12 rounded-xl flex items-center justify-center">
              <PlusCircle className="size-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  User Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`p-4 rounded-xl border-2 transition-all ${formData.role === 'admin' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${formData.role === 'admin' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        <Shield className="size-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Administrator</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Full access to all system features
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRoleChange('staff')}
                    className={`p-4 rounded-xl border-2 transition-all ${formData.role === 'staff' 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${formData.role === 'staff' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        <Briefcase className="size-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Staff Member</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Limited access to assigned features
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="user@business.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="••••••••"
                      required
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Admin Warning Message */}
              {formData.role === 'admin' && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300">Administrator Privileges</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        This user will have full system access including user management, settings, and all data.
                        Only create admin accounts for trusted team members.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Note */}
              {formData.role === 'staff' && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <Briefcase className="size-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-800 dark:text-purple-300">Staff Access</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                        Staff members will have access to manage appointments, view client information, 
                        and handle assigned services based on their role assignments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-5 mr-2" />
                      Create {formData.role === 'admin' ? 'Admin' : 'Staff'} Account
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  User will receive login credentials
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
              <Shield className="size-5 mr-2 text-blue-600 dark:text-blue-400" />
              Creating User Accounts
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span><strong>Admin accounts</strong> have full access to all system features including user management.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span><strong>Staff accounts</strong> can manage appointments, view clients, and handle services.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Users will be able to reset their password after their first login.</span>
              </li>
              <li className="flex items-start">
                <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 mr-3 flex-shrink-0"></div>
                <span>All accounts are managed under <strong>ScheduleFlow</strong> system</span>
              </li>
            </ul>
          </div>

          {/* Quick Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              💡 Quick Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 size-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Use Professional Emails</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use business email addresses for better organization.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 size-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Set Strong Passwords</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use at least 8 characters with letters, numbers, and symbols.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 size-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Role Assignment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assign roles based on responsibilities and access needs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Created Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Recently Created Users
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', role: 'Admin', email: 'sarah@business.com', date: 'Today' },
                { name: 'Mike Chen', role: 'Staff', email: 'mike@business.com', date: 'Yesterday' },
                { name: 'Emma Davis', role: 'Staff', email: 'emma@business.com', date: '2 days ago' }
              ].map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className={`size-10 rounded-full flex items-center justify-center ${user.role === 'Admin' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}
                  >
                    {user.role === 'Admin' ? <Shield className="size-5" /> : <Briefcase className="size-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{user.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${user.role === 'Admin' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/staff"
              className="mt-4 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all users
              <svg className="size-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}