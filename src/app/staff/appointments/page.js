// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { toast, Toaster } from 'react-hot-toast';
// import { useRouter } from 'next/navigation'; 
// import {
//   Search,
//   Filter,
//   Calendar,
//   Clock,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   ChevronDown,
//   ChevronUp,
//   CheckCircle,
//   XCircle,
//   Clock as ClockIcon,
//   RefreshCw,
//   Download,
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   Lock,
//   ChevronsUpDown,
//   CalendarDays,
//   Hash,
//   UserCheck,
//   Shield,
//   Stethoscope
// } from 'lucide-react';

// const StaffAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [selectedDoctor, setSelectedDoctor] = useState('all');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: 'appointmentDate', direction: 'desc' });
//   const [showFilters, setShowFilters] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     confirmed: 0,
//     cancelled: 0
//   });
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
//   const router = useRouter();

//   const statusOptions = [
//     { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
//     { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
//     { value: 'confirmed', label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800' },
//     { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
//   ];

//   useEffect(() => {
//     fetchAppointments();
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     filterAndSortAppointments();
//   }, [appointments, searchTerm, selectedStatus, selectedDoctor, selectedDate, sortConfig]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.status-dropdown')) {
//         setStatusDropdownOpen(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BACKEND_URL}/api/appointments`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         setAppointments(response.data.data);
//         calculateStats(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       toast.error('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BACKEND_URL}/api/doctors`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data.success) {
//         setDoctors(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//     }
//   };

//   const calculateStats = (appointmentsList) => {
//     const stats = {
//       total: appointmentsList.length,
//       pending: appointmentsList.filter(a => a.status === 'pending').length,
//       confirmed: appointmentsList.filter(a => a.status === 'confirmed').length,
//       cancelled: appointmentsList.filter(a => a.status === 'cancelled').length
//     };
//     setStats(stats);
//   };

//   const filterAndSortAppointments = () => {
//     let filtered = [...appointments];

//     // Filter by search term - FIXED
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(appointment => {
//         // Check patient name
//         if (appointment.patient?.fullName?.toLowerCase().includes(term)) return true;
        
//         // Check patient email
//         if (appointment.patient?.email?.toLowerCase().includes(term)) return true;
        
//         // Check patient phone - handle phone numbers with/without spaces
//         if (appointment.patient?.phone) {
//           const phoneWithoutSpaces = appointment.patient.phone.replace(/\s+/g, '');
//           const termWithoutSpaces = term.replace(/\s+/g, '');
//           if (phoneWithoutSpaces.includes(termWithoutSpaces)) return true;
//         }
        
//         // Check doctor name
//         if (appointment.doctorInfo?.name?.toLowerCase().includes(term)) return true;
        
//         // Check doctor speciality
//         if (appointment.doctorInfo?.speciality?.toLowerCase().includes(term)) return true;
        
//         // Check slot serial number
//         if (appointment.slotSerialNumber?.toString().includes(term)) return true;
        
//         // Check appointment ID
//         if (appointment._id?.toLowerCase().includes(term)) return true;
        
//         return false;
//       });
//     }

//     // Filter by status - FIXED
//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter(appointment => appointment.status === selectedStatus);
//     }

//     // Filter by doctor - FIXED
//     if (selectedDoctor !== 'all') {
//       filtered = filtered.filter(appointment => {
//         // Check if doctorId is an object with _id property or a string
//         const doctorId = appointment.doctorId?._id || appointment.doctorId;
//         return doctorId === selectedDoctor;
//       });
//     }

//     // Filter by date - FIXED
//     if (selectedDate) {
//       const filterDate = new Date(selectedDate);
//       // Normalize the filter date to midnight
//       filterDate.setHours(0, 0, 0, 0);
      
//       filtered = filtered.filter(appointment => {
//         if (!appointment.appointmentDate) return false;
        
//         const appointmentDate = new Date(appointment.appointmentDate);
//         // Normalize appointment date to midnight for comparison
//         appointmentDate.setHours(0, 0, 0, 0);
        
//         return appointmentDate.getTime() === filterDate.getTime();
//       });
//     }

//     // Sort appointments
//     filtered.sort((a, b) => {
//       if (sortConfig.key === 'appointmentDate') {
//         const dateA = new Date(a.appointmentDate);
//         const dateB = new Date(b.appointmentDate);
//         return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
//       }
      
//       if (sortConfig.key === 'patientName') {
//         const nameA = a.patient?.fullName || '';
//         const nameB = b.patient?.fullName || '';
//         return sortConfig.direction === 'asc' 
//           ? nameA.localeCompare(nameB)
//           : nameB.localeCompare(nameA);
//       }
      
//       if (sortConfig.key === 'doctorName') {
//         const doctorA = a.doctorInfo?.name || '';
//         const doctorB = b.doctorInfo?.name || '';
//         return sortConfig.direction === 'asc'
//           ? doctorA.localeCompare(doctorB)
//           : doctorB.localeCompare(doctorA);
//       }
      
//       if (sortConfig.key === 'status') {
//         const statusOrder = { 'pending': 0, 'confirmed': 1, 'cancelled': 2 };
//         const statusA = statusOrder[a.status] || 3;
//         const statusB = statusOrder[b.status] || 3;
//         return sortConfig.direction === 'asc'
//           ? statusA - statusB
//           : statusB - statusA;
//       }
      
//       return 0;
//     });

//     setFilteredAppointments(filtered);
//   };

//   const handleSort = (key) => {
//     setSortConfig(prevConfig => ({
//       key,
//       direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   // Check if appointment can be rescheduled (cancelled appointments cannot be rescheduled, and expired time slots today cannot be rescheduled)
// // Check if appointment can be rescheduled (cancelled appointments and all expired appointments cannot be rescheduled)
// const canReschedule = (status, appointmentDate, appointmentTime) => {
//   // Block rescheduling for all cancelled appointments
//   if (status === 'cancelled') return false;
  
//   // Check if appointment is in the past (including expired time slots today)
//   if (appointmentDate && appointmentTime) {
//     const now = new Date();
//     const appointmentDateObj = new Date(appointmentDate);
    
//     // Parse appointment time (e.g., "14:30" -> 14 hours, 30 minutes)
//     const [hours, minutes] = appointmentTime.split(':').map(Number);
//     const appointmentDateTime = new Date(appointmentDateObj);
//     appointmentDateTime.setHours(hours, minutes, 0, 0);
    
//     // If appointment date/time is in the past, block rescheduling
//     return appointmentDateTime > now;
//   }
  
//   // If no time info, check just the date
//   if (appointmentDate) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const appointmentDateObj = new Date(appointmentDate);
//     appointmentDateObj.setHours(0, 0, 0, 0);
    
//     // If appointment date is today or in the future, allow rescheduling
//     return appointmentDateObj >= today;
//   }
  
//   // For appointments without date info, allow rescheduling
//   return true;
// };

//   // Staff can update appointment status
//   const handleStatusUpdate = async (appointmentId, newStatus) => {
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
//       const token = localStorage.getItem('token');
      
//       const response = await axios.put(
//         `${BACKEND_URL}/api/appointments/${appointmentId}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         toast.success(`Appointment status updated to ${newStatus}`);
//         setStatusDropdownOpen(null);
//         fetchAppointments();
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // Get row color based on status
//   const getRowColorClass = (status) => {
//     switch (status) {
//       case 'confirmed':
//         return 'bg-emerald-50/50 hover:bg-emerald-100/80 border-l-4 border-emerald-400';
//       case 'pending':
//         return 'bg-amber-50/50 hover:bg-amber-100/80 border-l-4 border-amber-400';
//       case 'cancelled':
//         return 'bg-red-50/50 hover:bg-red-100/80 border-l-4 border-red-400';
//       default:
//         return 'hover:bg-slate-50 border-l-4 border-slate-300';
//     }
//   };

//   // Toggle status dropdown
//   const toggleStatusDropdown = (appointmentId) => {
//     setStatusDropdownOpen(statusDropdownOpen === appointmentId ? null : appointmentId);
//   };

//   // Check if status can be changed
//   const canChangeStatus = (status) => {
//     return status !== 'cancelled';
//   };

//   // Check if appointment time has passed
// // Check if appointment time has passed
// const hasAppointmentTimePassed = (appointmentDate, appointmentTime) => {
//   if (!appointmentDate) return false;
  
//   const now = new Date();
  
//   if (appointmentTime) {
//     // Parse appointment time
//     const [hours, minutes] = appointmentTime.split(':').map(Number);
//     const appointmentDateTime = new Date(appointmentDate);
//     appointmentDateTime.setHours(hours, minutes, 0, 0);
    
//     return appointmentDateTime < now;
//   }
  
//   // If no time, check just the date
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const appointmentDateObj = new Date(appointmentDate);
//   appointmentDateObj.setHours(0, 0, 0, 0);
  
//   return appointmentDateObj < today;
// };

//   // Pagination
//   const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid Date';
//       return date.toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getStatusBadge = (status, appointmentId, canChange) => {
//     const isOpen = statusDropdownOpen === appointmentId;
    
//     return (
//       <div className="relative status-dropdown">
//         <button
//           onClick={() => canChange && toggleStatusDropdown(appointmentId)}
//           className={`flex items-center gap-1 ${canChange ? 'cursor-pointer hover:opacity-90 transition-opacity' : 'cursor-default'}`}
//           disabled={!canChange}
//           title={canChange ? "Click to change status" : "Cancelled appointments cannot be changed"}
//         >
//           <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${
//             status === 'pending' ? 'bg-amber-100 text-amber-800' :
//             status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
//             status === 'cancelled' ? 'bg-red-100 text-red-800' :
//             'bg-gray-100 text-gray-800'
//           }`}>
//             {status === 'pending' && <ClockIcon className="w-3 h-3" />}
//             {status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
//             {status === 'cancelled' && <XCircle className="w-3 h-3" />}
//             {status.charAt(0).toUpperCase() + status.slice(1)}
//           </span>
//           {canChange && (
//             <ChevronsUpDown className={`w-3 h-3 transition-transform ${
//               isOpen ? 'rotate-180' : ''
//             } ${
//               status === 'pending' ? 'text-amber-600' :
//               status === 'confirmed' ? 'text-emerald-600' :
//               'text-slate-600'
//             }`} />
//           )}
//           {!canChange && <Lock className="w-3 h-3 text-red-500" />}
//         </button>

//         {/* Status Change Dropdown */}
//         {isOpen && canChange && (
//           <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-lg z-20">
//             <div className="p-2">
//               <div className="text-xs font-medium text-slate-700 mb-2 px-2">Change Status:</div>
              
//               {/* Pending Option */}
//               {status !== 'pending' && (
//                 <button
//                   onClick={() => handleStatusUpdate(appointmentId, 'pending')}
//                   className="w-full px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 rounded flex items-center gap-2 mb-1"
//                 >
//                   <ClockIcon className="w-3 h-3" />
//                   <span>Mark as Pending</span>
//                 </button>
//               )}
              
//               {/* Confirmed Option */}
//               {status !== 'confirmed' && (
//                 <button
//                   onClick={() => handleStatusUpdate(appointmentId, 'confirmed')}
//                   className="w-full px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 rounded flex items-center gap-2 mb-1"
//                 >
//                   <CheckCircle className="w-3 h-3" />
//                   <span>Confirm Appointment</span>
//                 </button>
//               )}
              
//               {/* Cancelled Option */}
//               {status !== 'cancelled' && (
//                 <button
//                   onClick={() => handleStatusUpdate(appointmentId, 'cancelled')}
//                   className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 rounded flex items-center gap-2"
//                 >
//                   <XCircle className="w-3 h-3" />
//                   <span>Cancel Appointment</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const exportToCSV = () => {
//     const headers = [
//       'Patient Name',
//       'Patient Email',
//       'Patient Phone',
//       'Doctor Name',
//       'Doctor Speciality',
//       'Appointment Date',
//       'Appointment Time',
//       'Slot Serial Number',
//       'Status',
//       'Reason'
//     ];
    
//     const csvContent = [
//       headers.join(','),
//       ...filteredAppointments.map(app => [
//         `"${app.patient?.fullName || ''}"`,
//         `"${app.patient?.email || ''}"`,
//         `"${app.patient?.phone || ''}"`,
//         `"${app.doctorInfo?.name || ''}"`,
//         `"${app.doctorInfo?.speciality || ''}"`,
//         `"${formatDate(app.appointmentDate)}"`,
//         `"${app.appointmentTime || ''}"`,
//         `"${app.slotSerialNumber || ''}"`,
//         `"${app.status || ''}"`,
//         `"${app.patient?.reason || ''}"`
//       ].join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Handle reschedule navigation
//   const handleReschedule = (appointmentId) => {
//     router.push(`/staff/rescheduleAppointment?id=${appointmentId}`);
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedStatus('all');
//     setSelectedDoctor('all');
//     setSelectedDate('');
//     setShowFilters(false);
//     toast.success('All filters cleared');
//   };

//   // Check if any filter is active
//   const hasActiveFilters = searchTerm || selectedStatus !== 'all' || selectedDoctor !== 'all' || selectedDate;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         <Toaster position="top-right" />
//         <div className="flex justify-center items-center h-96">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <h3 className="text-xl font-semibold text-slate-800">Loading Appointments</h3>
//             <p className="text-slate-600 mt-2">Please wait while we fetch all appointments...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
//       <Toaster position="top-right" />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="bg-blue-100 p-2 rounded-lg">
//                   <UserCheck className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl md:text-3xl font-bold text-slate-800">All Appointments</h1>
//                   <p className="text-slate-600 mt-1">Staff View - Manage and track all patient appointments</p>
//                 </div>
//               </div>
//               <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mt-2">
//                 <Shield className="w-3 h-3" />
//                 <span>Staff can update appointment status</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={exportToCSV}
//                 className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-medium"
//               >
//                 <Download className="w-4 h-4" />
//                 Export CSV
//               </button>
//               <button
//                 onClick={fetchAppointments}
//                 className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Dashboard */}
//         <div className="mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
//                   <div className="text-slate-600 text-sm font-medium">Total Appointments</div>
//                 </div>
//                 <div className="text-blue-500 text-2xl bg-blue-100 p-3 rounded-lg">📅</div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
//                   <div className="text-slate-600 text-sm font-medium">Pending</div>
//                 </div>
//                 <div className="text-amber-500 text-2xl bg-amber-100 p-3 rounded-lg">⏳</div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-emerald-700">{stats.confirmed}</div>
//                   <div className="text-slate-600 text-sm font-medium">Confirmed</div>
//                 </div>
//                 <div className="text-emerald-500 text-2xl bg-emerald-100 p-3 rounded-lg">✅</div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
//                   <div className="text-slate-600 text-sm font-medium">Cancelled</div>
//                 </div>
//                 <div className="text-red-500 text-2xl bg-red-100 p-3 rounded-lg">❌</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//           <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
//             {/* Search Input */}
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search appointments by patient name, email, phone, or doctor..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full px-4 py-2.5 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 shadow-sm"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Filter Toggle */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
//               >
//                 <Filter className="w-4 h-4" />
//                 {showFilters ? 'Hide Filters' : 'Show Filters'}
//                 {showFilters ? (
//                   <ChevronUp className="w-4 h-4" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4" />
//                 )}
//               </button>
              
//               {hasActiveFilters && (
//                 <button
//                   onClick={clearFilters}
//                   className="px-4 py-2.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
//                 >
//                   ✕ Clear Filters
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-slate-200">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Status Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//                   >
//                     {statusOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Doctor Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Doctor</label>
//                   <select
//                     value={selectedDoctor}
//                     onChange={(e) => setSelectedDoctor(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//                   >
//                     <option value="all">All Doctors</option>
//                     {doctors.map(doctor => (
//                       <option key={doctor._id} value={doctor._id}>
//                         Dr. {doctor.name} - {doctor.speciality}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Date Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Date</label>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   />
//                 </div>
//               </div>
              
//               {/* Clear Filters */}
//               {(selectedStatus !== 'all' || selectedDoctor !== 'all' || selectedDate) && (
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={clearFilters}
//                     className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Results Summary */}
//         <div className="mb-4 flex items-center justify-between">
//           <div className="text-sm text-slate-600">
//             Showing <span className="font-medium">{filteredAppointments.length}</span> appointments
//             {hasActiveFilters && (
//               <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
//                 Filtered
//               </span>
//             )}
//           </div>
          
//           {/* Active Filters Display */}
//           {hasActiveFilters && (
//             <div className="flex flex-wrap gap-2">
//               {searchTerm && (
//                 <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
//                   Search: "{searchTerm}"
//                   <button 
//                     onClick={() => setSearchTerm('')}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               )}
//               {selectedStatus !== 'all' && (
//                 <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
//                   Status: {selectedStatus}
//                   <button 
//                     onClick={() => setSelectedStatus('all')}
//                     className="text-amber-500 hover:text-amber-700"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               )}
//               {selectedDoctor !== 'all' && (
//                 <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">
//                   Doctor: {doctors.find(d => d._id === selectedDoctor)?.name || 'Selected'}
//                   <button 
//                     onClick={() => setSelectedDoctor('all')}
//                     className="text-emerald-500 hover:text-emerald-700"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               )}
//               {selectedDate && (
//                 <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200">
//                   Date: {new Date(selectedDate).toLocaleDateString()}
//                   <button 
//                     onClick={() => setSelectedDate('')}
//                     className="text-purple-500 hover:text-purple-700"
//                   >
//                     ✕
//                   </button>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Appointments Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//           {/* Table Header */}
//           <div className="border-b border-slate-200">
//             <div className="grid grid-cols-13 gap-4 px-6 py-4 bg-slate-50">
//               <div 
//                 className="col-span-3 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
//                 onClick={() => handleSort('patientName')}
//               >
//                 Patient Info
//                 {sortConfig.key === 'patientName' && (
//                   <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
//                 )}
//               </div>
//               <div 
//                 className="col-span-2 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
//                 onClick={() => handleSort('doctorName')}
//               >
//                 Doctor Info
//                 {sortConfig.key === 'doctorName' && (
//                   <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
//                 )}
//               </div>
//               <div 
//                 className="col-span-3 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
//                 onClick={() => handleSort('appointmentDate')}
//               >
//                 Date, Time & Serial
//                 {sortConfig.key === 'appointmentDate' && (
//                   <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
//                 )}
//               </div>
//               <div className="col-span-2 font-medium text-slate-700">Contact Details</div>
//               <div 
//                 className="col-span-2 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
//                 onClick={() => handleSort('status')}
//               >
//                 Status
//                 {sortConfig.key === 'status' && (
//                   <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
//                 )}
//               </div>
//               <div className="col-span-1 font-medium text-slate-700 text-center">Actions</div>
//             </div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-slate-200/50">
//             {currentAppointments.length === 0 ? (
//               <div className="p-12 text-center">
//                 <div className="text-slate-400 text-6xl mb-4">📅</div>
//                 <h3 className="text-lg font-semibold text-slate-700 mb-2">
//                   {hasActiveFilters ? 'No appointments found' : 'No appointments available'}
//                 </h3>
//                 <p className="text-slate-500 mb-4">
//                   {hasActiveFilters
//                     ? 'Try adjusting your search or filter criteria'
//                     : 'No appointments have been booked yet'}
//                 </p>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearFilters}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                   >
//                     Clear All Filters
//                   </button>
//                 )}
//               </div>
//             ) : (
//               currentAppointments.map((appointment) => {
//                 const canChange = canChangeStatus(appointment.status);
//                 const canRescheduleAppointment = canReschedule(appointment.status, appointment.appointmentDate, appointment.appointmentTime);
//                 const timePassed = hasAppointmentTimePassed(appointment.appointmentDate, appointment.appointmentTime);
                
//                 return (
//                   <div 
//                     key={appointment._id} 
//                     className={`px-6 py-4 transition-colors ${getRowColorClass(appointment.status)}`}
//                   >
//                     <div className="grid grid-cols-13 gap-4 items-center">
//                       {/* Patient Info */}
//                       <div className="col-span-3">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                             appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
//                             appointment.status === 'pending' ? 'bg-amber-100 text-amber-600' :
//                             appointment.status === 'cancelled' ? 'bg-red-100 text-red-600' :
//                             'bg-slate-100 text-slate-600'
//                           }`}>
//                             <User className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <div className="font-medium text-slate-900">{appointment.patient?.fullName || 'N/A'}</div>
//                             <div className="text-sm text-slate-600">
//                               {appointment.patient?.gender || 'N/A'} • 
//                               {appointment.patient?.dateOfBirth 
//                                 ? ` ${new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years`
//                                 : ' N/A years'}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2 text-sm text-slate-600 line-clamp-2">
//                           Reason: {appointment.patient?.reason || 'N/A'}
//                         </div>
//                       </div>

//                       {/* Doctor Info */}
//                       <div className="col-span-2">
//                         <div className="font-medium text-slate-900">Dr. {appointment.doctorInfo?.name || 'N/A'}</div>
//                         <div className="text-sm text-slate-600">{appointment.doctorInfo?.speciality || 'N/A'}</div>
//                         <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
//                           <MapPin className="w-3 h-3" />
//                           {appointment.doctorInfo?.location || 'N/A'}
//                         </div>
//                       </div>

//                       {/* Date & Time with Serial Number */}
//                       <div className="col-span-3">
//                         <div className="flex items-center gap-2 text-slate-700">
//                           <Calendar className={`w-4 h-4 ${
//                             appointment.status === 'confirmed' ? 'text-emerald-500' :
//                             appointment.status === 'pending' ? 'text-amber-500' :
//                             appointment.status === 'cancelled' ? 'text-red-500' :
//                             'text-slate-500'
//                           }`} />
//                           <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
//                           {timePassed && (
//                             <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-800 font-medium">
//                               Time Expired
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 text-slate-600 mt-1">
//                           <Clock className={`w-4 h-4 ${
//                             appointment.status === 'confirmed' ? 'text-emerald-500' :
//                             appointment.status === 'pending' ? 'text-amber-500' :
//                             appointment.status === 'cancelled' ? 'text-red-500' :
//                             'text-slate-500'
//                           }`} />
//                           <span>{appointment.appointmentTime || 'N/A'} - {appointment.endTime || 'N/A'}</span>
//                         </div>
                        
//                         {/* Serial Number Display */}
//                         <div className="mt-2">
//                           <div className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1 w-fit">
//                             <Hash className="w-3 h-3" />
//                             Sl No-{appointment.slotSerialNumber || 0}
//                           </div>
//                           <div className="text-xs text-slate-500 mt-1">
//                             Duration: {appointment.doctorInfo?.perPatientTime || 15} min
//                           </div>
//                         </div>
//                       </div>

//                       {/* Contact Details */}
//                       <div className="col-span-2">
//                         <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
//                           <Mail className="w-3 h-3" />
//                           {appointment.patient?.email || 'N/A'}
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                           <Phone className="w-3 h-3" />
//                           {appointment.patient?.phone || 'N/A'}
//                         </div>
//                         {appointment.patient?.address && (
//                           <div className="text-sm text-slate-500 mt-1 line-clamp-1">
//                             {appointment.patient.address}
//                           </div>
//                         )}
//                       </div>

//                       {/* Status with Clickable Badge */}
//                       <div className="col-span-2">
//                         {getStatusBadge(appointment.status, appointment._id, canChange)}
//                         <div className="mt-2 text-xs text-slate-500">
//                           Created: {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString() : 'N/A'}
//                         </div>
//                         {!canChange && (
//                           <div className="mt-1 text-xs text-red-600 italic">
//                             Cancelled appointments cannot be changed
//                           </div>
//                         )}
//                       </div>

//                       {/* Actions - Staff can reschedule */}
//                       <div className="col-span-1">
//                         <div className="flex justify-center">
//                           <button
//                             onClick={() => canRescheduleAppointment && handleReschedule(appointment._id)}
//                             className={`p-1.5 rounded-lg transition ${
//                               canRescheduleAppointment
//                                 ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer'
//                                 : 'text-gray-400 cursor-not-allowed'
//                             }`}
//                             title={
//                               canRescheduleAppointment
//                                 ? "Reschedule Appointment"
//                                 : appointment.status === 'cancelled'
//                                 ? "Cancelled appointments cannot be rescheduled"
//                                 : timePassed
//                                 ? "Appointment time has expired. Cannot reschedule"
//                                 : "Cannot reschedule"
//                             }
//                             disabled={!canRescheduleAppointment}
//                           >
//                             <CalendarDays className="w-4 h-4" />
//                           </button>
//                         </div>
//                         {!canRescheduleAppointment && (
//                           <div className="mt-1 text-xs text-red-600 text-center">
//                             {appointment.status === 'cancelled' 
//                               ? 'Cancelled'
//                               : timePassed
//                               ? 'Time Expired'
//                               : 'N/A'
//                             }
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Pagination */}
//           {filteredAppointments.length > 0 && (
//             <div className="border-t border-slate-200 px-6 py-4">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-sm text-slate-600">
//                   Showing {startIndex + 1} to {Math.min(endIndex, filteredAppointments.length)} of {filteredAppointments.length} appointments
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <select
//                     value={itemsPerPage}
//                     onChange={(e) => {
//                       setItemsPerPage(Number(e.target.value));
//                       setCurrentPage(1);
//                     }}
//                     className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
//                   >
//                     <option value={5}>5 per page</option>
//                     <option value={10}>10 per page</option>
//                     <option value={25}>25 per page</option>
//                     <option value={50}>50 per page</option>
//                   </select>
                  
//                   <div className="flex items-center gap-1">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
                    
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
                      
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`w-8 h-8 rounded-lg text-sm font-medium ${
//                             currentPage === pageNum
//                               ? 'bg-blue-600 text-white'
//                               : 'border border-slate-300 hover:bg-slate-50 text-slate-700'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
                    
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Stats Footer */}
//         <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
//           <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
//             <Sparkles className="w-4 h-4" />
//             Appointment Insights
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             <div>
//               <div className="text-slate-600">Today's Appointments</div>
//               <div className="font-semibold text-slate-900">
//                 {appointments.filter(a => {
//                   if (!a.appointmentDate) return false;
//                   const today = new Date();
//                   const appDate = new Date(a.appointmentDate);
//                   return appDate.toDateString() === today.toDateString();
//                 }).length}
//               </div>
//             </div>
//             <div>
//               <div className="text-slate-600">This Week</div>
//               <div className="font-semibold text-slate-900">
//                 {appointments.filter(a => {
//                   if (!a.appointmentDate) return false;
//                   const today = new Date();
//                   const appDate = new Date(a.appointmentDate);
//                   const oneWeekAgo = new Date(today);
//                   oneWeekAgo.setDate(today.getDate() - 7);
//                   return appDate >= oneWeekAgo && appDate <= today;
//                 }).length}
//               </div>
//             </div>
//             <div>
//               <div className="text-slate-600">Most Popular Doctor</div>
//               <div className="font-semibold text-slate-900">
//                 {(() => {
//                   const doctorCounts = {};
//                   appointments.forEach(app => {
//                     if (!app.doctorInfo?.name) return;
//                     const doctorName = app.doctorInfo.name;
//                     doctorCounts[doctorName] = (doctorCounts[doctorName] || 0) + 1;
//                   });
//                   const mostPopular = Object.entries(doctorCounts).sort((a, b) => b[1] - a[1])[0];
//                   return mostPopular ? `${mostPopular[0]} (${mostPopular[1]})` : 'N/A';
//                 })()}
//               </div>
//             </div>
//             <div>
//               <div className="text-slate-600">Avg. Response Time</div>
//               <div className="font-semibold text-slate-900">
//                 {(() => {
//                   const pendingApps = appointments.filter(a => a.status === 'pending');
//                   if (pendingApps.length === 0) return '0h';
                  
//                   const now = new Date();
//                   const totalHours = pendingApps.reduce((sum, app) => {
//                     const created = app.createdAt ? new Date(app.createdAt) : now;
//                     return sum + (now - created) / (1000 * 60 * 60);
//                   }, 0);
                  
//                   return `${Math.round(totalHours / pendingApps.length)}h`;
//                 })()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffAppointments;



"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'; 
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  ChevronsUpDown,
  CalendarDays,
  Hash,
  UserCheck,
  Shield,
  Stethoscope,
  CalendarRange,
  TrendingUp
} from 'lucide-react';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'appointmentDate', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'today', 'upcoming', 'past'
  const router = useRouter();

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const tabs = [
    { id: 'all', label: 'All Appointments', icon: CalendarRange },
    { id: 'today', label: "Today's", icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', icon: TrendingUp },
    { id: 'past', label: 'Past', icon: ClockIcon }
  ];

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterAndSortAppointments();
  }, [appointments, searchTerm, selectedStatus, selectedDoctor, selectedDate, sortConfig, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setStatusDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BACKEND_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setAppointments(response.data.data);
        calculateStats(response.data.data);
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
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
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

  const calculateStats = (appointmentsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppointments = appointmentsList.filter(app => {
      const appDate = new Date(app.appointmentDate);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime();
    });

    const stats = {
      total: appointmentsList.length,
      pending: appointmentsList.filter(a => a.status === 'pending').length,
      confirmed: appointmentsList.filter(a => a.status === 'confirmed').length,
      cancelled: appointmentsList.filter(a => a.status === 'cancelled').length,
      today: todayAppointments.length,
      todayPending: todayAppointments.filter(a => a.status === 'pending').length,
      todayConfirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
      todayCancelled: todayAppointments.filter(a => a.status === 'cancelled').length
    };
    setStats(stats);
  };

  const filterAndSortAppointments = () => {
    let filtered = [...appointments];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter by active tab
    if (activeTab === 'today') {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      });
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        // Only include appointments after today (not including today)
        return appointmentDate > new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tomorrow onwards
      });
    } else if (activeTab === 'past') {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() < today.getTime(); // Before today
      });
    }

    // Filter by search term - FIXED
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(appointment => {
        // Check patient name
        if (appointment.patient?.fullName?.toLowerCase().includes(term)) return true;
        
        // Check patient email
        if (appointment.patient?.email?.toLowerCase().includes(term)) return true;
        
        // Check patient phone - handle phone numbers with/without spaces
        if (appointment.patient?.phone) {
          const phoneWithoutSpaces = appointment.patient.phone.replace(/\s+/g, '');
          const termWithoutSpaces = term.replace(/\s+/g, '');
          if (phoneWithoutSpaces.includes(termWithoutSpaces)) return true;
        }
        
        // Check doctor name
        if (appointment.doctorInfo?.name?.toLowerCase().includes(term)) return true;
        
        // Check doctor speciality
        if (appointment.doctorInfo?.speciality?.toLowerCase().includes(term)) return true;
        
        // Check slot serial number
        if (appointment.slotSerialNumber?.toString().includes(term)) return true;
        
        // Check appointment ID
        if (appointment._id?.toLowerCase().includes(term)) return true;
        
        return false;
      });
    }

    // Filter by status - FIXED
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus);
    }

    // Filter by doctor - FIXED
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(appointment => {
        // Check if doctorId is an object with _id property or a string
        const doctorId = appointment.doctorId?._id || appointment.doctorId;
        return doctorId === selectedDoctor;
      });
    }

    // Filter by date - FIXED
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      // Normalize the filter date to midnight
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(appointment => {
        if (!appointment.appointmentDate) return false;
        
        const appointmentDate = new Date(appointment.appointmentDate);
        // Normalize appointment date to midnight for comparison
        appointmentDate.setHours(0, 0, 0, 0);
        
        return appointmentDate.getTime() === filterDate.getTime();
      });
    }

    // Sort appointments
    filtered.sort((a, b) => {
      if (sortConfig.key === 'appointmentDate') {
        const dateA = new Date(a.appointmentDate);
        const dateB = new Date(b.appointmentDate);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortConfig.key === 'patientName') {
        const nameA = a.patient?.fullName || '';
        const nameB = b.patient?.fullName || '';
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      
      if (sortConfig.key === 'doctorName') {
        const doctorA = a.doctorInfo?.name || '';
        const doctorB = b.doctorInfo?.name || '';
        return sortConfig.direction === 'asc'
          ? doctorA.localeCompare(doctorB)
          : doctorB.localeCompare(doctorA);
      }
      
      if (sortConfig.key === 'status') {
        const statusOrder = { 'pending': 0, 'confirmed': 1, 'cancelled': 2 };
        const statusA = statusOrder[a.status] || 3;
        const statusB = statusOrder[b.status] || 3;
        return sortConfig.direction === 'asc'
          ? statusA - statusB
          : statusB - statusA;
      }
      
      return 0;
    });

    setFilteredAppointments(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Check if appointment can be rescheduled (cancelled appointments and all expired appointments cannot be rescheduled)
  const canReschedule = (status, appointmentDate, appointmentTime) => {
    // Block rescheduling for all cancelled appointments
    if (status === 'cancelled') return false;
    
    // Check if appointment is in the past (including expired time slots today)
    if (appointmentDate && appointmentTime) {
      const now = new Date();
      const appointmentDateObj = new Date(appointmentDate);
      
      // Parse appointment time (e.g., "14:30" -> 14 hours, 30 minutes)
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      const appointmentDateTime = new Date(appointmentDateObj);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      // If appointment date/time is in the past, block rescheduling
      return appointmentDateTime > now;
    }
    
    // If no time info, check just the date
    if (appointmentDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const appointmentDateObj = new Date(appointmentDate);
      appointmentDateObj.setHours(0, 0, 0, 0);
      
      // If appointment date is today or in the future, allow rescheduling
      return appointmentDateObj >= today;
    }
    
    // For appointments without date info, allow rescheduling
    return true;
  };

  // Staff can update appointment status
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${BACKEND_URL}/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Appointment status updated to ${newStatus}`);
        setStatusDropdownOpen(null);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Get row color based on status
  const getRowColorClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50/50 hover:bg-emerald-100/80 border-l-4 border-emerald-400';
      case 'pending':
        return 'bg-amber-50/50 hover:bg-amber-100/80 border-l-4 border-amber-400';
      case 'cancelled':
        return 'bg-red-50/50 hover:bg-red-100/80 border-l-4 border-red-400';
      default:
        return 'hover:bg-slate-50 border-l-4 border-slate-300';
    }
  };

  // Toggle status dropdown
  const toggleStatusDropdown = (appointmentId) => {
    setStatusDropdownOpen(statusDropdownOpen === appointmentId ? null : appointmentId);
  };

  // Check if status can be changed
  const canChangeStatus = (status) => {
    return status !== 'cancelled';
  };

  // Check if appointment time has passed
  const hasAppointmentTimePassed = (appointmentDate, appointmentTime) => {
    if (!appointmentDate) return false;
    
    const now = new Date();
    
    if (appointmentTime) {
      // Parse appointment time
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      const appointmentDateTime = new Date(appointmentDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      return appointmentDateTime < now;
    }
    
    // If no time, check just the date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDateObj = new Date(appointmentDate);
    appointmentDateObj.setHours(0, 0, 0, 0);
    
    return appointmentDateObj < today;
  };

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get tab badge count
  const getTabBadgeCount = (tabId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (tabId) {
      case 'all':
        return appointments.length;
      case 'today':
        return appointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() === today.getTime();
        }).length;
      case 'upcoming':
        return appointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          // Only count appointments after today (not including today)
          return appDate > new Date(today.getTime() + 24 * 60 * 60 * 1000);
        }).length;
      case 'past':
        return appointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() < today.getTime();
        }).length;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status, appointmentId, canChange) => {
    const isOpen = statusDropdownOpen === appointmentId;
    
    return (
      <div className="relative status-dropdown">
        <button
          onClick={() => canChange && toggleStatusDropdown(appointmentId)}
          className={`flex items-center gap-1 ${canChange ? 'cursor-pointer hover:opacity-90 transition-opacity' : 'cursor-default'}`}
          disabled={!canChange}
          title={canChange ? "Click to change status" : "Cancelled appointments cannot be changed"}
        >
          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${
            status === 'pending' ? 'bg-amber-100 text-amber-800' :
            status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
            status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status === 'pending' && <ClockIcon className="w-3 h-3" />}
            {status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
            {status === 'cancelled' && <XCircle className="w-3 h-3" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {canChange && (
            <ChevronsUpDown className={`w-3 h-3 transition-transform ${
              isOpen ? 'rotate-180' : ''
            } ${
              status === 'pending' ? 'text-amber-600' :
              status === 'confirmed' ? 'text-emerald-600' :
              'text-slate-600'
            }`} />
          )}
          {!canChange && <Lock className="w-3 h-3 text-red-500" />}
        </button>

        {/* Status Change Dropdown */}
        {isOpen && canChange && (
          <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-xs font-medium text-slate-700 mb-2 px-2">Change Status:</div>
              
              {/* Pending Option */}
              {status !== 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(appointmentId, 'pending')}
                  className="w-full px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 rounded flex items-center gap-2 mb-1"
                >
                  <ClockIcon className="w-3 h-3" />
                  <span>Mark as Pending</span>
                </button>
              )}
              
              {/* Confirmed Option */}
              {status !== 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(appointmentId, 'confirmed')}
                  className="w-full px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 rounded flex items-center gap-2 mb-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Confirm Appointment</span>
                </button>
              )}
              
              {/* Cancelled Option */}
              {status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusUpdate(appointmentId, 'cancelled')}
                  className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 rounded flex items-center gap-2"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Cancel Appointment</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Patient Name',
      'Patient Email',
      'Patient Phone',
      'Doctor Name',
      'Doctor Speciality',
      'Appointment Date',
      'Appointment Time',
      'Slot Serial Number',
      'Status',
      'Reason'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredAppointments.map(app => [
        `"${app.patient?.fullName || ''}"`,
        `"${app.patient?.email || ''}"`,
        `"${app.patient?.phone || ''}"`,
        `"${app.doctorInfo?.name || ''}"`,
        `"${app.doctorInfo?.speciality || ''}"`,
        `"${formatDate(app.appointmentDate)}"`,
        `"${app.appointmentTime || ''}"`,
        `"${app.slotSerialNumber || ''}"`,
        `"${app.status || ''}"`,
        `"${app.patient?.reason || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Handle reschedule navigation
  const handleReschedule = (appointmentId) => {
    router.push(`/staff/rescheduleAppointment?id=${appointmentId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedDoctor('all');
    setSelectedDate('');
    setShowFilters(false);
    toast.success('All filters cleared');
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm || selectedStatus !== 'all' || selectedDoctor !== 'all' || selectedDate;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800">Loading Appointments</h3>
            <p className="text-slate-600 mt-2">Please wait while we fetch all appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">All Appointments</h1>
                  <p className="text-slate-600 mt-1">Staff View - Manage and track all patient appointments</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm mt-2">
                <Shield className="w-3 h-3" />
                <span>You can update appointment status & Reschedule it</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchAppointments}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>


        {/* Stats Dashboard - Updated for active tab */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {activeTab === 'today' ? stats.today : 
                     activeTab === 'upcoming' ? appointments.filter(a => {
                       const today = new Date();
                       today.setHours(0, 0, 0, 0);
                       const appointmentDate = new Date(a.appointmentDate);
                       // Only count appointments after today (not including today)
                       return appointmentDate > new Date(today.getTime() + 24 * 60 * 60 * 1000);
                     }).length :
                     activeTab === 'past' ? appointments.filter(a => {
                       const appDate = new Date(a.appointmentDate);
                       appDate.setHours(0, 0, 0, 0);
                       return appDate.getTime() < new Date().setHours(0, 0, 0, 0);
                     }).length :
                     stats.total}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    {activeTab === 'all' ? 'Total Appointments' :
                     activeTab === 'today' ? "Today's Appointments" :
                     activeTab === 'upcoming' ? 'Upcoming Appointments' :
                     'Past Appointments'}
                  </div>
                </div>
                <div className={`text-2xl p-3 rounded-lg ${
                  activeTab === 'today' ? 'bg-emerald-100 text-emerald-500' :
                  activeTab === 'upcoming' ? 'bg-blue-100 text-blue-500' :
                  activeTab === 'past' ? 'bg-amber-100 text-amber-500' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  📅
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-700">
                    {activeTab === 'today' ? stats.todayPending :
                     filteredAppointments.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Pending</div>
                </div>
                <div className="text-amber-500 text-2xl bg-amber-100 p-3 rounded-lg">⏳</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {activeTab === 'today' ? stats.todayConfirmed :
                     filteredAppointments.filter(a => a.status === 'confirmed').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Confirmed</div>
                </div>
                <div className="text-emerald-500 text-2xl bg-emerald-100 p-3 rounded-lg">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700">
                    {activeTab === 'today' ? stats.todayCancelled :
                     filteredAppointments.filter(a => a.status === 'cancelled').length}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">Cancelled</div>
                </div>
                <div className="text-red-500 text-2xl bg-red-100 p-3 rounded-lg">❌</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments by patient name, email, phone, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
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
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                >
                  ✕ Clear Filters
                </button>
              )}
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              
              {/* Clear Filters */}
              {(selectedStatus !== 'all' || selectedDoctor !== 'all' || selectedDate) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium">{filteredAppointments.length}</span> appointments
            {hasActiveFilters && (
              <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                Filtered
              </span>
            )}
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-emerald-500 hover:text-emerald-700"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
                  Status: {selectedStatus}
                  <button 
                    onClick={() => setSelectedStatus('all')}
                    className="text-amber-500 hover:text-amber-700"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedDoctor !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">
                  Doctor: {doctors.find(d => d._id === selectedDoctor)?.name || 'Selected'}
                  <button 
                    onClick={() => setSelectedDoctor('all')}
                    className="text-emerald-500 hover:text-emerald-700"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedDate && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200">
                  Date: {new Date(selectedDate).toLocaleDateString()}
                  <button 
                    onClick={() => setSelectedDate('')}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Tabs Section - Full Width */}
        <div className="mb-8 w-full">
          <div className="flex w-full p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const badgeCount = getTabBadgeCount(tab.id);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`relative flex-1 px-4 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-400 ease-out
                    ${isActive
                      ? 'bg-white text-slate-900 shadow-lg shadow-slate-300/50 transform scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                >
                  {/* Glow effect for active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl -z-10"></div>
                  )}
                  
                  {/* Icon with floating effect */}
                  <div className={`relative transition-transform duration-300
                    ${isActive ? 'translate-y-[-2px]' : ''}`}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-300
                      ${isActive 
                        ? 'text-emerald-600' 
                        : 'text-slate-500'
                      }`}
                    />
                  </div>
                  
                  {/* Label with bold effect */}
                  <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300
                    ${isActive ? 'text-slate-900 font-bold tracking-wide' : 'text-slate-700'}`}
                  >
                    {tab.label}
                  </span>
                  
                  {/* Floating badge */}
                  <div className={`transition-all duration-300
                    ${isActive 
                      ? 'translate-y-[-1px] scale-105' 
                      : ''
                    }`}
                  >
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  </div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-slate-200">
            <div className="grid grid-cols-13 gap-4 px-6 py-4 bg-slate-50">
              <div 
                className="col-span-3 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
                onClick={() => handleSort('patientName')}
              >
                Patient Info
                {sortConfig.key === 'patientName' && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
              <div 
                className="col-span-2 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
                onClick={() => handleSort('doctorName')}
              >
                Doctor Info
                {sortConfig.key === 'doctorName' && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
              <div 
                className="col-span-3 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
                onClick={() => handleSort('appointmentDate')}
              >
                Date, Time & Serial
                {sortConfig.key === 'appointmentDate' && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
              <div className="col-span-2 font-medium text-slate-700">Contact Details</div>
              <div 
                className="col-span-2 font-medium text-slate-700 cursor-pointer hover:text-slate-900 flex items-center gap-1"
                onClick={() => handleSort('status')}
              >
                Status
                {sortConfig.key === 'status' && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                )}
              </div>
              <div className="col-span-1 font-medium text-slate-700 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200/50">
            {currentAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-slate-400 text-6xl mb-4">
                  {activeTab === 'today' ? '📅' :
                   activeTab === 'upcoming' ? '🚀' :
                   activeTab === 'past' ? '⏰' : '📅'}
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {activeTab === 'today' ? "No appointments today" :
                   activeTab === 'upcoming' ? "No upcoming appointments" :
                   activeTab === 'past' ? "No past appointments" :
                   hasActiveFilters ? 'No appointments found' : 'No appointments available'}
                </h3>
                <p className="text-slate-500 mb-4">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filter criteria'
                    : activeTab === 'today' ? "No appointments scheduled for today" :
                      activeTab === 'upcoming' ? "All appointments are either past or today" :
                      activeTab === 'past' ? "No past appointments found" :
                      'No appointments have been booked yet'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              currentAppointments.map((appointment) => {
                const canChange = canChangeStatus(appointment.status);
                const canRescheduleAppointment = canReschedule(appointment.status, appointment.appointmentDate, appointment.appointmentTime);
                const timePassed = hasAppointmentTimePassed(appointment.appointmentDate, appointment.appointmentTime);
                
                return (
                  <div 
                    key={appointment._id} 
                    className={`px-6 py-4 transition-colors ${getRowColorClass(appointment.status)}`}
                  >
                    <div className="grid grid-cols-13 gap-4 items-center">
                      {/* Patient Info */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                            appointment.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{appointment.patient?.fullName || 'N/A'}</div>
                            <div className="text-sm text-slate-600">
                              {appointment.patient?.gender || 'N/A'} • 
                              {appointment.patient?.dateOfBirth 
                                ? ` ${new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years`
                                : ' N/A years'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-600 line-clamp-2">
                          Reason: {appointment.patient?.reason || 'N/A'}
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="col-span-2">
                        <div className="font-medium text-slate-900">Dr. {appointment.doctorInfo?.name || 'N/A'}</div>
                        <div className="text-sm text-slate-600">{appointment.doctorInfo?.speciality || 'N/A'}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {appointment.doctorInfo?.location || 'N/A'}
                        </div>
                      </div>

                      {/* Date & Time with Serial Number */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Calendar className={`w-4 h-4 ${
                            appointment.status === 'confirmed' ? 'text-emerald-500' :
                            appointment.status === 'pending' ? 'text-amber-500' :
                            appointment.status === 'cancelled' ? 'text-red-500' :
                            'text-slate-500'
                          }`} />
                          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
                          {timePassed && (
                            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-800 font-medium">
                              Time Expired
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mt-1">
                          <Clock className={`w-4 h-4 ${
                            appointment.status === 'confirmed' ? 'text-emerald-500' :
                            appointment.status === 'pending' ? 'text-amber-500' :
                            appointment.status === 'cancelled' ? 'text-red-500' :
                            'text-slate-500'
                          }`} />
                          <span>{appointment.appointmentTime || 'N/A'} - {appointment.endTime || 'N/A'}</span>
                        </div>
                        
                        {/* Serial Number Display */}
                        <div className="mt-2">
                          <div className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1 w-fit">
                            <Hash className="w-3 h-3" />
                            Sl No-{appointment.slotSerialNumber || 0}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Duration: {appointment.doctorInfo?.perPatientTime || 15} min
                          </div>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <Mail className="w-3 h-3" />
                          {appointment.patient?.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          {appointment.patient?.phone || 'N/A'}
                        </div>
                        {appointment.patient?.address && (
                          <div className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {appointment.patient.address}
                          </div>
                        )}
                      </div>

                      {/* Status with Clickable Badge */}
                      <div className="col-span-2">
                        {getStatusBadge(appointment.status, appointment._id, canChange)}
                        <div className="mt-2 text-xs text-slate-500">
                          Created: {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        {!canChange && (
                          <div className="mt-1 text-xs text-red-600 italic">
                            Cancelled appointments cannot be changed
                          </div>
                        )}
                      </div>

                      {/* Actions - Staff can reschedule */}
                      <div className="col-span-1">
                        <div className="flex justify-center">
                          <button
                            onClick={() => canRescheduleAppointment && handleReschedule(appointment._id)}
                            className={`p-1.5 rounded-lg transition ${
                              canRescheduleAppointment
                                ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={
                              canRescheduleAppointment
                                ? "Reschedule Appointment"
                                : appointment.status === 'cancelled'
                                ? "Cancelled appointments cannot be rescheduled"
                                : timePassed
                                ? "Appointment time has expired. Cannot reschedule"
                                : "Cannot reschedule"
                            }
                            disabled={!canRescheduleAppointment}
                          >
                            <CalendarDays className="w-4 h-4" />
                          </button>
                        </div>
                        {!canRescheduleAppointment && (
                          <div className="mt-1 text-xs text-red-600 text-center">
                            {appointment.status === 'cancelled' 
                              ? 'Cancelled'
                              : timePassed
                              ? 'Time Expired'
                              : 'N/A'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {filteredAppointments.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAppointments.length)} of {filteredAppointments.length} appointments
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
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
                          className={`w-8 h-8 rounded-lg text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Appointment Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-600">Today's Appointments</div>
              <div className="font-semibold text-slate-900">
                {appointments.filter(a => {
                  if (!a.appointmentDate) return false;
                  const today = new Date();
                  const appDate = new Date(a.appointmentDate);
                  return appDate.toDateString() === today.toDateString();
                }).length}
              </div>
            </div>
            <div>
              <div className="text-slate-600">Upcoming (Next 7 days)</div>
              <div className="font-semibold text-slate-900">
                {appointments.filter(a => {
                  if (!a.appointmentDate) return false;
                  const today = new Date();
                  const appDate = new Date(a.appointmentDate);
                  const nextWeek = new Date(today);
                  nextWeek.setDate(today.getDate() + 7);
                  return appDate > today && appDate <= nextWeek;
                }).length}
              </div>
            </div>
            <div>
              <div className="text-slate-600">Most Popular Doctor</div>
              <div className="font-semibold text-slate-900">
                {(() => {
                  const doctorCounts = {};
                  appointments.forEach(app => {
                    if (!app.doctorInfo?.name) return;
                    const doctorName = app.doctorInfo.name;
                    doctorCounts[doctorName] = (doctorCounts[doctorName] || 0) + 1;
                  });
                  const mostPopular = Object.entries(doctorCounts).sort((a, b) => b[1] - a[1])[0];
                  return mostPopular ? `${mostPopular[0]} (${mostPopular[1]})` : 'N/A';
                })()}
              </div>
            </div>
            <div>
              <div className="text-slate-600">Avg. Response Time</div>
              <div className="font-semibold text-slate-900">
                {(() => {
                  const pendingApps = appointments.filter(a => a.status === 'pending');
                  if (pendingApps.length === 0) return '0h';
                  
                  const now = new Date();
                  const totalHours = pendingApps.reduce((sum, app) => {
                    const created = app.createdAt ? new Date(app.createdAt) : now;
                    return sum + (now - created) / (1000 * 60 * 60);
                  }, 0);
                  
                  return `${Math.round(totalHours / pendingApps.length)}h`;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAppointments;