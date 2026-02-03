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
//   X,
//   ShieldCheck,
//   Star,
//   Award,
//   LogIn
// } from 'lucide-react';
// import Link from 'next/link';

// const ClientAppointmentBooking = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const doctorId = searchParams.get('doctorId');
  
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [userData, setUserData] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);
  
//   // Patient data states
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

//   // Fetch user data and doctor details
//   useEffect(() => {
//     if (doctorId) {
//       fetchUserData();
//       fetchDoctorDetails();
//       fetchAvailableSlots();
//     } else {
//       toast.error('No doctor selected');
//       router.push('/bookApp');
//     }
//   }, [doctorId]);

//   const fetchUserData = () => {
//     try {
//       // Check if user is logged in
//       const token = localStorage.getItem('token');
//       const userStr = localStorage.getItem('user');
      
//       if (userStr) {
//         const user = JSON.parse(userStr);
//         setUserData(user);
        
//         // Pre-fill patient data if user is logged in
//         setPatientData(prev => ({
//           ...prev,
//           fullName: user.name || '',
//           email: user.email || '',
//           phone: user.phone || '',
//           // Add other fields if available in user object
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const fetchDoctorDetails = async () => {
//     try {
//       setLoading(true);
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
//       const response = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`);
      
//       if (response.data.success) {
//         setDoctor(response.data.data);
//       } else {
//         toast.error('Doctor not found');
//         router.push('/bookApp');
//       }
//     } catch (error) {
//       console.error('Error fetching doctor:', error);
//       toast.error('Failed to load doctor details');
//       router.push('/bookApp');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableSlots = async () => {
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
//       console.log('🔍 Fetching available slots for doctor:', doctorId);
      
//       const response = await axios.get(
//         `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`
//       );
      
//       if (response.data.success) {
//         const slots = response.data.data || [];
//         console.log(`✅ Loaded ${slots.length} available slots`);
//         setAvailableSlots(slots);
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
//     setShowTimePicker(true);
//   };

//   // Handle time selection
//   const handleTimeSelect = (slot) => {
//     setSelectedTime(slot);
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
//     setPatientData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLoginAndAutoFill = () => {
//     setShowLoginModal(true);
//   };

//   const validateForm = () => {
//     if (!selectedDate || !selectedTime) {
//       toast.error('Please select a date and time slot');
//       return false;
//     }

//     if (!patientData.fullName.trim()) {
//       toast.error('Full name is required');
//       return false;
//     }

//     if (!patientData.email.trim()) {
//       toast.error('Email is required');
//       return false;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(patientData.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }

//     if (!patientData.phone.trim()) {
//       toast.error('Phone number is required');
//       return false;
//     }

//     // Basic phone validation
//     const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
//     const phoneDigits = patientData.phone.replace(/\D/g, '');
//     if (!phoneRegex.test(phoneDigits)) {
//       toast.error('Please enter a valid phone number (10-15 digits)');
//       return false;
//     }

//     if (!patientData.dateOfBirth) {
//       toast.error('Date of birth is required');
//       return false;
//     }

//     // Check if patient is at least 1 day old
//     const birthDate = new Date(patientData.dateOfBirth);
//     const today = new Date();
    
//     // Set both dates to midnight for accurate day comparison
//     const birthMidnight = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
//     const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
//     // Calculate difference in days
//     const timeDiff = todayMidnight.getTime() - birthMidnight.getTime();
//     const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
//     if (daysDiff < 1) {
//       toast.error('Date of birth cannot be in the future or today');
//       return false;
//     }

//     // Optional: Add maximum age limit if needed (e.g., 150 years)
//     const maxAgeYears = 150;
//     const maxAgeDays = maxAgeYears * 365;
//     if (daysDiff > maxAgeDays) {
//       toast.error(`Patient age seems unrealistic. Maximum allowed age is ${maxAgeYears} years.`);
//       return false;
//     }

//     if (!patientData.gender) {
//       toast.error('Please select gender');
//       return false;
//     }

//     if (!patientData.reason.trim()) {
//       toast.error('Please specify the reason for appointment');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setSubmitting(true);
    
//     try {
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//       const token = localStorage.getItem('token');
      
//       const appointmentData = {
//         doctorId,
//         slotId: selectedTime._id,
//         patient: patientData,
//         appointmentDate: selectedDate,
//         appointmentTime: selectedTime.startTime,
//         status: 'pending'
//       };
      
//       console.log('📤 Booking appointment with data:', appointmentData);
      
//       // For development with mock slots
//       if (selectedTime._id.startsWith('mock-')) {
//         console.log('🎭 Using mock mode - skipping real API call');
//         toast.success('Appointment booked successfully! (Demo Mode)');
        
//         // Simulate successful booking
//         setTimeout(() => {
//           toast.success('Confirmation email has been sent to your email address!');
//           setTimeout(() => {
//             if (userData) {
//               router.push('/upcomingApp');
//             } else {
//               router.push('/bookApp');
//             }
//           }, 2000);
//         }, 1000);
//         return;
//       }
      
//       // REAL API CALL
//       const response = await axios.post(
//         `${BACKEND_URL}/api/appointments/client-book`,
//         appointmentData,
//         {
//           headers: token ? { 'Authorization': `Bearer ${token}` } : {},
//           timeout: 10000
//         }
//       );
      
//       console.log('✅ Appointment response:', response.data);
      
//       if (response.data.success) {
//         toast.success('Appointment booked successfully! It is now pending approval.');
        
//         // Show confirmation and redirect
//         setTimeout(() => {
//           toast.success('You will receive a confirmation email once approved!');
//           setTimeout(() => {
//             if (userData) {
//               router.push('/upcomingApp');
//             } else {
//               router.push('/bookApp');
//             }
//           }, 2000);
//         }, 1000);
//       }
//     } catch (error) {
//       console.error('Error booking appointment:', error);
      
//       if (error.response) {
//         const status = error.response.status;
        
//         if (status === 400) {
//           toast.error(error.response.data.message || 'Invalid appointment data');
//         } else if (status === 409) {
//           toast.error('This time slot is no longer available. Please select another slot.');
//           fetchAvailableSlots(); // Refresh slots
//         } else if (status === 401) {
//           toast.error('Please login to book an appointment');
//           setShowLoginModal(true);
//         } else if (status === 403) {
//           toast.error('You do not have permission to book appointments');
//         } else if (status === 404) {
//           toast.error('Doctor or time slot not found');
//         } else {
//           toast.error('Failed to book appointment. Please try again.');
//           console.error('Server error:', error.response.data);
//         }
//       } else if (error.request) {
//         toast.error('Network error. Please check your connection.');
//         console.error('Network error:', error.request);
//       } else {
//         toast.error('An unexpected error occurred.');
//         console.error('Error:', error.message);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

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
//               href="/bookApp"
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
      
//       {/* Login Modal */}
//       {showLoginModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
//             <div className="p-6 border-b border-slate-200">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
//                   <LogIn className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">Login Required</h3>
//                   <p className="text-slate-600 text-sm">Login to book appointments faster</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <p className="text-slate-700 mb-4">
//                 Login to save your information, track appointments, and get booking confirmation.
//               </p>
//               <div className="space-y-3">
//                 <Link
//                   href="/login"
//                   className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition text-center font-medium"
//                   onClick={() => setShowLoginModal(false)}
//                 >
//                   Login Now
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="block w-full px-4 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition text-center font-medium"
//                   onClick={() => setShowLoginModal(false)}
//                 >
//                   Create Account
//                 </Link>
//                 <button
//                   onClick={() => setShowLoginModal(false)}
//                   className="block w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition text-center font-medium"
//                 >
//                   Continue as Guest
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <Link
//                 href="/bookApp"
//                 className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-slate-700" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Book Appointment</h1>
//                 <p className="text-slate-600 mt-1">Schedule your consultation with Dr. {doctor.name}</p>
//               </div>
//             </div>
//             {userData ? (
//               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
//                 <User className="w-4 h-4" />
//                 {userData.name}
//               </div>
//             ) : (
//               <button
//                 onClick={handleLoginAndAutoFill}
//                 className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition flex items-center gap-2"
//               >
//                 <LogIn className="w-4 h-4" />
//                 Login to Book
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="space-y-8">
//           {/* Doctor Information Card */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 Doctor Information
//               </h2>
//               {doctor.experience && (
//                 <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm">
//                   <Award className="w-4 h-4" />
//                   {doctor.experience} years experience
//                 </div>
//               )}
//             </div>
            
//             <div className="flex flex-col md:flex-row items-start gap-6">
//               {/* Doctor Image */}
//               <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-emerald-100 flex-shrink-0">
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
//                   <h3 className="text-2xl font-bold text-slate-900">Dr. {doctor.name}</h3>
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
                  
//                   {doctor.qualification && (
//                     <div className="flex items-center text-slate-700">
//                       <ShieldCheck className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
//                       <span className="text-sm">{doctor.qualification}</span>
//                     </div>
//                   )}
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
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                   <span>Bring your ID and insurance card (if applicable)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                   <span>Cancellation must be made 24 hours in advance</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
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
//               {userData ? (
//                 <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center">
//                   <User className="w-3 h-3 mr-1" />
//                   Logged in as: {userData.name}
//                 </div>
//               ) : (
//                 <button
//                   onClick={handleLoginAndAutoFill}
//                   className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
//                 >
//                   <LogIn className="w-3 h-3" />
//                   Login for faster booking
//                 </button>
//               )}
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

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={patientData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
//                       placeholder="john@example.com"
//                     />
//                   </div>
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
//                   href="/bookApp"
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

// export default ClientAppointmentBooking;


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
  ShieldCheck,
  Star,
  Award,
  LogIn,
  Hash // Added for serial number icon
} from 'lucide-react';
import Link from 'next/link';

const ClientAppointmentBooking = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Patient data states
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

  // Fetch user data and doctor details
  useEffect(() => {
    if (doctorId) {
      fetchUserData();
      fetchDoctorDetails();
      fetchAvailableSlots();
    } else {
      toast.error('No doctor selected');
      router.push('/bookApp');
    }
  }, [doctorId]);

  const fetchUserData = () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData(user);
        
        // Pre-fill patient data if user is logged in
        setPatientData(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          // Add other fields if available in user object
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      const response = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`);
      
      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        toast.error('Doctor not found');
        router.push('/bookApp');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor details');
      router.push('/bookApp');
    } finally {
      setLoading(false);
    }
  };

  // const fetchAvailableSlots = async () => {
  //   try {
  //     const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
  //     console.log('🔍 Fetching available slots for doctor:', doctorId);
      
  //     const response = await axios.get(
  //       `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`
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

  // Helper function to generate mock slots for development
  

  const fetchAvailableSlots = async () => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    console.log('🔍 Fetching available slots for doctor:', doctorId);
    
    const response = await axios.get(
      `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`
    );
    
    if (response.data.success) {
      const slots = response.data.data || [];
      console.log(`✅ Loaded ${slots.length} available slots`);
      
      // Use the serial numbers directly from the database - DO NOT reassign them
      const slotsWithSerial = slots.map(slot => {
        console.log(`Slot: ${slot.startTime} - ${slot.endTime}, Serial from DB: ${slot.serialNumber}`);
        
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

  // Helper function to add minutes to time string
  
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
    setShowTimePicker(true);
  };

  // Handle time selection
  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
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
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginAndAutoFill = () => {
    setShowLoginModal(true);
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

    // Check if patient is at least 1 day old
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



//   const handleSubmit = async (e) => {
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
//       slotSerialNumber: selectedTime.serialNumber || 0, // Get serial number from selectedTime
//       status: 'pending'
//     };
    
//     console.log('📤 Booking appointment with data:', appointmentData);
//     console.log('📝 Slot Serial Number from selectedTime:', selectedTime.serialNumber);
    
//     // For development with mock slots
//     if (selectedTime._id.startsWith('mock-')) {
//       console.log('🎭 Using mock mode - skipping real API call');
//       toast.success(`Appointment #${selectedTime.serialNumber} booked successfully! (Demo Mode)`);
      
//       // Simulate successful booking
//       setTimeout(() => {
//         toast.success('Confirmation email has been sent to your email address!');
//         setTimeout(() => {
//           if (userData) {
//             router.push('/client/upcomingApp');
//           } else {
//             router.push('/bookApp');
//           }
//         }, 2000);
//       }, 1000);
//       return;
//     }
    
//     // REAL API CALL
//     const response = await axios.post(
//       `${BACKEND_URL}/api/appointments/client-book`,
//       appointmentData,
//       {
//         headers: token ? { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         } : { 'Content-Type': 'application/json' },
//         timeout: 10000
//       }
//     );
    
//     console.log('✅ Appointment response:', response.data);
    
//     if (response.data.success) {
//       toast.success(`Appointment #${selectedTime.serialNumber || ''} booked successfully! It is now pending approval.`);
      
//       // Show confirmation and redirect
//       setTimeout(() => {
//         toast.success('You will receive a confirmation email once approved!');
//         setTimeout(() => {
//           if (userData) {
//             router.push('/client/upcomingApp');
//           } else {
//             router.push('/bookApp');
//           }
//         }, 2000);
//       }, 1000);
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
//         setShowLoginModal(true);
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
      slotSerialNumber: selectedTime.serialNumber || 0,
      status: 'pending'
    };
    
    console.log('📤 Booking appointment with data:', appointmentData);
    console.log('📝 Slot Serial Number from selectedTime:', selectedTime.serialNumber);
    
    // For development with mock slots
    if (selectedTime._id.startsWith('mock-')) {
      console.log('🎭 Using mock mode - skipping real API call');
      toast.success(`Appointment #${selectedTime.serialNumber} booked successfully! (Demo Mode)`);
      
      // Simulate email sending in demo mode
      setTimeout(() => {
        toast.success(`📧 Confirmation email sent to ${patientData.email}`);
      }, 500);
      
      // Simulate sender copy email
      setTimeout(() => {
        toast.success('📋 Clinic copy sent to admin');
      }, 1000);
      
      setTimeout(() => {
        if (userData) {
          router.push('/client/upcomingApp');
        } else {
          router.push('/bookApp');
        }
      }, 2000);
      return;
    }
    
    // REAL API CALL
    const response = await axios.post(
      `${BACKEND_URL}/api/appointments/client-book`,
      appointmentData,
      {
        headers: token ? { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );
    
    console.log('✅ Appointment response:', response.data);
    
    if (response.data.success) {
      const { emailStatus } = response.data.data || {};
      
      // Show appointment success message
      toast.success(`Appointment #${selectedTime.serialNumber || ''} booked successfully! It is now pending approval.`, {
        duration: 4000
      });
      
      // Show email status if available
      if (emailStatus && emailStatus.sent) {
        toast.success(`📧 Confirmation email sent to ${patientData.email}`, {
          duration: 4000
        });
        
        // Show additional info about sender copy
        if (emailStatus.recipients && emailStatus.recipients.sender) {
          toast.success('📋 Clinic copy has been sent for record keeping', {
            duration: 4000
          });
        }
      } else if (emailStatus && !emailStatus.sent) {
        toast.warning('⚠️ Appointment booked but email not sent. You\'ll be contacted for confirmation.', {
          duration: 4000
        });
        console.log('Email error:', emailStatus?.error);
      } else {
        // If emailStatus is not in response (for backward compatibility)
        toast.success('📧 You will receive confirmation email once approved', {
          duration: 4000
        });
      }
      
      // Show success message and redirect
      setTimeout(() => {
        toast.success('✅ Your appointment is pending approval. You\'ll be notified via email.', {
          duration: 3000
        });
        setTimeout(() => {
          if (userData) {
            router.push('/client/upcomingApp');
          } else {
            router.push('/bookApp');
          }
        }, 2000);
      }, 1000);
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 400) {
        toast.error(error.response.data.message || 'Invalid appointment data');
      } else if (status === 409) {
        toast.error('This time slot is no longer available. Please select another slot.');
        fetchAvailableSlots(); // Refresh slots
      } else if (status === 401) {
        toast.error('Please login to book an appointment');
        setShowLoginModal(true);
      } else if (status === 403) {
        toast.error('You do not have permission to book appointments');
      } else if (status === 404) {
        toast.error('Doctor or time slot not found');
      } else if (status === 500) {
        // Check if it's an email error
        const errorData = error.response.data;
        if (errorData.message && errorData.message.includes('email')) {
          toast.success('Appointment booked but email service is currently unavailable.');
        } else {
          toast.error('Server error. Please try again.');
        }
      } else {
        toast.error('Failed to book appointment. Please try again.');
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
      console.error('Network error:', error.request);
    } else {
      toast.error('An unexpected error occurred.');
      console.error('Error:', error.message);
    }
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
              href="/bookApp"
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
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Login Required</h3>
                  <p className="text-slate-600 text-sm">Login to book appointments faster</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 mb-4">
                Login to save your information, track appointments, and get booking confirmation.
              </p>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition text-center font-medium"
                  onClick={() => setShowLoginModal(false)}
                >
                  Login Now
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition text-center font-medium"
                  onClick={() => setShowLoginModal(false)}
                >
                  Create Account
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="block w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition text-center font-medium"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/bookApp"
                className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Book Appointment</h1>
                <p className="text-slate-600 mt-1">Schedule your consultation with Dr. {doctor.name}</p>
              </div>
            </div>
            {userData ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <User className="w-4 h-4" />
                {userData.name}
              </div>
            ) : (
              <button
                onClick={handleLoginAndAutoFill}
                className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login to Book
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Doctor Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Doctor Information
              </h2>
              {doctor.experience && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm">
                  <Award className="w-4 h-4" />
                  {doctor.experience} years experience
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Doctor Image */}
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-emerald-100 flex-shrink-0">
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
                  <h3 className="text-2xl font-bold text-slate-900">Dr. {doctor.name}</h3>
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
                  
                  {doctor.qualification && (
                    <div className="flex items-center text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                  )}
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
                          `Sl No-${selectedTime.serialNumber || ''}: ${selectedTime.startTime} - ${selectedTime.endTime}` 
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
                 
                   Serial No: {selectedSlotInfo.serialNumber}
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
                  
                  {/* Serial Number Info */}
                
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
              {userData ? (
                <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  Logged in as: {userData.name}
                </div>
              ) : (
                <button
                  onClick={handleLoginAndAutoFill}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Login for faster booking
                </button>
              )}
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={patientData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
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
                  href="/bookApp"
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
                      <span>Book Appointment </span>
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

export default ClientAppointmentBooking;