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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const allChecksPass = Object.values(passwordStrength).every(v => v);
    if (!allChecksPass) {
      toast.error('Please meet all password requirements');
      setShowPasswordRequirements(true);
      return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
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
        toast.error('Only admins can create client accounts');
        return;
      }
      
   const response = await axios.post('http://localhost:5000/api/admin/users', {
  name: formData.name,
  email: formData.email,
  phone: formData.phone ? formData.phone.replace(/\D/g, '') : '',
  password: formData.password,
  role: 'client' // Add this line - specify role as 'client'
}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
      
      if (response.data.success) {
        toast.success('Client account created successfully!');
        
        // Reset form
        setFormData({
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
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create client account. Please try again.';
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
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 size-12 rounded-xl flex items-center justify-center">
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
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        phone: formatPhoneNumber(e.target.value) 
                      })}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {formData.phone && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format: (123) 456-7890
                    </p>
                  )}
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
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
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
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
              href="/admin/clients"
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