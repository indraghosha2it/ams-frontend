// "use client";

// import { useSearchParams, useRouter } from 'next/navigation';
// import { useState, useEffect, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { toast, Toaster } from 'react-hot-toast';
// import { 
//   ArrowLeft, 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   User, 
//   Mail, 
//   Phone, 
//   Stethoscope,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   RefreshCw,
//   Building,
//   FileText,
//   ChevronDown,
//   ChevronUp,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   ChevronsUpDown,
//   X
// } from 'lucide-react';
// import Link from 'next/link';

// const BookAppointmentPage = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const doctorId = searchParams.get('doctorId');
//   const slotId = searchParams.get('slotId');
  
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
  
//   // Client/Patient data states
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const [searchClientEmail, setSearchClientEmail] = useState('');
//   const [loadingClients, setLoadingClients] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
  
//   const [patientData, setPatientData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     address: '',
//     reason: ''
//   });

//   const dropdownRef = useRef(null);

//   // Helper function to format date as YYYY-MM-DD in local timezone
//   const formatDateToLocalString = (date) => {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // Fetch doctor data
//   useEffect(() => {
//     if (doctorId) {
//       fetchDoctorDetails();
//       fetchAvailableSlots();
//       fetchClients();
//     } else {
//       toast.error('No doctor selected');
//       router.push('/admin/doctors');
//     }
//   }, [doctorId]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowClientDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const fetchDoctorDetails = async () => {
//     try {
//       setLoading(true);
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`, {
//         headers: token ? { 'Authorization': `Bearer ${token}` } : {}
//       });
      
//       if (response.data.success) {
//         setDoctor(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching doctor:', error);
//       toast.error('Failed to load doctor details');
//       router.push('/admin/doctors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableSlots = async () => {
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//       const token = localStorage.getItem('token');
      
//       console.log('🔍 Fetching available slots for doctor:', doctorId);
      
//       const response = await axios.get(
//         `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`,
//         {
//           headers: token ? { 'Authorization': `Bearer ${token}` } : {},
//           timeout: 10000
//         }
//       );
      
//       if (response.data.success) {
//         const slots = response.data.data || [];
//         console.log(`✅ Loaded ${slots.length} available slots`);
        
//         setAvailableSlots(slots);
        
//         // If slotId is provided in URL, pre-select it
//         if (slotId && slots.length > 0) {
//           const preSelectedSlot = slots.find(slot => slot._id === slotId);
//           if (preSelectedSlot) {
//             handleDateSelect(preSelectedSlot.date);
//             setSelectedTime(preSelectedSlot);
//             console.log('✅ Pre-selected slot:', preSelectedSlot);
//           }
//         }
//       } else {
//         toast.error(response.data.message || 'Failed to load available slots');
//         setAvailableSlots([]);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching slots:', error);
      
//       if (error.response?.status === 404) {
//         console.log('⚠️ Endpoint not found, using fallback mock data');
//         generateMockSlots();
//       } else {
//         toast.error('Failed to load available slots');
//         setAvailableSlots([]);
//       }
//     }
//   };

//   // Fetch clients from backend
//   const fetchClients = async () => {
//     try {
//       setLoadingClients(true);
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//       const token = localStorage.getItem('token');
      
//       const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
//         headers: token ? { 'Authorization': `Bearer ${token}` } : {}
//       });
      
//       if (response.data.success) {
//         // Filter only client users and sort by name
//         const clientUsers = response.data.users
//           .filter(user => user.role === 'client')
//           .sort((a, b) => a.name.localeCompare(b.name));
        
//         console.log(`✅ Loaded ${clientUsers.length} clients`);
//         setClients(clientUsers);
//         setFilteredClients(clientUsers);
//       } else {
//         toast.error('Failed to load client list');
//         setClients([]);
//         setFilteredClients([]);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching clients:', error);
      
//       // Fallback to mock data for development
//       if (error.response?.status === 404 || !process.env.NEXT_PUBLIC_BACKEND_URL) {
//         console.log('⚠️ Using mock client data for development');
//         const mockClients = [
//           {
//             _id: '1',
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             phone: '+1 (555) 123-4567',
//             role: 'client',
//             isActive: true,
//             createdAt: '2024-01-15T10:30:00Z'
//           },
//           {
//             _id: '2',
//             name: 'Jane Smith',
//             email: 'jane.smith@example.com',
//             phone: '+1 (555) 987-6543',
//             role: 'client',
//             isActive: true,
//             createdAt: '2024-01-10T09:15:00Z'
//           },
//           {
//             _id: '3',
//             name: 'Robert Johnson',
//             email: 'robert.j@example.com',
//             phone: '+1 (555) 456-7890',
//             role: 'client',
//             isActive: true,
//             createdAt: '2024-01-20T14:45:00Z'
//           },
//           {
//             _id: '4',
//             name: 'Maria Garcia',
//             email: 'maria.g@example.com',
//             phone: '+1 (555) 234-5678',
//             role: 'client',
//             isActive: true,
//             createdAt: '2024-01-18T11:20:00Z'
//           },
//           {
//             _id: '5',
//             name: 'David Wilson',
//             email: 'david.w@example.com',
//             phone: '+1 (555) 876-5432',
//             role: 'client',
//             isActive: true,
//             createdAt: '2024-01-22T16:30:00Z'
//           }
//         ];
//         setClients(mockClients);
//         setFilteredClients(mockClients);
//       } else {
//         toast.error('Failed to load client list');
//         setClients([]);
//         setFilteredClients([]);
//       }
//     } finally {
//       setLoadingClients(false);
//     }
//   };

//   // Filter clients based on search
//   useEffect(() => {
//     if (!searchClientEmail.trim()) {
//       setFilteredClients(clients);
//     } else {
//       const searchTerm = searchClientEmail.toLowerCase();
//       const filtered = clients.filter(client =>
//         client.email.toLowerCase().includes(searchTerm) ||
//         client.name.toLowerCase().includes(searchTerm)
//       );
//       setFilteredClients(filtered);
//     }
//   }, [searchClientEmail, clients]);

//   // Handle client selection from dropdown
//   const handleClientSelect = (client) => {
//     setSelectedClient(client);
//     setPatientData({
//       fullName: client.name,
//       email: client.email,
//       phone: client.phone || '',
//       dateOfBirth: patientData.dateOfBirth, // Keep existing DOB
//       gender: patientData.gender, // Keep existing gender
//       address: patientData.address, // Keep existing address
//       reason: patientData.reason // Keep existing reason
//     });
//     setShowClientDropdown(false);
//     setSearchClientEmail('');
//     toast.success(`Selected client: ${client.name}`);
//   };

//   // Clear selected client
//   const handleClearClient = () => {
//     setSelectedClient(null);
//     setPatientData({
//       fullName: '',
//       email: '',
//       phone: '',
//       dateOfBirth: patientData.dateOfBirth,
//       gender: patientData.gender,
//       address: patientData.address,
//       reason: patientData.reason
//     });
//     toast.info('Cleared client selection');
//   };

//   // Helper function to generate mock slots for development
//   const generateMockSlots = () => {
//     if (!doctor) return;
    
//     console.log('🔄 Generating mock slots for development');
    
//     const mockSlots = [];
//     const today = new Date();
    
//     // Generate slots for next 30 days
//     for (let i = 1; i <= 30; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
      
//       // Skip weekends for demo
//       const dayOfWeek = date.getDay();
//       if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
//       const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
//       timeSlots.forEach(time => {
//         const slotId = `mock-${date.toISOString().split('T')[0]}-${time}`;
//         const endTime = addMinutes(time, doctor.perPatientTime || 15);
//         const dateString = formatDateToLocalString(date);
        
//         mockSlots.push({
//           _id: slotId,
//           date: dateString,
//           startTime: time,
//           endTime: endTime,
//           duration: doctor.perPatientTime || 15,
//           day: date.toLocaleDateString('en-US', { weekday: 'long' }),
//           isBooked: false,
//           status: 'available',
//           formattedDate: date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//           }),
//           formattedTime: `${time} - ${endTime}`
//         });
//       });
//     }
    
//     console.log(`✅ Generated ${mockSlots.length} mock slots`);
//     setAvailableSlots(mockSlots);
//   };

//   // Helper function to add minutes to time string
//   const addMinutes = (time, minutes) => {
//     const [hours, mins] = time.split(':').map(Number);
//     const date = new Date();
//     date.setHours(hours, mins + minutes, 0, 0);
//     return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
//   };

//   // Group slots by date
//   const slotsByDate = useMemo(() => {
//     const grouped = {};
//     availableSlots.forEach(slot => {
//       if (!grouped[slot.date]) {
//         grouped[slot.date] = [];
//       }
//       grouped[slot.date].push(slot);
//     });
//     return grouped;
//   }, [availableSlots]);

//   // Get available dates
//   const availableDates = useMemo(() => {
//     return Object.keys(slotsByDate).sort();
//   }, [slotsByDate]);

//   // Get slots for selected date
//   const slotsForSelectedDate = useMemo(() => {
//     if (!selectedDate) return [];
//     return slotsByDate[selectedDate] || [];
//   }, [selectedDate, slotsByDate]);

//   // Generate calendar days for current month
//   const calendarDays = useMemo(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
    
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
    
//     const days = [];
//     const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
//     // Get today's date in local format for comparison
//     const today = new Date();
//     const todayLocal = formatDateToLocalString(today);
    
//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startDay; i++) {
//       days.push(null);
//     }
    
//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateString = formatDateToLocalString(date);
//       const isToday = dateString === todayLocal;
//       const isSelected = dateString === selectedDate;
//       const hasSlots = availableDates.includes(dateString);
//       const todayMidnight = new Date();
//       todayMidnight.setHours(0, 0, 0, 0);
//       const isPast = date < todayMidnight;
      
//       days.push({
//         date,
//         dateString,
//         day,
//         isToday,
//         isSelected,
//         hasSlots,
//         isPast,
//         isWeekend: date.getDay() === 0 || date.getDay() === 6
//       });
//     }
    
//     return days;
//   }, [currentMonth, selectedDate, availableDates]);

//   // Handle date selection
//   const handleDateSelect = (dateInput) => {
//     // Accept either Date object or string
//     const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
//     const localDateString = formatDateToLocalString(dateObj);
//     setSelectedDate(localDateString);
//     setSelectedTime(null);
//     // Don't hide date picker - let user see their selection
//     setShowTimePicker(true);
//   };

//   // Handle time selection
//   const handleTimeSelect = (slot) => {
//     setSelectedTime(slot);
//     // Don't hide time picker automatically
//   };

//   // Get date status color
//   const getDateColor = (date) => {
//     if (!date) return '';
//     if (date.isPast) return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     if (!date.hasSlots) return 'bg-red-50 text-red-400 border-red-200';
//     if (date.isSelected) return 'bg-emerald-500 text-white border-emerald-600';
//     if (date.isToday) return 'bg-blue-50 text-blue-600 border-blue-200';
//     if (date.hasSlots) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
//     return 'bg-white text-slate-700 border-slate-200';
//   };

//   // Format selected slot for display
//   const formatSelectedSlot = () => {
//     if (!selectedDate || !selectedTime) return null;
    
//     // Parse the selected date properly
//     const [year, month, day] = selectedDate.split('-');
//     const date = new Date(year, month - 1, day);
    
//     return {
//       formattedDate: date.toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       }),
//       formattedTime: `${selectedTime.startTime} - ${selectedTime.endTime}`,
//       duration: selectedTime.duration || doctor?.perPatientTime || 15
//     };
//   };

//   const selectedSlotInfo = formatSelectedSlot();

//   // Navigation for calendar
//   const prevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
//   };

//   const nextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // If email is changed manually, clear the selected client
//     if (name === 'email' && selectedClient && selectedClient.email !== value) {
//       setSelectedClient(null);
//     }
    
//     setPatientData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
// const validateForm = () => {
//   if (!selectedDate || !selectedTime) {
//     toast.error('Please select a date and time slot');
//     return false;
//   }

//   if (!patientData.fullName.trim()) {
//     toast.error('Full name is required');
//     return false;
//   }

//   if (!patientData.email.trim()) {
//     toast.error('Email is required');
//     return false;
//   }

//   // Basic email validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(patientData.email)) {
//     toast.error('Please enter a valid email address');
//     return false;
//   }

//   if (!patientData.phone.trim()) {
//     toast.error('Phone number is required');
//     return false;
//   }

//   // Basic phone validation
//   const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
//   const phoneDigits = patientData.phone.replace(/\D/g, '');
//   if (!phoneRegex.test(phoneDigits)) {
//     toast.error('Please enter a valid phone number (10-15 digits)');
//     return false;
//   }

//   if (!patientData.dateOfBirth) {
//     toast.error('Date of birth is required');
//     return false;
//   }

//   // Check if patient is at least 1 day old (changed from 1 year)
//   const birthDate = new Date(patientData.dateOfBirth);
//   const today = new Date();
  
//   // Set both dates to midnight for accurate day comparison
//   const birthMidnight = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
//   const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
//   // Calculate difference in days
//   const timeDiff = todayMidnight.getTime() - birthMidnight.getTime();
//   const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
//   if (daysDiff < 1) {
//     toast.error('Date of birth cannot be in the future or today');
//     return false;
//   }

//   // Optional: Add maximum age limit if needed (e.g., 150 years)
//   const maxAgeYears = 150;
//   const maxAgeDays = maxAgeYears * 365;
//   if (daysDiff > maxAgeDays) {
//     toast.error(`Patient age seems unrealistic. Maximum allowed age is ${maxAgeYears} years.`);
//     return false;
//   }

//   if (!patientData.gender) {
//     toast.error('Please select gender');
//     return false;
//   }

//   if (!patientData.reason.trim()) {
//     toast.error('Please specify the reason for appointment');
//     return false;
//   }

//   return true;
// };
// const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setSubmitting(true);
    
//     try {
//         const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//         const token = localStorage.getItem('token');
        
//         const appointmentData = {
//             doctorId,
//             slotId: selectedTime._id,
//             patient: patientData,
//             appointmentDate: selectedDate,
//             appointmentTime: selectedTime.startTime,
//             status: 'confirmed'
//         };
        
//         console.log('📤 Booking appointment with data:', appointmentData);
//         console.log('🎯 Calling endpoint:', `${BACKEND_URL}/api/appointments`);
//         console.log('🔑 Token exists:', !!token);
        
//         // REMOVE THIS TEST CODE - it's interfering with your real booking
//         /*
//         // Test code - REMOVE THIS
//         const testResponse = await axios.post(
//             `${BACKEND_URL}/api/appointments-test`,
//             {},
//             {
//                 headers: token ? { 'Authorization': `Bearer ${token}` } : {}
//             }
//         );
        
//         console.log('🧪 Test result:', testResponse.data);
//         */
        
//         // For development with mock slots
//         if (selectedTime._id.startsWith('mock-')) {
//             console.log('🎭 Using mock mode - skipping real API call');
//             toast.success('Appointment booked successfully! (Demo Mode)');
//             setTimeout(() => {
//                 router.push('/admin/doctors');
//             }, 1500);
//             return;
//         }
        
//         // REAL API CALL - Make sure you're using the right variable name
//         const response = await axios.post(  // <-- This must be named "response"
//             `${BACKEND_URL}/api/appointments`,
//             appointmentData,
//             {
//                 headers: token ? { 'Authorization': `Bearer ${token}` } : {},
//                 timeout: 10000
//             }
//         );
        
//         console.log('✅ Appointment response:', response.data);
        
//         if (response.data.success) {  // <-- Using "response" here
//             toast.success('Appointment booked and confirmed successfully!');
            
//             // Redirect back to doctors
//             setTimeout(() => {
//                 router.push('/admin/doctors');
//             }, 1500);
//         }
//     } catch (error) {
//         console.error('Error booking appointment:', error);
        
//         if (error.response) {
//             const status = error.response.status;
            
//             if (status === 400) {
//                 toast.error(error.response.data.message || 'Invalid appointment data');
//             } else if (status === 409) {
//                 toast.error('This time slot is no longer available. Please select another slot.');
//                 fetchAvailableSlots(); // Refresh slots
//             } else if (status === 401) {
//                 toast.error('Please login to book an appointment');
//                 router.push('/login');
//             } else if (status === 403) {
//                 toast.error('You do not have permission to book appointments');
//             } else if (status === 404) {
//                 toast.error('Doctor or time slot not found');
//             } else {
//                 toast.error('Failed to book appointment. Please try again.');
//                 console.error('Server error:', error.response.data);
//             }
//         } else if (error.request) {
//             toast.error('Network error. Please check your connection.');
//             console.error('Network error:', error.request);
//         } else {
//             toast.error('An unexpected error occurred.');
//             console.error('Error:', error.message);
//         }
//     } finally {
//         setSubmitting(false);
//     }
// };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         <Toaster position="top-right" />
//         <div className="max-w-6xl mx-auto">
//           <div className="flex justify-center items-center h-96">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <h3 className="text-xl font-semibold text-slate-800">Loading Doctor Information</h3>
//               <p className="text-slate-600 mt-2">Preparing your appointment booking...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!doctor) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
//         <Toaster position="top-right" />
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center py-16">
//             <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
//             <p className="text-slate-600 mb-6">The doctor you're looking for might not be available.</p>
//             <Link
//               href="/admin/doctors"
//               className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Doctors
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
//       <Toaster position="top-right" />
      
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <Link
//                 href="/admin/doctors"
//                 className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-slate-700" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Book Appointment</h1>
//                 <p className="text-slate-600 mt-1">Schedule your consultation with Dr. {doctor.name}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
//               Doctor ID: {doctorId?.substring(0, 8)}...
//             </div>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {/* Doctor Information Card */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
//             <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6">
//               Doctor Information
//             </h2>
            
//             <div className="flex flex-col md:flex-row items-start gap-6">
//               {/* Doctor Image */}
//               <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
//                 {doctor.image?.url ? (
//                   <img 
//                     src={doctor.image.url} 
//                     alt={doctor.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
//                     <Stethoscope className="w-12 h-12 text-emerald-600" />
//                   </div>
//                 )}
//               </div>
              
//               {/* Doctor Details */}
//               <div className="flex-1">
//                 <div className="mb-4">
//                   <h3 className="text-2xl font-bold text-slate-900">{doctor.name}</h3>
//                   <p className="text-emerald-600 font-medium">{doctor.designation || "Medical Specialist"}</p>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div className="flex items-center text-slate-700">
//                     <Stethoscope className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
//                     <span className="text-sm">{doctor.speciality || "General Medicine"}</span>
//                   </div>
                  
//                   <div className="flex items-center text-slate-700">
//                     <Clock className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
//                     <span className="text-sm">{doctor.perPatientTime || 15} minutes per patient</span>
//                   </div>
                  
//                   <div className="flex items-center text-slate-700">
//                     <MapPin className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
//                     <span className="text-sm">{doctor.location || "Hospital Location"}</span>
//                   </div>
                  
//                   <div className="flex items-center text-slate-700">
//                     <Mail className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
//                     <span className="text-sm">{doctor.email || "No email provided"}</span>
//                   </div>
//                 </div>
                
//                 {doctor.description && (
//                   <div className="pt-4 border-t border-slate-200">
//                     <p className="text-sm text-slate-600">{doctor.description}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Date & Time Selection Card */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
//             <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6">
//               Schedule Appointment
//             </h2>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Date Selection */}
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
//                   <span>Select Date</span>
//                   <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
//                     {availableDates.length} available days
//                   </span>
//                 </h3>
              
//                 {/* Date Picker Toggle */}
//                 <div className="mb-4">
//                   <button
//                     onClick={() => setShowDatePicker(!showDatePicker)}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg text-left flex items-center justify-between hover:bg-slate-50 transition"
//                   >
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-emerald-500" />
//                       <span className={selectedDate ? "text-slate-800" : "text-slate-500"}>
//                         {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         }) : 'Select a date'}
//                       </span>
//                     </div>
//                     {showDatePicker ? (
//                       <ChevronUp className="w-4 h-4 text-slate-400" />
//                     ) : (
//                       <ChevronDown className="w-4 h-4 text-slate-400" />
//                     )}
//                   </button>
//                 </div>
                
//                 {/* Calendar Picker */}
//                 {showDatePicker && (
//                   <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm mb-4">
//                     {/* Calendar Header */}
//                     <div className="flex items-center justify-between mb-4">
//                       <button
//                         onClick={prevMonth}
//                         className="p-1 hover:bg-slate-100 rounded"
//                       >
//                         <ChevronLeft className="w-5 h-5 text-slate-600" />
//                       </button>
//                       <h4 className="font-semibold text-slate-800">
//                         {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                       </h4>
//                       <button
//                         onClick={nextMonth}
//                         className="p-1 hover:bg-slate-100 rounded"
//                       >
//                         <ChevronRight className="w-5 h-5 text-slate-600" />
//                       </button>
//                     </div>
                    
//                     {/* Calendar Grid */}
//                     <div className="grid grid-cols-7 gap-1 mb-2">
//                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                         <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
//                           {day}
//                         </div>
//                       ))}
//                     </div>
                    
//                     <div className="grid grid-cols-7 gap-1">
//                       {calendarDays.map((day, index) => (
//                         <div key={index} className="min-h-10">
//                           {day ? (
//                             <button
//                               onClick={() => !day.isPast && day.hasSlots && handleDateSelect(day.date)}
//                               disabled={day.isPast || !day.hasSlots}
//                               className={`w-full h-10 rounded-md border transition-all flex items-center justify-center text-sm font-medium
//                                 ${getDateColor(day)}
//                                 ${day.isWeekend ? 'opacity-75' : ''}
//                                 ${(day.isPast || !day.hasSlots) ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
//                               title={day.isPast ? "Past date" : !day.hasSlots ? "No available slots" : `Available slots: ${slotsByDate[day.dateString]?.length || 0}`}
//                             >
//                               {day.day}
//                               {day.isToday && !day.isSelected && (
//                                 <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
//                               )}
//                             </button>
//                           ) : null}
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Calendar Legend */}
//                     <div className="mt-4 pt-4 border-t border-slate-200">
//                       <div className="grid grid-cols-2 gap-2 text-xs">
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded bg-emerald-500"></div>
//                           <span className="text-slate-600">Selected</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></div>
//                           <span className="text-slate-600">Available</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
//                           <span className="text-slate-600">No slots</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded bg-gray-100"></div>
//                           <span className="text-slate-600">Past/Unavailable</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Done Button */}
//                     <div className="mt-4 flex justify-end">
//                       <button
//                         onClick={() => setShowDatePicker(false)}
//                         className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
//                       >
//                         Done
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Refresh Button */}
//                 <div className="mt-4">
//                   <button
//                     onClick={fetchAvailableSlots}
//                     className="w-full px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2"
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     Refresh Available Slots
//                   </button>
                  
//                   {availableSlots.length === 0 && (
//                     <button
//                       onClick={generateMockSlots}
//                       className="mt-2 w-full px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium"
//                     >
//                       Use Demo Slots (Development)
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Time Selection */}
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
//                   <span>Select Time</span>
//                   {selectedDate && (
//                     <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
//                       {slotsForSelectedDate.length} slots available
//                     </span>
//                   )}
//                 </h3>
                
//                 {/* Time Picker Toggle */}
//                 <div className="mb-4">
//                   <button
//                     onClick={() => setShowTimePicker(!showTimePicker)}
//                     disabled={!selectedDate}
//                     className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition
//                       ${!selectedDate 
//                         ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' 
//                         : 'border-slate-300 hover:bg-slate-50 text-slate-800'
//                       }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-emerald-500" />
//                       <span className={selectedTime ? "text-slate-800" : "text-slate-500"}>
//                         {selectedTime ? selectedTime.formattedTime : 'Select a time slot'}
//                       </span>
//                     </div>
//                     {showTimePicker ? (
//                       <ChevronUp className="w-4 h-4 text-slate-400" />
//                     ) : (
//                       <ChevronDown className="w-4 h-4 text-slate-400" />
//                     )}
//                   </button>
//                 </div>
                
//                 {/* Time Slots Picker */}
//                 {showTimePicker && selectedDate && (
//                   <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm mb-4">
//                     {/* Date Header */}
//                     <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4 text-blue-600" />
//                         <span className="font-medium text-blue-800">
//                           {new Date(selectedDate).toLocaleDateString('en-US', {
//                             weekday: 'long',
//                             year: 'numeric',
//                             month: 'long',
//                             day: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Time Slots */}
//                     {slotsForSelectedDate.length > 0 ? (
//                       <div className="space-y-2">
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
//                           {slotsForSelectedDate.map((slot) => (
//                             <button
//                               key={slot._id}
//                               onClick={() => handleTimeSelect(slot)}
//                               className={`p-3 border rounded-lg text-left transition-all
//                                 ${selectedTime?._id === slot._id 
//                                   ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
//                                   : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-emerald-300'
//                                 }`}
//                             >
//                               <div className="font-medium">{slot.startTime}</div>
//                               <div className="text-xs mt-1">
//                                 {selectedTime?._id === slot._id 
//                                   ? '✓ Selected' 
//                                   : `${slot.duration || doctor?.perPatientTime || 15} min`
//                                 }
//                               </div>
//                             </button>
//                           ))}
//                         </div>
                        
//                         {/* Done Button */}
//                         <div className="flex justify-end">
//                           <button
//                             onClick={() => setShowTimePicker(false)}
//                             className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
//                           >
//                             Done
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="p-4 text-center border border-slate-200 rounded-lg bg-slate-50">
//                         <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
//                         <p className="text-slate-700">No time slots available for this date</p>
//                         <p className="text-sm text-slate-500 mt-1">Please select another date</p>
//                         <button
//                           onClick={() => setShowTimePicker(false)}
//                           className="mt-3 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium text-sm"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 {/* Time Slots Not Available Message */}
//                 {!selectedDate && (
//                   <div className="p-4 text-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
//                     <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
//                     <p className="text-slate-700">Select a date first</p>
//                     <p className="text-sm text-slate-500 mt-1">Please select a date to view available time slots</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Selected Appointment & Important Notes */}
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             {/* Selected Appointment */}
//             {selectedSlotInfo && (
//               <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
//                 <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5" />
//                   Selected Appointment
//                 </h4>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4 text-emerald-600" />
//                     <span className="text-sm font-medium text-emerald-700">
//                       {selectedSlotInfo.formattedDate}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-emerald-600" />
//                     <span className="text-sm font-medium text-emerald-700">
//                       {selectedSlotInfo.formattedTime}
//                     </span>
//                   </div>
//                   <div className="text-xs text-slate-600 mt-1">
//                     Duration: {selectedSlotInfo.duration} minutes
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSelectedDate(null);
//                     setSelectedTime(null);
//                     setShowDatePicker(true);
//                     setShowTimePicker(false);
//                   }}
//                   className="mt-3 w-full px-3 py-1.5 text-sm border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-100 transition font-medium"
//                 >
//                   Change Selection
//                 </button>
//               </div>
//             )}

//             {/* Important Notes */}
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
//               <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5" />
//                 Important Notes
//               </h4>
//               <ul className="text-sm text-amber-700 space-y-1.5">
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                   <span>Please arrive 15 minutes before your appointment</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt=1.5 flex-shrink-0"></div>
//                   <span>Bring your ID and insurance card (if applicable)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt=1.5 flex-shrink-0"></div>
//                   <span>Cancellation must be made 24 hours in advance</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt=1.5 flex-shrink-0"></div>
//                   <span>Emergency? Call emergency services immediately</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Patient Information Form */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 Patient Information
//               </h2>
//               {selectedClient && (
//                 <div className="flex items-center gap-2">
//                   <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center">
//                     <User className="w-3 h-3 mr-1" />
//                     Selected: {selectedClient.name}
//                   </div>
//                   <button
//                     onClick={handleClearClient}
//                     className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
//                     title="Clear selected client"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
            
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center gap-2 mb-2">
//                 <Search className="w-4 h-4 text-blue-600" />
//                 <span className="font-medium text-blue-800">Quick Client Lookup</span>
//               </div>
//               <p className="text-sm text-slate-600">
//                 Search and select an existing client to auto-fill their information. 
//                 {clients.length === 0 && ' No clients found in database.'}
//               </p>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={patientData.fullName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                       placeholder="John Doe"
//                     />
//                   </div>
//                 </div>

//                 {/* Email with Dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={patientData.email}
//                       onChange={handleInputChange}
//                       onFocus={() => setShowClientDropdown(true)}
//                       required
//                       className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                       placeholder="john@example.com"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowClientDropdown(!showClientDropdown)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
//                     >
//                       <ChevronsUpDown className="w-4 h-4" />
//                     </button>
//                   </div>
                  
//                   {/* Client Dropdown */}
//                   {showClientDropdown && (
//                     <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
//                       {/* Search Input in Dropdown */}
//                       <div className="p-2 border-b border-slate-200">
//                         <div className="relative">
//                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                           <input
//                             type="text"
//                             value={searchClientEmail}
//                             onChange={(e) => setSearchClientEmail(e.target.value)}
//                             placeholder="Search by email or name..."
//                             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
//                             autoFocus
//                           />
//                         </div>
//                       </div>
                      
//                       {/* Loading State */}
//                       {loadingClients ? (
//                         <div className="p-4 text-center">
//                           <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
//                           <p className="mt-2 text-sm text-slate-500">Loading clients...</p>
//                         </div>
//                       ) : (
//                         <>
//                           {/* Client List */}
//                           <div className="max-h-48 overflow-y-auto">
//                             {filteredClients.length === 0 ? (
//                               <div className="p-4 text-center text-sm text-slate-500">
//                                 {searchClientEmail ? 'No matching clients found' : 'No clients available'}
//                               </div>
//                             ) : (
//                               filteredClients.map((client) => (
//                                 <button
//                                   key={client._id}
//                                   type="button"
//                                   onClick={() => handleClientSelect(client)}
//                                   className={`w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0
//                                     ${selectedClient?._id === client._id ? 'bg-emerald-50' : ''}`}
//                                 >
//                                   <div className="flex items-center">
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
//                                       ${selectedClient?._id === client._id 
//                                         ? 'bg-emerald-100 text-emerald-700' 
//                                         : 'bg-slate-100 text-slate-700'
//                                       }`}
//                                     >
//                                       {client.name.charAt(0)}
//                                     </div>
//                                     <div>
//                                       <div className="font-medium text-slate-800">{client.name}</div>
//                                       <div className="text-sm text-slate-500">{client.email}</div>
//                                       {client.phone && (
//                                         <div className="text-xs text-slate-400 mt-1">{client.phone}</div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </button>
//                               ))
//                             )}
//                           </div>
                          
//                           {/* Refresh Button */}
//                           <div className="p-2 border-t border-slate-200">
//                             <button
//                               type="button"
//                               onClick={fetchClients}
//                               className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 hover:bg-emerald-50 rounded flex items-center justify-center"
//                             >
//                               <RefreshCw className="w-3 h-3 mr-2" />
//                               Refresh Client List
//                             </button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={patientData.phone}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                       placeholder="+1 (555) 123-4567"
//                     />
//                   </div>
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Date of Birth *
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={patientData.dateOfBirth}
//                     onChange={handleInputChange}
//                     required
//                     max={new Date().toISOString().split('T')[0]}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                   />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Gender *
//                   </label>
//                   <select
//                     name="gender"
//                     value={patientData.gender}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                     <option value="prefer-not-to-say">Prefer not to say</option>
//                   </select>
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={patientData.address}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                     placeholder="Street Address, City, State, ZIP Code"
//                   />
//                 </div>

//                 {/* Reason for Appointment */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Reason for Appointment *
//                   </label>
//                   <div className="relative">
//                     <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
//                     <textarea
//                       name="reason"
//                       value={patientData.reason}
//                       onChange={handleInputChange}
//                       required
//                       rows="4"
//                       className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                       placeholder="Please describe your symptoms or reason for consultation..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
//                 <Link
//                   href="/admin/doctors"
//                   className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center gap-2"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Cancel
//                 </Link>
//                 <button
//                   type="submit"
//                   disabled={submitting || !selectedDate || !selectedTime}
//                   className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
//                 >
//                   {submitting ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       <span>Booking...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Calendar className="w-5 h-5" />
//                       <span>Book Appointment</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentPage;


"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronsUpDown,
  X,
  Hash
} from 'lucide-react';
import Link from 'next/link';

const BookAppointmentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const slotId = searchParams.get('slotId');
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Client/Patient data states
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [searchClientEmail, setSearchClientEmail] = useState('');
  const [loadingClients, setLoadingClients] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [patientData, setPatientData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    reason: ''
  });

  const dropdownRef = useRef(null);

  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatDateToLocalString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to convert time to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Fetch doctor data
  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails();
      fetchAvailableSlots();
      fetchClients();
    } else {
      toast.error('No doctor selected');
      router.push('/admin/doctors');
    }
  }, [doctorId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor details');
      router.push('/admin/doctors');
    } finally {
      setLoading(false);
    }
  };

  // const fetchAvailableSlots = async () => {
  //   try {
  //     const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  //     const token = localStorage.getItem('token');
      
  //     console.log('🔍 Fetching available slots for doctor:', doctorId);
      
  //     const response = await axios.get(
  //       `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`,
  //       {
  //         headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  //         timeout: 10000
  //       }
  //     );
      
  //     if (response.data.success) {
  //       const slots = response.data.data || [];
  //       console.log(`✅ Loaded ${slots.length} available slots`);
        
  //       // Group slots by date and assign sequential serial numbers
  //       const slotsWithSerial = [];
  //       const slotsByDate = {};
        
  //       // First, group slots by date
  //       slots.forEach(slot => {
  //         if (!slotsByDate[slot.date]) {
  //           slotsByDate[slot.date] = [];
  //         }
  //         slotsByDate[slot.date].push(slot);
  //       });
        
  //       // Sort slots within each date by start time and assign serial numbers
  //       Object.keys(slotsByDate).forEach(date => {
  //         const dateSlots = slotsByDate[date];
          
  //         // Sort by start time
  //         dateSlots.sort((a, b) => {
  //           const timeA = timeToMinutes(a.startTime);
  //           const timeB = timeToMinutes(b.startTime);
  //           return timeA - timeB;
  //         });
          
  //         // Assign serial numbers
  //         dateSlots.forEach((slot, index) => {
  //           slotsWithSerial.push({
  //             ...slot,
  //             serialNumber: slot.serialNumber || (index + 1) // Use existing or assign new
  //           });
  //         });
  //       });
        
  //       // Sort all slots by date
  //       slotsWithSerial.sort((a, b) => {
  //         if (a.date === b.date) {
  //           return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  //         }
  //         return new Date(a.date) - new Date(b.date);
  //       });
        
  //       setAvailableSlots(slotsWithSerial);
        
  //       // If slotId is provided in URL, pre-select it
  //       if (slotId && slotsWithSerial.length > 0) {
  //         const preSelectedSlot = slotsWithSerial.find(slot => slot._id === slotId);
  //         if (preSelectedSlot) {
  //           handleDateSelect(preSelectedSlot.date);
  //           setSelectedTime(preSelectedSlot);
  //           console.log('✅ Pre-selected slot:', preSelectedSlot);
  //         }
  //       }
  //     } else {
  //       toast.error(response.data.message || 'Failed to load available slots');
  //       setAvailableSlots([]);
  //     }
  //   } catch (error) {
  //     console.error('❌ Error fetching slots:', error);
      
  //     if (error.response?.status === 404) {
  //       console.log('⚠️ Endpoint not found, using fallback mock data');
  //       generateMockSlots();
  //     } else {
  //       toast.error('Failed to load available slots');
  //       setAvailableSlots([]);
  //     }
  //   }
  // };

  // Fetch clients from backend
  
  const fetchAvailableSlots = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    console.log('🔍 Fetching available slots for doctor:', doctorId);
    
    const response = await axios.get(
      `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        timeout: 10000
      }
    );
    
    if (response.data.success) {
      const slots = response.data.data || [];
      console.log(`✅ Loaded ${slots.length} available slots`);
      
      // Use the serial numbers directly from the database
      // Don't reassign them - they should already have the correct serialNumber
      const slotsWithSerial = slots.map(slot => {
        // Debug: log each slot's serial number
        console.log(`Slot: ${slot.startTime} - ${slot.endTime}, Serial: ${slot.serialNumber}`);
        
        return {
          ...slot,
          // Use the serialNumber from the database, fallback to 0 if not present
          serialNumber: slot.serialNumber || 0
        };
      });
      
      // Sort all slots by date and time
      slotsWithSerial.sort((a, b) => {
        if (a.date === b.date) {
          return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        }
        return new Date(a.date) - new Date(b.date);
      });
      
      console.log('Slots with serial numbers:', slotsWithSerial.map(s => ({
        time: s.startTime,
        serial: s.serialNumber
      })));
      
      setAvailableSlots(slotsWithSerial);
      
      // If slotId is provided in URL, pre-select it
      if (slotId && slotsWithSerial.length > 0) {
        const preSelectedSlot = slotsWithSerial.find(slot => slot._id === slotId);
        if (preSelectedSlot) {
          handleDateSelect(preSelectedSlot.date);
          setSelectedTime(preSelectedSlot);
          console.log('✅ Pre-selected slot:', preSelectedSlot);
        }
      }
    } else {
      toast.error(response.data.message || 'Failed to load available slots');
      setAvailableSlots([]);
    }
  } catch (error) {
    console.error('❌ Error fetching slots:', error);
    
    if (error.response?.status === 404) {
      console.log('⚠️ Endpoint not found, using fallback mock data');
      generateMockSlots();
    } else {
      toast.error('Failed to load available slots');
      setAvailableSlots([]);
    }
  }
};
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        // Filter only client users and sort by name
        const clientUsers = response.data.users
          .filter(user => user.role === 'client')
          .sort((a, b) => a.name.localeCompare(b.name));
        
        console.log(`✅ Loaded ${clientUsers.length} clients`);
        setClients(clientUsers);
        setFilteredClients(clientUsers);
      } else {
        toast.error('Failed to load client list');
        setClients([]);
        setFilteredClients([]);
      }
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
      
      // Fallback to mock data for development
      if (error.response?.status === 404 || !process.env.NEXT_PUBLIC_BACKEND_URL) {
        console.log('⚠️ Using mock client data for development');
        const mockClients = [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            role: 'client',
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 987-6543',
            role: 'client',
            isActive: true,
            createdAt: '2024-01-10T09:15:00Z'
          },
          {
            _id: '3',
            name: 'Robert Johnson',
            email: 'robert.j@example.com',
            phone: '+1 (555) 456-7890',
            role: 'client',
            isActive: true,
            createdAt: '2024-01-20T14:45:00Z'
          },
          {
            _id: '4',
            name: 'Maria Garcia',
            email: 'maria.g@example.com',
            phone: '+1 (555) 234-5678',
            role: 'client',
            isActive: true,
            createdAt: '2024-01-18T11:20:00Z'
          },
          {
            _id: '5',
            name: 'David Wilson',
            email: 'david.w@example.com',
            phone: '+1 (555) 876-5432',
            role: 'client',
            isActive: true,
            createdAt: '2024-01-22T16:30:00Z'
          }
        ];
        setClients(mockClients);
        setFilteredClients(mockClients);
      } else {
        toast.error('Failed to load client list');
        setClients([]);
        setFilteredClients([]);
      }
    } finally {
      setLoadingClients(false);
    }
  };

  // Filter clients based on search
  useEffect(() => {
    if (!searchClientEmail.trim()) {
      setFilteredClients(clients);
    } else {
      const searchTerm = searchClientEmail.toLowerCase();
      const filtered = clients.filter(client =>
        client.email.toLowerCase().includes(searchTerm) ||
        client.name.toLowerCase().includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchClientEmail, clients]);

  // Handle client selection from dropdown
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setPatientData({
      fullName: client.name,
      email: client.email,
      phone: client.phone || '',
      dateOfBirth: patientData.dateOfBirth, // Keep existing DOB
      gender: patientData.gender, // Keep existing gender
      address: patientData.address, // Keep existing address
      reason: patientData.reason // Keep existing reason
    });
    setShowClientDropdown(false);
    setSearchClientEmail('');
    toast.success(`Selected client: ${client.name}`);
  };

  // Clear selected client
  const handleClearClient = () => {
    setSelectedClient(null);
    setPatientData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      address: patientData.address,
      reason: patientData.reason
    });
    toast.info('Cleared client selection');
  };

  // Helper function to generate mock slots for development
  // const generateMockSlots = () => {
  //   if (!doctor) return;
    
  //   console.log('🔄 Generating mock slots for development');
    
  //   const mockSlots = [];
  //   const today = new Date();
    
  //   // Generate slots for next 30 days
  //   for (let i = 1; i <= 30; i++) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() + i);
      
  //     // Skip weekends for demo
  //     const dayOfWeek = date.getDay();
  //     if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
  //     const dateString = formatDateToLocalString(date);
  //     const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
  //     // Assign serial numbers for each day
  //     timeSlots.forEach((time, index) => {
  //       const slotId = `mock-${dateString}-${time}`;
  //       const endTime = addMinutes(time, doctor.perPatientTime || 15);
  //       const serialNumber = index + 1;
        
  //       mockSlots.push({
  //         _id: slotId,
  //         date: dateString,
  //         startTime: time,
  //         endTime: endTime,
  //         duration: doctor.perPatientTime || 15,
  //         day: date.toLocaleDateString('en-US', { weekday: 'long' }),
  //         isBooked: false,
  //         status: 'available',
  //         serialNumber: serialNumber,
  //         formattedDate: date.toLocaleDateString('en-US', {
  //           weekday: 'long',
  //           year: 'numeric',
  //           month: 'long',
  //           day: 'numeric'
  //         }),
  //         formattedTime: `${time} - ${endTime}`,
  //         serialDisplay: `#${serialNumber}`
  //       });
  //     });
  //   }
    
  //   console.log(`✅ Generated ${mockSlots.length} mock slots`);
  //   setAvailableSlots(mockSlots);
  // };
  const generateMockSlots = () => {
  if (!doctor) return;
  
  console.log('🔄 Generating mock slots for development');
  
  const mockSlots = [];
  const today = new Date();
  
  // Generate slots for next 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends for demo
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    const dateString = formatDateToLocalString(date);
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    
    // Assign serial numbers for each day (1, 2, 3, ...)
    timeSlots.forEach((time, index) => {
      const slotId = `mock-${dateString}-${time}`;
      const endTime = addMinutes(time, doctor.perPatientTime || 15);
      const serialNumber = index + 1;
      
      mockSlots.push({
        _id: slotId,
        date: dateString,
        startTime: time,
        endTime: endTime,
        duration: doctor.perPatientTime || 15,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        isBooked: false,
        status: 'available',
        serialNumber: serialNumber, // Include serial number
        formattedDate: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        formattedTime: `${time} - ${endTime}`,
        serialDisplay: `#${serialNumber}`
      });
    });
  }
  
  console.log(`✅ Generated ${mockSlots.length} mock slots with serial numbers`);
  setAvailableSlots(mockSlots);
};

  // Helper function to add minutes to time string
  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  }, [availableSlots]);

  // Get available dates
  const availableDates = useMemo(() => {
    return Object.keys(slotsByDate).sort();
  }, [slotsByDate]);

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate[selectedDate] || [];
  }, [selectedDate, slotsByDate]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get today's date in local format for comparison
    const today = new Date();
    const todayLocal = formatDateToLocalString(today);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDateToLocalString(date);
      const isToday = dateString === todayLocal;
      const isSelected = dateString === selectedDate;
      const hasSlots = availableDates.includes(dateString);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);
      const isPast = date < todayMidnight;
      
      days.push({
        date,
        dateString,
        day,
        isToday,
        isSelected,
        hasSlots,
        isPast,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    
    return days;
  }, [currentMonth, selectedDate, availableDates]);

  // Handle date selection
  const handleDateSelect = (dateInput) => {
    // Accept either Date object or string
    const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const localDateString = formatDateToLocalString(dateObj);
    setSelectedDate(localDateString);
    setSelectedTime(null);
    // Don't hide date picker - let user see their selection
    setShowTimePicker(true);
  };

  // Handle time selection
  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
    // Don't hide time picker automatically
  };

  // Get date status color
  const getDateColor = (date) => {
    if (!date) return '';
    if (date.isPast) return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    if (!date.hasSlots) return 'bg-red-50 text-red-400 border-red-200';
    if (date.isSelected) return 'bg-emerald-500 text-white border-emerald-600';
    if (date.isToday) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (date.hasSlots) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    return 'bg-white text-slate-700 border-slate-200';
  };

  // Format selected slot for display
  const formatSelectedSlot = () => {
    if (!selectedDate || !selectedTime) return null;
    
    // Parse the selected date properly
    const [year, month, day] = selectedDate.split('-');
    const date = new Date(year, month - 1, day);
    
    return {
      formattedDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formattedTime: `${selectedTime.startTime} - ${selectedTime.endTime}`,
      duration: selectedTime.duration || doctor?.perPatientTime || 15,
      serialNumber: selectedTime.serialNumber || 0
    };
  };

  const selectedSlotInfo = formatSelectedSlot();

  // Navigation for calendar
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If email is changed manually, clear the selected client
    if (name === 'email' && selectedClient && selectedClient.email !== value) {
      setSelectedClient(null);
    }
    
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time slot');
      return false;
    }

    if (!patientData.fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }

    if (!patientData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!patientData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const phoneDigits = patientData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(phoneDigits)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    if (!patientData.dateOfBirth) {
      toast.error('Date of birth is required');
      return false;
    }

    // Check if patient is at least 1 day old (changed from 1 year)
    const birthDate = new Date(patientData.dateOfBirth);
    const today = new Date();
    
    // Set both dates to midnight for accurate day comparison
    const birthMidnight = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculate difference in days
    const timeDiff = todayMidnight.getTime() - birthMidnight.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 1) {
      toast.error('Date of birth cannot be in the future or today');
      return false;
    }

    // Optional: Add maximum age limit if needed (e.g., 150 years)
    const maxAgeYears = 150;
    const maxAgeDays = maxAgeYears * 365;
    if (daysDiff > maxAgeDays) {
      toast.error(`Patient age seems unrealistic. Maximum allowed age is ${maxAgeYears} years.`);
      return false;
    }

    if (!patientData.gender) {
      toast.error('Please select gender');
      return false;
    }

    if (!patientData.reason.trim()) {
      toast.error('Please specify the reason for appointment');
      return false;
    }

    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;
    
  //   setSubmitting(true);
    
  //   try {
  //     const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  //     const token = localStorage.getItem('token');
      
  //     const appointmentData = {
  //       doctorId,
  //       slotId: selectedTime._id,
  //       patient: patientData,
  //       appointmentDate: selectedDate,
  //       appointmentTime: selectedTime.startTime,
  //       slotSerialNumber: selectedTime.serialNumber,
  //       status: 'confirmed'
  //     };
      
  //     console.log('📤 Booking appointment with data:', appointmentData);
  //     console.log('🎯 Calling endpoint:', `${BACKEND_URL}/api/appointments`);
  //     console.log('📝 Slot Serial:', selectedTime.serialNumber);
  //     console.log('🔑 Token exists:', !!token);
      
  //     // For development with mock slots
  //     if (selectedTime._id.startsWith('mock-')) {
  //       console.log('🎭 Using mock mode - skipping real API call');
  //       toast.success('Appointment booked successfully! (Demo Mode)');
  //       setTimeout(() => {
  //         router.push('/admin/doctors');
  //       }, 1500);
  //       return;
  //     }
      
  //     const response = await axios.post(
  //       `${BACKEND_URL}/api/appointments`,
  //       appointmentData,
  //       {
  //         headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  //         timeout: 10000
  //       }
  //     );
      
  //     console.log('✅ Appointment response:', response.data);
      
  //     if (response.data.success) {
  //       toast.success(`Appointment #${selectedTime.serialNumber} booked and confirmed successfully!`);
        
  //       // Redirect back to doctors
  //       setTimeout(() => {
  //         router.push('/admin/doctors');
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     console.error('Error booking appointment:', error);
      
  //     if (error.response) {
  //       const status = error.response.status;
        
  //       if (status === 400) {
  //         toast.error(error.response.data.message || 'Invalid appointment data');
  //       } else if (status === 409) {
  //         toast.error('This time slot is no longer available. Please select another slot.');
  //         fetchAvailableSlots(); // Refresh slots
  //       } else if (status === 401) {
  //         toast.error('Please login to book an appointment');
  //         router.push('/login');
  //       } else if (status === 403) {
  //         toast.error('You do not have permission to book appointments');
  //       } else if (status === 404) {
  //         toast.error('Doctor or time slot not found');
  //       } else {
  //         toast.error('Failed to book appointment. Please try again.');
  //         console.error('Server error:', error.response.data);
  //       }
  //     } else if (error.request) {
  //       toast.error('Network error. Please check your connection.');
  //       console.error('Network error:', error.request);
  //     } else {
  //       toast.error('An unexpected error occurred.');
  //       console.error('Error:', error.message);
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setSubmitting(true);
  
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    const appointmentData = {
      doctorId,
      slotId: selectedTime._id,
      patient: patientData,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime.startTime,
      slotSerialNumber: selectedTime.serialNumber,
      status: 'confirmed'
    };
    
    console.log('📤 Booking appointment with data:', appointmentData);
    
    // For development with mock slots
    if (selectedTime._id.startsWith('mock-')) {
      console.log('🎭 Using mock mode - skipping real API call');
      toast.success('Appointment booked successfully! (Demo Mode)');
      
      // Simulate email sending in demo mode
      setTimeout(() => {
        toast.success('📧 Confirmation email sent to ' + patientData.email);
      }, 500);
      
      setTimeout(() => {
        router.push('/admin/doctors');
      }, 1500);
      return;
    }
    
    const response = await axios.post(
      `${BACKEND_URL}/api/appointments`,
      appointmentData,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        timeout: 15000
      }
    );
    
    console.log('✅ Appointment response:', response.data);
    
    if (response.data.success) {
      const { emailStatus } = response.data.data;
      
      // Show appointment success message
      toast.success(`Appointment #${selectedTime.serialNumber} booked successfully!`, {
        duration: 4000
      });
      
      // Show email status
      if (emailStatus && emailStatus.sent) {
        toast.success(`📧 Confirmation email sent to ${patientData.email}`, {
          duration: 4000
        });
      } else {
        toast.warning('⚠️ Appointment booked but email not sent. We\'ll contact you soon.', {
          duration: 4000
        });
        console.log('Email error:', emailStatus?.error);
      }
      
      // Redirect back to doctors
      setTimeout(() => {
        router.push('/admin/doctors');
      }, 2000);
    }
  } catch (error) {
    // ... your existing error handling code ...
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-800">Loading Doctor Information</h3>
              <p className="text-slate-600 mt-2">Preparing your appointment booking...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
            <p className="text-slate-600 mb-6">The doctor you're looking for might not be available.</p>
            <Link
              href="/admin/doctors"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/doctors"
                className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Book Appointment</h1>
                <p className="text-slate-600 mt-1">Schedule your consultation with Dr. {doctor.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Doctor ID: {doctorId?.substring(0, 8)}...
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Doctor Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6">
              Doctor Information
            </h2>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Doctor Image */}
              <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                {doctor.image?.url ? (
                  <img 
                    src={doctor.image.url} 
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Stethoscope className="w-12 h-12 text-emerald-600" />
                  </div>
                )}
              </div>
              
              {/* Doctor Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">{doctor.name}</h3>
                  <p className="text-emerald-600 font-medium">{doctor.designation || "Medical Specialist"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-slate-700">
                    <Stethoscope className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{doctor.speciality || "General Medicine"}</span>
                  </div>
                  
                  <div className="flex items-center text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{doctor.perPatientTime || 15} minutes per patient</span>
                  </div>
                  
                  <div className="flex items-center text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{doctor.location || "Hospital Location"}</span>
                  </div>
                  
                  <div className="flex items-center text-slate-700">
                    <Mail className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{doctor.email || "No email provided"}</span>
                  </div>
                </div>
                
                {doctor.description && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">{doctor.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time Selection Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6">
              Schedule Appointment
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Select Date</span>
                  <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {availableDates.length} available days
                  </span>
                </h3>
              
                {/* Date Picker Toggle */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-left flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span className={selectedDate ? "text-slate-800" : "text-slate-500"}>
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Select a date'}
                      </span>
                    </div>
                    {showDatePicker ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                
                {/* Calendar Picker */}
                {showDatePicker && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm mb-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <h4 className="font-semibold text-slate-800">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h4>
                      <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => (
                        <div key={index} className="min-h-10">
                          {day ? (
                            <button
                              onClick={() => !day.isPast && day.hasSlots && handleDateSelect(day.date)}
                              disabled={day.isPast || !day.hasSlots}
                              className={`w-full h-10 rounded-md border transition-all flex items-center justify-center text-sm font-medium
                                ${getDateColor(day)}
                                ${day.isWeekend ? 'opacity-75' : ''}
                                ${(day.isPast || !day.hasSlots) ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                              title={day.isPast ? "Past date" : !day.hasSlots ? "No available slots" : `Available slots: ${slotsByDate[day.dateString]?.length || 0}`}
                            >
                              {day.day}
                              {day.isToday && !day.isSelected && (
                                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              )}
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Legend */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-emerald-500"></div>
                          <span className="text-slate-600">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></div>
                          <span className="text-slate-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
                          <span className="text-slate-600">No slots</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-gray-100"></div>
                          <span className="text-slate-600">Past/Unavailable</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Done Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Refresh Button */}
                <div className="mt-4">
                  <button
                    onClick={fetchAvailableSlots}
                    className="w-full px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Available Slots
                  </button>
                  
                  {availableSlots.length === 0 && (
                    <button
                      onClick={generateMockSlots}
                      className="mt-2 w-full px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium"
                    >
                      Use Demo Slots (Development)
                    </button>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Select Time</span>
                  {selectedDate && (
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {slotsForSelectedDate.length} slots available
                    </span>
                  )}
                </h3>
                
                {/* Time Picker Toggle */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    disabled={!selectedDate}
                    className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition
                      ${!selectedDate 
                        ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' 
                        : 'border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className={selectedTime ? "text-slate-800" : "text-slate-500"}>
                        {selectedTime ? 
                          `Sl-${selectedTime.serialNumber || ''}: ${selectedTime.startTime} - ${selectedTime.endTime}` 
                          : 'Select a time slot'}
                      </span>
                    </div>
                    {showTimePicker ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                
                {/* Time Slots Picker */}
                {showTimePicker && selectedDate && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm mb-4">
                    {/* Date Header */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {slotsForSelectedDate.length} slots
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Slots */}
                    {slotsForSelectedDate.length > 0 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                          {slotsForSelectedDate.map((slot) => (
                            <button
                              key={slot._id}
                              onClick={() => handleTimeSelect(slot)}
                              className={`p-3 border rounded-lg text-left transition-all relative
                                ${selectedTime?._id === slot._id 
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-emerald-300'
                                }`}
                            >
                              {/* Serial Number Badge */}
                              <div className="absolute top-1.5 right-1.5">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                  ${selectedTime?._id === slot._id 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {slot.serialNumber || '?'}
                                </div>
                              </div>
                              
                              <div className="font-medium text-lg">{slot.startTime}</div>
                              <div className="text-xs mt-1">
                                {selectedTime?._id === slot._id 
                                  ? '✓ Selected' 
                                  : `to ${slot.endTime}`
                                }
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {slot.duration || doctor?.perPatientTime || 15} min
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {/* Done Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => setShowTimePicker(false)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-slate-200 rounded-lg bg-slate-50">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-700">No time slots available for this date</p>
                        <p className="text-sm text-slate-500 mt-1">Please select another date</p>
                        <button
                          onClick={() => setShowTimePicker(false)}
                          className="mt-3 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium text-sm"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Time Slots Not Available Message */}
                {!selectedDate && (
                  <div className="p-4 text-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-700">Select a date first</p>
                    <p className="text-sm text-slate-500 mt-1">Please select a date to view available time slots</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Selected Appointment & Important Notes */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Selected Appointment */}
            {selectedSlotInfo && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Selected Appointment
                </h4>
                
                {/* Serial Number Badge */}
                <div className="mb-3">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                  
                    Serial No:{selectedSlotInfo.serialNumber}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {selectedSlotInfo.formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {selectedSlotInfo.formattedTime}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Duration: {selectedSlotInfo.duration} minutes
                  </div>
                
                </div>
                
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setShowDatePicker(true);
                    setShowTimePicker(false);
                  }}
                  className="mt-3 w-full px-3 py-1.5 text-sm border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-100 transition font-medium"
                >
                  Change Selection
                </button>
              </div>
            )}

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Notes
              </h4>
              <ul className="text-sm text-amber-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Please arrive 15 minutes before your appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Bring your ID and insurance card (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Cancellation must be made 24 hours in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Emergency? Call emergency services immediately</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Patient Information Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Patient Information
              </h2>
              {selectedClient && (
                <div className="flex items-center gap-2">
                  <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Selected: {selectedClient.name}
                  </div>
                  <button
                    onClick={handleClearClient}
                    className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded"
                    title="Clear selected client"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Quick Client Lookup</span>
              </div>
              <p className="text-sm text-slate-600">
                Search and select an existing client to auto-fill their information. 
                {clients.length === 0 && ' No clients found in database.'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={patientData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <input
                      type="email"
                      name="email"
                      value={patientData.email}
                      onChange={handleInputChange}
                      onFocus={() => setShowClientDropdown(true)}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="john@example.com"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientDropdown(!showClientDropdown)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      <ChevronsUpDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Client Dropdown */}
                  {showClientDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {/* Search Input in Dropdown */}
                      <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={searchClientEmail}
                            onChange={(e) => setSearchClientEmail(e.target.value)}
                            placeholder="Search by email or name..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      {/* Loading State */}
                      {loadingClients ? (
                        <div className="p-4 text-center">
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                          <p className="mt-2 text-sm text-slate-500">Loading clients...</p>
                        </div>
                      ) : (
                        <>
                          {/* Client List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredClients.length === 0 ? (
                              <div className="p-4 text-center text-sm text-slate-500">
                                {searchClientEmail ? 'No matching clients found' : 'No clients available'}
                              </div>
                            ) : (
                              filteredClients.map((client) => (
                                <button
                                  key={client._id}
                                  type="button"
                                  onClick={() => handleClientSelect(client)}
                                  className={`w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0
                                    ${selectedClient?._id === client._id ? 'bg-emerald-50' : ''}`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                                      ${selectedClient?._id === client._id 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {client.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-800">{client.name}</div>
                                      <div className="text-sm text-slate-500">{client.email}</div>
                                      {client.phone && (
                                        <div className="text-xs text-slate-400 mt-1">{client.phone}</div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                          
                          {/* Refresh Button */}
                          <div className="p-2 border-t border-slate-200">
                            <button
                              type="button"
                              onClick={fetchClients}
                              className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 hover:bg-emerald-50 rounded flex items-center justify-center"
                            >
                              <RefreshCw className="w-3 h-3 mr-2" />
                              Refresh Client List
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={patientData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={patientData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={patientData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="Street Address, City, State, ZIP Code"
                  />
                </div>

                {/* Reason for Appointment */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Appointment *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      name="reason"
                      value={patientData.reason}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="Please describe your symptoms or reason for consultation..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <Link
                  href="/admin/doctors"
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedTime}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>Book Appointment #{selectedTime?.serialNumber || ''}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;