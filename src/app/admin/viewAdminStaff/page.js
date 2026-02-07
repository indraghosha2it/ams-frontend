// src/app/admin/viewStaff/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  BadgeCheck,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function ViewStaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
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
        toast.error('Only admins can view staff');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Filter users with role 'admin' or 'staff'
        const staffUsers = response.data.users.filter(user => 
          user.role === 'admin' || user.role === 'staff'
        );
        setStaff(staffUsers);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff');
      setStaff(getSampleStaff());
    } finally {
      setLoading(false);
    }
  };

  const getSampleStaff = () => {
    return [
      {
        _id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '(555) 111-2222',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        _id: '2',
        name: 'John Manager',
        email: 'john@example.com',
        phone: '(555) 333-4444',
        role: 'staff',
        isActive: true,
        createdAt: '2024-01-05T14:30:00Z'
      },
      {
        _id: '3',
        name: 'Sarah Assistant',
        email: 'sarah@example.com',
        phone: '(555) 555-6666',
        role: 'staff',
        isActive: false,
        createdAt: '2024-01-10T09:15:00Z'
      }
    ];
  };

  // Filter and search staff
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phone && member.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filterRole === 'all' || 
      (filterRole === 'admin' && member.role === 'admin') ||
      (filterRole === 'staff' && member.role === 'staff');
    
    return matchesSearch && matchesFilter;
  });

  // Sort staff
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = sortedStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Start editing a staff member
  const startEdit = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      password: '',
      role: member.role,
      isActive: member.isActive
    });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!['admin', 'staff'].includes(formData.role)) {
      errors.role = 'Invalid role';
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  // Handle form submission
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      // Check if trying to change own role
      if (editingStaff._id === currentUser._id && formData.role !== currentUser.role) {
        toast.error('You cannot change your own role');
        return;
      }
      
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${editingStaff._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Staff member updated successfully');
        
        // Update local state
        setStaff(staff.map(member => 
          member._id === editingStaff._id 
            ? { ...member, ...updateData }
            : member
        ));
        
        // Reset editing state
        setEditingStaff(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'staff',
          isActive: true
        });
        
        // Update current user in localStorage if editing self
        if (editingStaff._id === currentUser._id) {
          const updatedUser = { ...currentUser, ...updateData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Show warning if role changed
          if (updateData.role !== currentUser.role) {
            toast.success('Your account has been updated. Please log in again.');
            setTimeout(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/signin');
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'Email already registered') {
        setFormErrors(prev => ({
          ...prev,
          email: 'Email is already registered to another user'
        }));
      } else {
        toast.error(error.response?.data?.message || 'Failed to update staff member');
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'staff',
      isActive: true
    });
    setFormErrors({});
  };

  // Handle status toggle
  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      // Check if trying to deactivate self
      if (staffId === currentUser._id) {
        toast.error('You cannot deactivate your own account');
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${staffId}`,
        { isActive: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Staff member ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        setStaff(staff.map(member => 
          member._id === staffId 
            ? { ...member, isActive: !currentStatus }
            : member
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update staff status');
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (staffId, staffName) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Check if trying to delete self
    if (staffId === currentUser._id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    setStaffToDelete({ id: staffId, name: staffName });
  };

  // Handle delete staff
  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/admin/users/${staffToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Staff member "${staffToDelete.name}" deleted successfully`);
        setStaff(staff.filter(member => member._id !== staffToDelete.id));
        setStaffToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error(error.response?.data?.message || 'Failed to delete staff member');
      setStaffToDelete(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="size-4" />;
      case 'staff':
        return <Shield className="size-4" />;
      default:
        return <ShieldAlert className="size-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'staff':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-start mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                <Trash2 className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  Delete Staff Member
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to permanently delete staff member "{staffToDelete.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Form */}
      {editingStaff && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3 rounded-lg mr-4">
                <UserCog className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit {editingStaff.role === 'admin' ? 'Admin' : 'Staff'}: {editingStaff.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Update staff information below
                </p>
              </div>
            </div>
            <button
              onClick={cancelEdit}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleUpdateStaff} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                  placeholder="Enter full name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                  placeholder="staff@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white`}
                  disabled={editingStaff._id === JSON.parse(localStorage.getItem('user'))._id}
                >
                  <option value="admin">Administrator</option>
                  <option value="staff">Staff Member</option>
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.role}</p>
                )}
                {editingStaff._id === JSON.parse(localStorage.getItem('user'))._id && (
                  <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                    You cannot change your own role
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white`}
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
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={editingStaff._id === JSON.parse(localStorage.getItem('user'))._id}
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Account is active (can log in)
              </label>
              {editingStaff._id === JSON.parse(localStorage.getItem('user'))._id && (
                <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                  You cannot deactivate your own account
                </span>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all flex items-center"
              >
                <Save className="size-4 mr-2" />
                Update {editingStaff.role === 'admin' ? 'Admin' : 'Staff'}
              </button>
            </div>
          </form>
        </div>
      )}

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
                  Staff & Admin Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage all staff and admin accounts
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/createStaff"
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center"
            >
              <UserPlus className="size-4 mr-2" />
              Add Staff
            </Link>
            
            <button
              onClick={fetchStaff}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Member</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {staff.length}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Users className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {staff.filter(s => s.role === 'admin').length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <ShieldCheck className="size-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {staff.filter(s => s.role === 'staff').length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Shield className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {staff.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="size-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading staff...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Staff Member
                        {sortConfig.key === 'name' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Joined
                        {sortConfig.key === 'createdAt' && (
                          <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentStaff.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="size-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No staff members found</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            {searchTerm ? 'Try a different search term' : 'Add your first staff member to get started'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentStaff.map((member) => {
                      const isCurrentUser = member._id === JSON.parse(localStorage.getItem('user'))._id;
                      
                      return (
                        <tr key={member._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                          isCurrentUser ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                        }`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                           
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                  {member.name}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {member._id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Mail className="size-4 mr-2" />
                                <span className="text-sm truncate max-w-[200px]">{member.email}</span>
                              </div>
                              {member.phone && (
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Phone className="size-4 mr-2" />
                                  <span className="text-sm">{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600 dark:text-gray-400">
                              <div className="font-medium">{formatDate(member.createdAt)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                              {getRoleIcon(member.role)}
                              <span className="ml-1">
                                {member.role === 'admin' ? 'Admin' : 'Staff'}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              member.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {member.isActive ? (
                                <>
                                  <CheckCircle className="size-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="size-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => startEdit(member)}
                                className={`p-2 rounded-lg transition-colors ${
                                  editingStaff?._id === member._id
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                } ${isCurrentUser ? 'cursor-help' : ''}`}
                                title={isCurrentUser ? 'Edit your own account' : 'Edit Staff'}
                              >
                                <Edit className="size-4" />
                              </button>
                              
                              {/* Activate/Deactivate Button */}
                              <button
                                onClick={() => toggleStaffStatus(member._id, member.isActive)}
                                className={`p-2 rounded-lg transition-colors ${
                                  member.isActive
                                    ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                    : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                } ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isCurrentUser ? 'Cannot deactivate yourself' : (member.isActive ? 'Deactivate Account' : 'Activate Account')}
                                disabled={isCurrentUser}
                              >
                                {member.isActive ? <Shield className="size-4" /> : <CheckCircle className="size-4" />}
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => showDeleteConfirmation(member._id, member.name)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isCurrentUser 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                }`}
                                title={isCurrentUser ? 'Cannot delete yourself' : 'Delete Staff Permanently'}
                                disabled={isCurrentUser}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, sortedStaff.length)}
                    </span>{' '}
                    of <span className="font-medium">{sortedStaff.length}</span> staff
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === pageNum
                                ? 'bg-teal-600 text-white'
                                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    
    
    </div>
  );
}