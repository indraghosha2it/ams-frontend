"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  ChevronRight,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Phone,
  Mail,
  AlertCircle,
  CalendarDays,
  Hash,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  FileText,
  History,
  CalendarCheck,
  CalendarX
} from 'lucide-react';

const PastAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'confirmed', label: 'Confirmed (Missed)', color: 'bg-amber-100 text-amber-800' },
    { value: 'no-show', label: 'No Show', color: 'bg-purple-100 text-purple-800' }
  ];

  // Generate month options (last 12 months)
  const getMonthOptions = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const value = `${year}-${(month + 1).toString().padStart(2, '0')}`;
      
      months.unshift({
        value,
        label: monthStr,
        date: new Date(year, month, 1)
      });
    }
    
    return months;
  };

  const monthOptions = getMonthOptions();

  useEffect(() => {
    // Get logged in user's email from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || '');
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [userEmail]);

  useEffect(() => {
    // Apply filters whenever filter criteria or past appointments change
    applyFilters();
  }, [pastAppointments, searchTerm, selectedStatus, selectedDoctor, selectedDate, selectedMonth]);

  useEffect(() => {
    // Calculate total pages whenever filtered appointments change
    if (filteredAppointments.length > 0) {
      const pages = Math.ceil(filteredAppointments.length / itemsPerPage);
      setTotalPages(pages);
      
      // If current page is greater than total pages, go to last page
      if (currentPage > pages) {
        setCurrentPage(pages);
      }
    } else {
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [filteredAppointments, itemsPerPage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Fetch appointments for this client
      const response = await axios.get(`${BACKEND_URL}/api/appointments/patient/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const allAppointments = response.data.data || [];
        setAppointments(allAppointments);
        
        // Filter for past appointments (before today)
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of day
        
        const past = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          
          // Include appointments before today
          return appointmentDate < now;
        });
        
        // Sort by date (descending - most recent first)
        past.sort((a, b) => {
          const dateA = new Date(a.appointmentDate);
          const dateB = new Date(b.appointmentDate);
          
          if (dateA.getTime() === dateB.getTime()) {
            // If same date, sort by time (descending)
            const timeA = a.appointmentTime.split(':').map(Number);
            const timeB = b.appointmentTime.split(':').map(Number);
            return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
          }
          
          return dateB - dateA; // Most recent first
        });
        
        setPastAppointments(past);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BACKEND_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...pastAppointments];

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(appointment =>
        appointment.patient.fullName.toLowerCase().includes(term) ||
        appointment.patient.email.toLowerCase().includes(term) ||
        appointment.patient.phone.includes(term) ||
        appointment.doctorInfo.name.toLowerCase().includes(term) ||
        appointment.doctorInfo.speciality.toLowerCase().includes(term) ||
        appointment.patient.reason.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus);
    }

    // Filter by doctor
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(appointment => {
        const doctorId = appointment.doctorId._id || appointment.doctorId;
        return doctorId === selectedDoctor;
      });
    }

    // Filter by specific date
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filterDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === filterDate.getTime();
      });
    }

    // Filter by month
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }

    setFilteredAppointments(filtered);
  };

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedDoctor('all');
    setSelectedDate('');
    setSelectedMonth('');
  };

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return searchTerm.trim() !== '' || 
           selectedStatus !== 'all' || 
           selectedDoctor !== 'all' || 
           selectedDate !== '' ||
           selectedMonth !== '';
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to first page
  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to last page
  const goToLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get visible page numbers
  const getVisiblePageNumbers = () => {
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);
    
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        icon: ClockIcon,
        label: 'Pending'
      },
      'confirmed': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      'cancelled': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
        label: 'Cancelled'
      },
      'completed': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
        label: 'Completed'
      },
      'no-show': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        icon: CalendarX,
        label: 'No Show'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: ClockIcon,
      label: status
    };

    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (appointmentDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    // Check if within last 7 days
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    if (appointmentDate >= lastWeek && appointmentDate < today) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const appointmentDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - appointmentDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  const getAppointmentCardClass = (status) => {
    switch (status) {
      case 'completed':
        return 'border-l-4 border-green-500 bg-gradient-to-r from-green-50/50 to-white';
      case 'cancelled':
        return 'border-l-4 border-red-500 bg-gradient-to-r from-red-50/50 to-white';
      case 'no-show':
        return 'border-l-4 border-purple-500 bg-gradient-to-r from-purple-50/50 to-white';
      default:
        return 'border-l-4 border-slate-300 bg-white';
    }
  };

  const handleViewDetails = (appointment) => {
    // Implement view details functionality
    toast.success(`Viewing details for appointment with Dr. ${appointment.doctorInfo.name}`);
    // You could open a modal or navigate to a details page here
  };

  const handleDownloadPrescription = (appointment) => {
    // Implement download prescription functionality
    toast.success('Download feature coming soon!');
  };

  const handleBookFollowUp = (appointment) => {
    // Navigate to book appointment page with pre-filled doctor info
    const doctorId = appointment.doctorId._id || appointment.doctorId;
    window.location.href = `/book-appointment?doctorId=${doctorId}`;
  };

  const handleRateAppointment = (appointment) => {
    // Implement rating functionality
    toast.success('Rating feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800">Loading Past Appointments</h3>
            <p className="text-slate-600 mt-2">Fetching your appointment history...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentAppointments = getPaginatedData();
  const visiblePages = getVisiblePageNumbers();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAppointments.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Past Appointments</h1>
              <p className="text-slate-600 mt-1">Your previous appointments and medical history</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAppointments}
                className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 font-medium"
              >
                <History className="w-4 h-4" />
                Refresh History
              </button>
              <div className="text-sm text-slate-600">
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        {pastAppointments.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{pastAppointments.length}</div>
                  <div className="text-slate-600 text-sm font-medium">Total Past</div>
                </div>
                <div className="text-gray-500 text-2xl bg-gray-100 p-3 rounded-lg">📋</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {pastAppointments.filter(a => a.status === 'completed').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Completed</div>
                </div>
                <div className="text-green-500 text-2xl bg-green-100 p-3 rounded-lg">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700">
                    {pastAppointments.filter(a => a.status === 'cancelled').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Cancelled</div>
                </div>
                <div className="text-red-500 text-2xl bg-red-100 p-3 rounded-lg">❌</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-700">
                    {pastAppointments.filter(a => a.status === 'confirmed').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Missed</div>
                </div>
                <div className="text-amber-500 text-2xl bg-amber-100 p-3 rounded-lg">⚠️</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-700">
                    {pastAppointments.filter(a => a.status === 'no-show').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">No Show</div>
                </div>
                <div className="text-purple-500 text-2xl bg-purple-100 p-3 rounded-lg">👤</div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search past appointments by doctor, reason, or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all duration-300 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Doctor</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
                  >
                    <option value="all">All Doctors</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.speciality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Specific Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                  />
                </div>

                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white"
                  >
                    <option value="">All Months</option>
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Active Filters Badges and Clear Button */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Active Filters Badges */}
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-200">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200">
                      Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
                      <button
                        onClick={() => setSelectedStatus('all')}
                        className="ml-1 hover:text-amber-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedDoctor !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Doctor: {doctors.find(d => d._id === selectedDoctor)?.name || 'Selected'}
                      <button
                        onClick={() => setSelectedDoctor('all')}
                        className="ml-1 hover:text-emerald-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedDate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      <button
                        onClick={() => setSelectedDate('')}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {selectedMonth && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                      Month: {monthOptions.find(m => m.value === selectedMonth)?.label}
                      <button
                        onClick={() => setSelectedMonth('')}
                        className="ml-1 hover:text-purple-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                
                {/* Clear Filters Button */}
                {isAnyFilterActive() && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls - Top */}
        {filteredAppointments.length > itemsPerPage && (
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{filteredAppointments.length}</span> appointments
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-slate-600">per page</span>
              </div>
              
              <div className="h-6 border-l border-slate-300"></div>
              
              {/* Pagination Buttons */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4 text-slate-600" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                
                {/* Page Numbers */}
                {visiblePages.map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? 'bg-gray-600 text-white border border-gray-600'
                        : 'border border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                {/* Next Page */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Next Page"
                >
                  <ChevronRightIcon className="w-4 h-4 text-slate-600" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {currentAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-slate-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {isAnyFilterActive() ? 'No appointments found' : 'No Past Appointments'}
              </h3>
              <p className="text-slate-500 mb-6">
                {isAnyFilterActive() 
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any past appointments in your history.'}
              </p>
              {isAnyFilterActive() ? (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/book-appointment'}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium"
                >
                  Book New Appointment
                </button>
              )}
            </div>
          ) : (
            currentAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const today = new Date();
              const diffTime = today - appointmentDate;
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={appointment._id}
                  className={`${getAppointmentCardClass(appointment.status)} rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Column - Date & Time */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Date Badge */}
                          <div className={`min-w-[100px] text-center ${
                            appointment.status === 'completed' ? 'bg-green-100' :
                            appointment.status === 'cancelled' ? 'bg-red-100' :
                            appointment.status === 'no-show' ? 'bg-purple-100' :
                            'bg-slate-100'
                          } rounded-lg p-3`}>
                            <div className={`text-2xl font-bold ${
                              appointment.status === 'completed' ? 'text-green-700' :
                              appointment.status === 'cancelled' ? 'text-red-700' :
                              appointment.status === 'no-show' ? 'text-purple-700' :
                              'text-slate-700'
                            }`}>
                              {appointmentDate.getDate()}
                            </div>
                            <div className={`text-sm ${
                              appointment.status === 'completed' ? 'text-green-600' :
                              appointment.status === 'cancelled' ? 'text-red-600' :
                              appointment.status === 'no-show' ? 'text-purple-600' :
                              'text-slate-600'
                            }`}>
                              {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {appointmentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                          </div>
                          
                          {/* Time & Time Ago Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <span className="text-lg font-semibold text-slate-800">
                                {appointment.appointmentTime}
                              </span>
                              <span className="text-sm text-slate-500">
                                ({getTimeAgo(appointment.appointmentDate)})
                              </span>
                            </div>
                            
                            {/* Serial Number */}
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-700">
                                Serial: <span className="font-semibold">{appointment.slotSerialNumber || 'N/A'}</span>
                              </span>
                            </div>
                            
                            {/* Formatted Date */}
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              <CalendarDays className="w-3 h-3" />
                              {formatDate(appointment.appointmentDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle Column - Doctor Info */}
                      <div className="flex-1 border-l border-slate-200 lg:border-l-0 lg:border-x lg:px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">Dr. {appointment.doctorInfo.name}</h3>
                            <p className="text-slate-600 text-sm">{appointment.doctorInfo.speciality}</p>
                            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                              <MapPin className="w-3 h-3" />
                              {appointment.doctorInfo.location}
                            </div>
                            <div className="mt-2">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column - Patient Info & Actions */}
                      <div className="flex-1">
                        <div className="space-y-3">
                          {/* Patient Info */}
                          <div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{appointment.patient.fullName}</span>
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Reason: {appointment.patient.reason}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Duration: {appointment.doctorInfo.perPatientTime} minutes
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {/* View Details Button */}
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="px-3 py-1.5 text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              View Details
                            </button>
                            
                            {/* Rate Appointment Button (for completed appointments only) */}
                            {appointment.status === 'completed' && (
                              <button
                                onClick={() => handleRateAppointment(appointment)}
                                className="px-3 py-1.5 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition flex items-center gap-1"
                              >
                                <Star className="w-3 h-3" />
                                Rate
                              </button>
                            )}
                            
                            {/* Download Prescription Button (for completed appointments only) */}
                            {appointment.status === 'completed' && (
                              <button
                                onClick={() => handleDownloadPrescription(appointment)}
                                className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" />
                                Prescription
                              </button>
                            )}
                            
                            {/* Book Follow-up Button (for completed appointments only) */}
                            {appointment.status === 'completed' && (
                              <button
                                onClick={() => handleBookFollowUp(appointment)}
                                className="px-3 py-1.5 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1"
                              >
                                <CalendarCheck className="w-3 h-3" />
                                Follow-up
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls - Bottom */}
        {filteredAppointments.length > itemsPerPage && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="text-sm text-slate-600">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Page Navigation Controls */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm"
                >
                  <ChevronsLeft className="w-4 h-4" />
                  First
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                {visiblePages.map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? 'bg-gray-600 text-white border border-gray-600'
                        : 'border border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                {/* Next Page */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm"
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm"
                >
                  Last
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Go to Page Input */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Go to:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= totalPages) {
                      handlePageChange(value);
                    }
                  }}
                  className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {filteredAppointments.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <History className="w-5 h-5" />
              Appointment History Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700 mb-1">Most Visited Doctor</div>
                <div className="text-gray-600">
                  {(() => {
                    const doctorCounts = {};
                    filteredAppointments.forEach(app => {
                      const doctorId = app.doctorId._id || app.doctorId;
                      doctorCounts[doctorId] = (doctorCounts[doctorId] || 0) + 1;
                    });
                    const mostVisited = Object.entries(doctorCounts).sort((a, b) => b[1] - a[1])[0];
                    return mostVisited 
                      ? `${doctors.find(d => d._id === mostVisited[0])?.name || 'Unknown'} (${mostVisited[1]} visits)`
                      : 'No data';
                  })()}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">Average Visits per Month</div>
                <div className="text-gray-600">
                  {(() => {
                    const visitsByMonth = {};
                    filteredAppointments.forEach(app => {
                      const date = new Date(app.appointmentDate);
                      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                      visitsByMonth[monthYear] = (visitsByMonth[monthYear] || 0) + 1;
                    });
                    const totalMonths = Object.keys(visitsByMonth).length;
                    return totalMonths > 0 
                      ? `${(filteredAppointments.length / totalMonths).toFixed(1)} visits per month`
                      : 'No data';
                  })()}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">Recent Activity</div>
                <div className="text-gray-600">
                  {(() => {
                    if (filteredAppointments.length === 0) return 'No recent activity';
                    const latestAppointment = filteredAppointments[0];
                    const latestDate = new Date(latestAppointment.appointmentDate);
                    return `Last appointment: ${getTimeAgo(latestAppointment.appointmentDate)}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastAppointments;