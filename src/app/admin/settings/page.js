// src/app/admin/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
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
  AlertCircle,
  ArrowLeft,
  Home,
  Settings,
  Users,
  Key,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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
      
      if (currentUser.role !== 'admin') {
        toast.error('Only admins can access this page');
        router.push('/dashboard');
        return;
      }

      // Get admin profile data from the new endpoint
      const response = await axios.get('http://localhost:5000/api/admin/profile', {
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
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      
      // For debugging
      if (error.response) {
        console.log('Response error:', error.response.status, error.response.data);
        
        // If endpoint not found (404), use local storage as fallback
        if (error.response.status === 404) {
          console.log('Admin profile endpoint returned 404, using local storage');
          const localUser = JSON.parse(localStorage.getItem('user'));
          if (localUser) {
            setUserData(localUser);
            setFormData({
              name: localUser.name,
              phone: localUser.phone || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            toast.error('Admin profile endpoint not configured yet');
            return;
          }
        }
      }
      
      toast.error('Failed to load profile data');
      // For demo purposes, use sample data
      setUserData(getSampleAdmin());
    } finally {
      setLoading(false);
    }
  };

  const getSampleAdmin = () => {
    return {
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '1234567890',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      permissions: {
        manageServices: true,
        manageAppointments: true,
        manageClients: true,
        manageStaff: true,
        viewReports: true
      }
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
    
    // Phone validation: must be at least 10 digits
    if (formData.phone) {
      // Remove all non-digit characters
      const digitsOnly = formData.phone.replace(/\D/g, '');
      
      // Check if it has at least 10 digits
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }
    
    return newErrors;
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const profileErrors = validateProfileForm();
    if (Object.keys(profileErrors).length > 0) {
      setErrors(profileErrors);
      
      // Show toast with all errors
      const errorMessages = Object.values(profileErrors).filter(msg => msg);
      if (errorMessages.length > 0) {
        toast.error(
          <div className="space-y-1">
            <p className="font-semibold">Please fix the following errors:</p>
            {errorMessages.map((msg, index) => (
              <p key={index} className="text-sm">• {msg}</p>
            ))}
          </div>,
          {
            duration: 5000,
          }
        );
      }
      return;
    }
    
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };
      
      const response = await axios.put(
        'http://localhost:5000/api/admin/profile',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(
          <div className="flex items-center space-x-2">
            <Check className="size-5 text-emerald-500" />
            <span>Profile updated successfully!</span>
          </div>,
          {
            duration: 3000,
          }
        );
        
        // Update local user data
        const updatedUser = { ...userData, ...updateData };
        setUserData(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Switch to account information tab after success
        setTimeout(() => {
          setActiveTab('account');
        }, 500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please login again';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => router.push('/signin'), 1500);
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid data provided';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      toast.error(
        <div className="flex items-center space-x-2">
          <X className="size-5 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 4000,
        }
      );
    } finally {
      setSaving(false);
    }
  };

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  
  const passwordErrors = validatePasswordForm();
  if (Object.keys(passwordErrors).length > 0) {
    setErrors(passwordErrors);
    
    // Show toast with all errors
    const errorMessages = Object.values(passwordErrors).filter(msg => msg);
    if (errorMessages.length > 0) {
      toast.error(
        <div className="space-y-1">
          <p className="font-semibold">Please fix the following errors:</p>
          {errorMessages.map((msg, index) => (
            <p key={index} className="text-sm">• {msg}</p>
          ))}
        </div>,
        {
          duration: 5000,
        }
      );
    }
    return;
  }
  
  if (!formData.newPassword) {
    toast.error('Please enter a new password', {
      duration: 3000,
    });
    return;
  }
  
  setSaving(true);
  
  // Declare loadingToastId outside the try block
  let loadingToastId;
  
  try {
    const token = localStorage.getItem('token');
    
    const updateData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };
    
    // Show loading toast
    loadingToastId = toast.loading(
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full size-5 border-b-2 border-teal-600"></div>
        <span>Updating password...</span>
      </div>
    );
    
    // Use axios with explicit error handling
    let response;
    try {
      response = await axios.put(
        'http://localhost:5000/api/admin/password',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (axiosError) {
      // Handle axios error without throwing
      response = { error: axiosError };
    }
    
    // Dismiss loading toast
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }
    
    // Check if we got an error response
    if (response.error) {
      const error = response.error;
      let errorMessage = 'Failed to update password';
      let isSessionExpired = false;
      let isCurrentPasswordWrong = false;
      
      // Check if it's a 401 error
      if (error.response && error.response.status === 401) {
        const errorMsg = error.response.data?.message || '';
        if (errorMsg.toLowerCase().includes('current password') || 
            errorMsg.toLowerCase().includes('incorrect')) {
          errorMessage = 'Current password is incorrect';
          isCurrentPasswordWrong = true;
        } else {
          errorMessage = 'Session expired. Please login again';
          isSessionExpired = true;
        }
      } else if (error.response && error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection';
      }
      
      toast.error(
        <div className="flex items-center space-x-2">
          <X className="size-5 text-red-500" />
          <span>{errorMessage}</span>
        </div>,
        {
          duration: 4000,
        }
      );
      
      if (isCurrentPasswordWrong) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
      }
      
      if (isSessionExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => router.push('/signin'), 1500);
      }
      
      return;
    }
    
    // Success case
    if (response.data && response.data.success) {
      toast.success(
        <div className="flex items-center space-x-2">
          <Check className="size-5 text-emerald-500" />
          <span>Password updated successfully!</span>
        </div>,
        {
          duration: 3000,
        }
      );
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setErrors({});
      
      // Switch to account information tab after success
      setTimeout(() => {
        setActiveTab('account');
      }, 500);
    }
  } catch (error) {
    // This catch is for unexpected errors (not axios errors)
    console.error('Unexpected error in handlePasswordSubmit:', error);
    
    // Dismiss loading toast if it exists
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
    }
    
    toast.error(
      <div className="flex items-center space-x-2">
        <X className="size-5 text-red-500" />
        <span>An unexpected error occurred. Please try again.</span>
      </div>,
      {
        duration: 4000,
      }
    );
  } finally {
    setSaving(false);
  }
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

  if (loading) {
    return (
      <div className="p-6">
        <Toaster position="top-right" richColors />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Add Toaster component */}
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
                href="/admin/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="size-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your admin profile and security settings
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 size-12 rounded-xl flex items-center justify-center">
                <Settings className="size-6 text-white" />
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              userData?.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {userData?.isActive ? 'Active Admin Account' : 'Account Inactive'}
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
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-teal-600 dark:text-teal-400'
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
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-teal-600 dark:text-teal-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <User className="size-4 mr-2" />
                Edit Profile
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-200 dark:border-gray-700 text-teal-600 dark:text-teal-400'
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
      <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800/30">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="size-20 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
              {userData?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {userData?.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userData?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Admin ID: {userData?._id?.substring(0, 8)}... • Member since {formatDate(userData?.createdAt).split(',')[0]}
              </p>
            </div>
          </div>
          
          <div className="md:ml-auto flex flex-wrap gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Admin Role</div>
              <div className="font-medium text-teal-600 dark:text-teal-400">
                {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Admin'}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Permissions</div>
              <div className="font-medium text-gray-900 dark:text-white">
                Full Access
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {userData?.phone || 'Not provided'}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Shield className="size-6 mr-3 text-teal-600 dark:text-teal-400" />
                Admin Account Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View your admin account details and permissions
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Detailed Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg mr-3">
                        <Key className="size-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin ID</div>
                        <div className="text-gray-900 dark:text-white font-mono text-sm mt-1">
                          {userData?._id || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Unique identifier for your admin account
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg mr-3">
                        <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            userData?.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {userData?.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userData?.isActive ? 'Admin account is active' : 'Admin account is currently inactive'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-3">
                        <User className="size-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">User Role</div>
                        <div className="text-gray-900 dark:text-white text-lg font-medium mt-1">
                          {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Admin'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      System administrator with full privileges
                    </p>
                  </div>
                </div>

              

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Mail className="size-5 mr-2 text-teal-600 dark:text-teal-400" />
                    Contact Information
                  </h3>
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-lg p-6 border border-teal-100 dark:border-teal-800/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="bg-teal-100 dark:bg-teal-900/20 p-2 rounded-lg mr-3">
                            <Mail className="size-5 text-teal-500 dark:text-teal-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</div>
                            <div className="text-gray-900 dark:text-white text-lg font-medium">
                              {userData?.email}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
                          Primary contact email (cannot be changed)
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-lg mr-3">
                            <Phone className="size-5 text-emerald-500 dark:text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</div>
                            <div className="text-gray-900 dark:text-white text-lg font-medium">
                              {userData?.phone || 'Not provided'}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 ml-14">
                          Contact number for system notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <User className="size-6 mr-3 text-teal-600 dark:text-teal-400" />
                Edit Admin Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update your admin profile information
              </p>
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
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'
                      } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none`}
                      placeholder="Admin Name"
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
                      <div className="absolute right-3 top-3 bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
                        <Mail className="size-5 text-teal-600 dark:text-teal-400" />
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
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none`}
                        placeholder="Enter 10-digit phone number"
                      />
                      <div className="absolute left-3 top-3 bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                        <Phone className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 10 digits (numbers only)
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('account')}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <ArrowLeft className="size-4 mr-2" />
                      Back to Account
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            name: userData?.name || '',
                            phone: userData?.phone || '',
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
              </div>
            </form>
          </div>
        )}

        {/* Security & Password Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Lock className="size-6 mr-3 text-teal-600 dark:text-teal-400" />
                Admin Security & Password
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update your admin password for security
              </p>
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
                          errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none`}
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
                          errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none`}
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
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'
                        } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent outline-none`}
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
                        <div className={`size-2 rounded-full mr-2 ${formData.newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                        At least 6 characters
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                        One uppercase letter
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${/[0-9]/.test(formData.newPassword) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                        One number
                      </li>
                      <li className="flex items-center">
                        <div className={`size-2 rounded-full mr-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
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
                      onClick={() => setActiveTab('account')}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <ArrowLeft className="size-4 mr-2" />
                      Back to Account
                    </button>
                    
                    <div className="flex items-center space-x-3">
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
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}