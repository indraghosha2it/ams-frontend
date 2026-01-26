// src/app/admin/viewClients/page.js - With Edit Form
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
  Calendar,
  User,
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ViewClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [clientToDelete, setClientToDelete] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
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
        toast.error('Only admins can view clients');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const clientUsers = response.data.users.filter(user => user.role === 'client');
        setClients(clientUsers);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
      setClients(getSampleClients());
    } finally {
      setLoading(false);
    }
  };

  const getSampleClients = () => {
    return [
      {
        _id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        phone: '(555) 123-4567',
        role: 'client',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        name: 'Maria Garcia',
        email: 'maria@example.com',
        phone: '(555) 234-5678',
        role: 'client',
        isActive: true,
        createdAt: '2024-01-10T09:15:00Z'
      }
    ];
  };

  // Filter and search clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && client.isActive) ||
      (filterStatus === 'inactive' && !client.isActive);
    
    return matchesSearch && matchesFilter;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
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
  const currentClients = sortedClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Start editing a client
  const startEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      password: '', // Leave password blank - admin can choose to update it
      isActive: client.isActive
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
    
    // Clear error for this field
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
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  // Handle form submission
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare update data - only send password if it's provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isActive: formData.isActive
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${editingClient._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Client updated successfully');
        
        // Update local state
        setClients(clients.map(client => 
          client._id === editingClient._id 
            ? { ...client, ...updateData }
            : client
        ));
        
        // Reset editing state
        setEditingClient(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error updating client:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'Email already registered') {
        setFormErrors(prev => ({
          ...prev,
          email: 'Email is already registered to another user'
        }));
      } else {
        toast.error(error.response?.data?.message || 'Failed to update client');
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      isActive: true
    });
    setFormErrors({});
  };

  // Handle status toggle (activate/deactivate)
  const toggleClientStatus = async (clientId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/admin/users/${clientId}`,
        { isActive: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Client ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        setClients(clients.map(client => 
          client._id === clientId 
            ? { ...client, isActive: !currentStatus }
            : client
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update client status');
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (clientId, clientName) => {
    setClientToDelete({ id: clientId, name: clientName });
  };

  // Handle delete client
  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/admin/users/${clientToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Client "${clientToDelete.name}" deleted permanently from database`);
        setClients(clients.filter(client => client._id !== clientToDelete.id));
        setClientToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(error.response?.data?.message || 'Failed to delete client');
      setClientToDelete(null);
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

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-start mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                <Trash2 className="size-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  Delete Client Permanently
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to permanently delete client "{clientToDelete.name}"? This action cannot be undone and all client data will be lost.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Form */}
      {editingClient && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg mr-4">
                <UserCircle className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Client: {editingClient.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Update client information below
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

          <form onSubmit={handleUpdateClient} className="space-y-6">
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
                  placeholder="Enter client's full name"
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
                  placeholder="client@example.com"
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

              {/* Password Field */}
              <div>
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
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Account is active (client can log in)
              </label>
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
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
              >
                <Save className="size-4 mr-2" />
                Update Client
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
                  Client Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage all client accounts
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/createClient"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
            >
              <User className="size-4 mr-2" />
              Add Client
            </Link>
            
            <button
              onClick={fetchClients}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {clients.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Users className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {clients.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {clients.filter(c => !c.isActive).length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <XCircle className="size-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Editing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {editingClient ? 1 : 0}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Edit className="size-6 text-purple-600 dark:text-purple-400" />
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
                placeholder="Search clients by name, email, or phone..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              >
                <option value="all">All Clients</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading clients...</p>
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
                        Client
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentClients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="size-12 text-gray-400 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">No clients found</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            {searchTerm ? 'Try a different search term' : 'Add your first client to get started'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Client ID: {client._id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Mail className="size-4 mr-2" />
                              <span className="text-sm truncate max-w-[200px]">{client.email}</span>
                            </div>
                            {client.phone && (
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Phone className="size-4 mr-2" />
                                <span className="text-sm">{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 dark:text-gray-400">
                            <div className="font-medium">{formatDate(client.createdAt)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            client.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {client.isActive ? (
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
                              onClick={() => startEdit(client)}
                              className={`p-2 rounded-lg transition-colors ${
                                editingClient?._id === client._id
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              }`}
                              title="Edit Client"
                            >
                              <Edit className="size-4" />
                            </button>
                            
                            {/* Activate/Deactivate Button */}
                            <button
                              onClick={() => toggleClientStatus(client._id, client.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                client.isActive
                                  ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                  : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                              }`}
                              title={client.isActive ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {client.isActive ? <Shield className="size-4" /> : <CheckCircle className="size-4" />}
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => showDeleteConfirmation(client._id, client.name)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete Client Permanently"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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
                      {Math.min(indexOfLastItem, sortedClients.length)}
                    </span>{' '}
                    of <span className="font-medium">{sortedClients.length}</span> clients
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
                                ? 'bg-blue-600 text-white'
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