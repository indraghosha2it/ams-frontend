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
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Phone,
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
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';


const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const router = useRouter();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800 ' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

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
    // Apply filters whenever filter criteria or upcoming appointments change
    applyFilters();
  }, [upcomingAppointments, searchTerm, selectedStatus, selectedDoctor, selectedDate]);

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
        
        // Filter for upcoming appointments (today and future dates only)
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of day
        
        const upcoming = allAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          appointmentDate.setHours(0, 0, 0, 0);
          
          // Include appointments from today onwards
          return appointmentDate >= now;
        });
        
        // Sort by date (ascending) and time
        upcoming.sort((a, b) => {
          const dateA = new Date(a.appointmentDate);
          const dateB = new Date(b.appointmentDate);
          
          if (dateA.getTime() === dateB.getTime()) {
            // If same date, sort by time
            const timeA = a.appointmentTime.split(':').map(Number);
            const timeB = b.appointmentTime.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          }
          
          return dateA - dateB;
        });
        
        setUpcomingAppointments(upcoming);
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
    let filtered = [...upcomingAppointments];

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

    // Filter by date
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filterDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === filterDate.getTime();
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
  };

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return searchTerm.trim() !== '' || 
           selectedStatus !== 'all' || 
           selectedDoctor !== 'all' || 
           selectedDate !== '';
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

  // Helper function to check if appointment time has passed
  const hasAppointmentTimePassed = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const appointmentDateTime = new Date(appointmentDate);
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    return appointmentDateTime < now;
  };

  // Helper function to check if appointment can be cancelled
  const canCancelAppointment = (appointmentDate, appointmentTime, status) => {
    if (status === 'cancelled' || status === 'completed') return false;
    
    const now = new Date();
    const appointmentDateTime = new Date(appointmentDate);
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    return appointmentDateTime > now;
  };

  // Helper function to check if appointment can be rescheduled
  const canRescheduleAppointment = (appointmentDate, appointmentTime, status) => {
    if (status === 'cancelled' || status === 'completed') return false;
    
    const now = new Date();
    const appointmentDateTime = new Date(appointmentDate);
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    return appointmentDateTime > now;
  };

  // Show cancel confirmation modal
  const showCancelConfirmation = (appointment) => {
    // Check if appointment can be cancelled
    if (!canCancelAppointment(appointment.appointmentDate, appointment.appointmentTime, appointment.status)) {
      if (appointment.status === 'cancelled') {
        toast.error('This appointment has already been cancelled.');
      } else if (appointment.status === 'completed') {
        toast.error('Cannot cancel a completed appointment.');
      } else {
        toast.error('Appointment time has already passed. Please contact the clinic directly if you need to make changes.');
      }
      return;
    }

    setAppointmentToCancel(appointment);
    setShowCancelConfirm(true);
  };

  // Close cancel confirmation modal
  const closeCancelConfirmation = () => {
    setShowCancelConfirm(false);
    setAppointmentToCancel(null);
  };

  // Perform the actual cancellation
  const performCancellation = async (appointmentId) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      console.log('📱 Frontend: Cancelling appointment ID:', appointmentId);
      
      const response = await axios({
        method: 'put',
        url: `${BACKEND_URL}/api/appointments/${appointmentId}/cancel`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Cancel response:', response.data);
      
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments(); // Refresh the list
        closeCancelConfirmation();
      }
    } catch (error) {
      console.error('❌ Error cancelling appointment:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          toast.error('You do not have permission to cancel this appointment');
        } else if (error.response.status === 404) {
          toast.error('Appointment not found');
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Cannot cancel this appointment');
        } else {
          toast.error('Failed to cancel appointment');
        }
      } else {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  // Handle cancel button click
  const handleCancelClick = (appointment) => {
    showCancelConfirmation(appointment);
  };

  // Helper function to get card class based on status
  const getStatusCardClass = (status) => {
    const statusConfig = {
      'pending': 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-white',
      'confirmed': 'border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-white',
      'cancelled': 'border-l-4 border-red-500 bg-gradient-to-r from-red-50/50 to-white',
      'completed': 'border-l-4 border-green-500 bg-gradient-to-r from-green-50/50 to-white'
    };
    
    return statusConfig[status] || 'border-l-4 border-slate-300 bg-white';
  };

  // Helper function for date badge color based on status
  const getDateBadgeClass = (dateString, status) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    // First check if it's today or tomorrow
    if (appointmentDate.getTime() === today.getTime()) {
      return 'bg-emerald-100';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (appointmentDate.getTime() === tomorrow.getTime()) {
      return 'bg-blue-100';
    }
    
    // Then apply status-based colors
    const statusConfig = {
      'pending': 'bg-blue-50',
      'confirmed': 'bg-emerald-50',
      'cancelled': 'bg-red-50',
      'completed': 'bg-green-50'
    };
    
    return statusConfig[status] || 'bg-slate-100';
  };

  // Helper function for status-based text colors
  const getStatusTextColor = (status, light = false) => {
    const colors = {
      'pending': light ? 'text-blue-600' : 'text-blue-700',
      'confirmed': light ? 'text-emerald-600' : 'text-emerald-700',
      'cancelled': light ? 'text-red-600' : 'text-red-700',
      'completed': light ? 'text-green-600' : 'text-green-700'
    };
    return colors[status] || 'text-slate-700';
  };

  // Helper function for status-based icon colors
  const getStatusIconColor = (status) => {
    const colors = {
      'pending': 'text-blue-600',
      'confirmed': 'text-emerald-600',
      'cancelled': 'text-red-600',
      'completed': 'text-green-600'
    };
    return colors[status] || 'text-slate-600';
  };

  // Helper function for doctor icon background
  const getDoctorIconBg = (status) => {
    const colors = {
      'pending': 'bg-blue-100',
      'confirmed': 'bg-emerald-100',
      'cancelled': 'bg-red-100',
      'completed': 'bg-green-100'
    };
    return colors[status] || 'bg-blue-100';
  };

  // Helper function for doctor icon color
  const getDoctorIconColor = (status) => {
    const colors = {
      'pending': 'text-blue-600',
      'confirmed': 'text-emerald-600',
      'cancelled': 'text-red-600',
      'completed': 'text-green-600'
    };
    return colors[status] || 'text-blue-600';
  };

  // Helper function for time badge
  const getStatusTimeBadge = (status) => {
    const colors = {
      'pending': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  // Helper functions for today's appointment indicator
  const getTodayIndicatorBg = (status) => {
    const colors = {
      'pending': 'bg-blue-50',
      'confirmed': 'bg-emerald-50',
      'cancelled': 'bg-red-50',
      'completed': 'bg-green-50'
    };
    return colors[status] || 'bg-emerald-50';
  };

  const getTodayIndicatorBorder = (status) => {
    const colors = {
      'pending': 'border-blue-200',
      'confirmed': 'border-emerald-200',
      'cancelled': 'border-red-200',
      'completed': 'border-green-200'
    };
    return colors[status] || 'border-emerald-200';
  };

  const getTodayIndicatorText = (status) => {
    const colors = {
      'pending': 'text-blue-700',
      'confirmed': 'text-emerald-700',
      'cancelled': 'text-red-700',
      'completed': 'text-green-700'
    };
    return colors[status] || 'text-emerald-700';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: ClockIcon,
        label: 'Pending'
      },
      'confirmed': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      'processing': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: ClockIcon,
        label: 'Processing'
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
    
    if (appointmentDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (appointmentDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    // Check if within this week
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // End of week (Saturday)
    
    if (appointmentDate >= thisWeekStart && appointmentDate <= thisWeekEnd) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilAppointment = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);
    
    const diffTime = appointmentDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays > 7) {
      const weeks = Math.floor(diffDays / 7);
      return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800">Loading Appointments</h3>
            <p className="text-slate-600 mt-2">Fetching your upcoming appointments...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && appointmentToCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-5 animate-in zoom-in-95">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cancel Appointment</h3>
                <p className="text-slate-600 text-sm">Are you sure you want to cancel?</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm">
              <div className="font-medium text-slate-800 mb-1">Appointment Details:</div>
              <div className="text-slate-600 space-y-1">
                <div className="truncate">
                  <span className="font-medium">Dr. {appointmentToCancel.doctorInfo.name}</span>
                </div>
                <div>
                  {new Date(appointmentToCancel.appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div>{appointmentToCancel.appointmentTime} - {appointmentToCancel.endTime}</div>
              </div>
            </div>
            
            <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-5 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4" />
                This action cannot be undone
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={closeCancelConfirmation}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => performCancellation(appointmentToCancel._id)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Upcoming Appointments</h1>
              <p className="text-slate-600 mt-1">Your scheduled appointments for today and upcoming days</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAppointments}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium"
              >
                Refresh
              </button>
              <div className="text-sm text-slate-600">
                Showing {filteredAppointments.length} upcoming appointment{filteredAppointments.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        {filteredAppointments.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{filteredAppointments.length}</div>
                  <div className="text-slate-600 text-sm font-medium">Total Upcoming</div>
                </div>
                <div className="text-blue-500 text-2xl bg-blue-100 p-3 rounded-lg">📅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {filteredAppointments.filter(a => a.status === 'confirmed').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Confirmed</div>
                </div>
                <div className="text-emerald-500 text-2xl bg-emerald-100 p-3 rounded-lg">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {filteredAppointments.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Pending</div>
                </div>
                <div className="text-blue-500 text-2xl bg-blue-100 p-3 rounded-lg">⏳</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700">
                    {filteredAppointments.filter(a => a.status === 'cancelled').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Cancelled</div>
                </div>
                <div className="text-red-500 text-2xl bg-red-100 p-3 rounded-lg">❌</div>
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments by patient name, doctor, reason, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              {/* Active Filters Badges and Clear Button */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Active Filters Badges */}
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-blue-600"
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                      Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      <button
                        onClick={() => setSelectedDate('')}
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
                        ? 'bg-blue-600 text-white border border-blue-600'
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
              <div className="text-slate-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {isAnyFilterActive() ? 'No appointments found' : 'No Upcoming Appointments'}
              </h3>
              <p className="text-slate-500 mb-6">
                {isAnyFilterActive() 
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any upcoming appointments scheduled.'}
              </p>
              {isAnyFilterActive() ? (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/client/bookApp'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                >
                  Book New Appointment
                </button>
              )}
            </div>
          ) : (
            currentAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const isToday = appointmentDate.setHours(0, 0, 0, 0) === today.getTime();
              const isTomorrow = new Date(today).setDate(today.getDate() + 1) === appointmentDate.getTime();
              const timePassed = hasAppointmentTimePassed(appointment.appointmentDate, appointment.appointmentTime);
              const canCancel = canCancelAppointment(appointment.appointmentDate, appointment.appointmentTime, appointment.status);
              const canReschedule = canRescheduleAppointment(appointment.appointmentDate, appointment.appointmentTime, appointment.status);
              
              return (
                <div
                  key={appointment._id}
                  className={`${getStatusCardClass(appointment.status)} rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Column - Date & Time */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Date Badge */}
                          <div className={`min-w-[100px] text-center ${getDateBadgeClass(appointment.appointmentDate, appointment.status)} rounded-lg p-3`}>
                            <div className={`text-2xl font-bold ${isToday ? 'text-emerald-700' : isTomorrow ? 'text-blue-700' : getStatusTextColor(appointment.status)}`}>
                              {appointmentDate.getDate()}
                            </div>
                            <div className={`text-sm ${isToday ? 'text-emerald-600' : isTomorrow ? 'text-blue-600' : getStatusTextColor(appointment.status, true)}`}>
                              {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {appointmentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                          </div>
                          
                          {/* Time & Serial Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className={`w-4 h-4 ${getStatusIconColor(appointment.status)}`} />
                              <span className="text-lg font-semibold text-slate-800">
                                {appointment.appointmentTime} - {appointment.endTime}
                              </span>
                              {timePassed && (
                                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-800 font-medium">
                                  Time Expired
                                </span>
                              )}
                            </div>
                            
                            {/* Serial Number */}
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-700">
                                Serial Number: <span className="font-semibold">{appointment.slotSerialNumber || 'N/A'}</span>
                              </span>
                            </div>
                            
                            {/* Days until appointment */}
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              <CalendarDays className="w-3 h-3" />
                              {getDaysUntilAppointment(appointment.appointmentDate)}
                              <span className={`text-xs px-2 py-0.5 rounded ${getStatusTimeBadge(appointment.status)}`}>
                                {appointment.doctorInfo.perPatientTime} minutes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle Column - Doctor Info */}
                      <div className="flex-1 border-l border-slate-200 lg:border-l-0 lg:border-x lg:px-6">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${getDoctorIconBg(appointment.status)} rounded-full flex items-center justify-center`}>
                            <Stethoscope className={`w-6 h-6 ${getDoctorIconColor(appointment.status)}`} />
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
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <Phone className="w-3 h-3" />
                              {appointment.patient.phone}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Reason: {appointment.patient.reason}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {/* Cancel Button with Tooltip */}
                            <div className="relative group">
                              <button
                                onClick={() => handleCancelClick(appointment)}
                                disabled={!canCancel}
                                className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1 ${
                                  canCancel
                                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                              >
                                <XCircle className="w-3 h-3" />
                                {appointment.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
                              </button>
                              
                              {/* Tooltip for disabled cancel button */}
                              {!canCancel && (
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 z-10">
                                  <div className="font-medium mb-1">Cannot Cancel Appointment</div>
                                  <div className="text-gray-300">
                                    {appointment.status === 'cancelled' 
                                      ? 'This appointment has already been cancelled.'
                                      : appointment.status === 'completed'
                                      ? 'This appointment has already been completed.'
                                      : 'Appointment time has already passed. Please contact the clinic directly for any changes.'}
                                  </div>
                                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              )}
                            </div>
                            
                            {/* Reschedule Button with Tooltip */}
                            <div className="relative group">
                              <button
                                onClick={() => canReschedule && router.push(`/client/rescheduleAppointment?id=${appointment._id}`)}
                                disabled={!canReschedule}
                                className={`px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1 ${
                                  canReschedule
                                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                                title={canReschedule ? "Reschedule this appointment" : "Cannot reschedule this appointment"}
                              >
                                <Calendar className="w-3 h-3" />
                                Reschedule
                              </button>
                              
                              {/* Tooltip for disabled reschedule button */}
                              {!canReschedule && (
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 z-10">
                                  <div className="font-medium mb-1">Cannot Reschedule Appointment</div>
                                  <div className="text-gray-300">
                                    {appointment.status === 'cancelled' 
                                      ? 'This appointment has been cancelled. Please book a new appointment.'
                                      : appointment.status === 'completed'
                                      ? 'This appointment has been completed.'
                                      : 'Appointment time has already passed.Please take new appointment.'}
                                  </div>
                                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Special indicator for today's appointments */}
                  {isToday && (
                    <div className={`${getTodayIndicatorBg(appointment.status)} border-t ${getTodayIndicatorBorder(appointment.status)} px-6 py-2`}>
                      <div className={`flex items-center gap-2 ${getTodayIndicatorText(appointment.status)} text-sm`}>
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">
                          {(() => {
                            switch(appointment.status) {
                              case 'confirmed':
                                return 'Today\'s Appointment is Confirmed';
                              case 'cancelled':
                                return 'Today\'s Appointment is Cancelled';
                              case 'pending':
                                return 'Today\'s Appointment Request is Still Pending';
                              case 'completed':
                                return 'Today\'s Appointment is Completed';
                              default:
                                return 'Today\'s Appointment';
                            }
                          })()}
                        </span>
                        - 
                        <span>
                          {(() => {
                            switch(appointment.status) {
                              case 'confirmed':
                                return 'Please arrive 30 minutes before your scheduled time.';
                              case 'cancelled':
                                return 'Please Take an Appointment again.';
                              case 'pending':
                                return 'Please wait for the confirmation Mail.';
                              case 'completed':
                                return 'Thank you for your visit!';
                              default:
                                return 'Please arrive 10 minutes before your scheduled time.';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
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
                        ? 'bg-blue-600 text-white border border-blue-600'
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

        {/* Help Section */}
        {filteredAppointments.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-700 mb-1">Before Your Appointment</div>
                <ul className="text-blue-600 space-y-1">
                  <li>• Arrive 10-15 minutes early</li>
                  <li>• Bring your ID and insurance card</li>
                  <li>• Note down any symptoms or questions</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-blue-700 mb-1">Cancellation Policy</div>
                <ul className="text-blue-600 space-y-1">
                  <li>• Cancel at least 24 hours in advance</li>
                  <li>• Late cancellations may incur fees</li>
                  <li>• Contact clinic for emergencies</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-blue-700 mb-1">Rescheduling</div>
                <ul className="text-blue-600 space-y-1">
                  <li>• Reschedule up to 2 hours before appointment</li>
                  <li>• Select new date/time from available slots</li>
                  <li>• Rescheduled appointments require re-approval</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;