"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Hash,
  CalendarDays,
  CalendarCheck,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

const RescheduleAppointmentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('id');
  
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions
  const formatDateToLocalString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else {
      toast.error('No appointment selected');
      router.push('/admin/allAppointments');
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Fetch appointment details
      const response = await axios.get(`${BACKEND_URL}/api/appointments/${appointmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const appointmentData = response.data.data;
        setAppointment(appointmentData);
        
        // Set initial selected date from existing appointment
        const existingDate = formatDateToLocalString(appointmentData.appointmentDate);
        setSelectedDate(existingDate);
        
        // Fetch doctor details and available slots
        fetchDoctorAndSlots(appointmentData.doctorId._id || appointmentData.doctorId, existingDate);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
      router.push('/admin/allAppointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAndSlots = async (doctorId, existingDate) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Fetch doctor details
      const doctorResponse = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (doctorResponse.data.success) {
        setDoctor(doctorResponse.data.data);
      }
      
      // Fetch available slots for this doctor
      await fetchAvailableSlots(doctorId, existingDate);
      
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor information');
    }
  };

  const fetchAvailableSlots = async (doctorId, existingDate = null) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${BACKEND_URL}/api/doctors/${doctorId}/available-slots`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        const slots = response.data.data || [];
        
        // Filter out only available slots (not booked or processing)
        const availableOnly = slots.filter(slot => 
          slot.status === 'available'
        );
        
        // Process slots with serial numbers
        const slotsWithSerial = availableOnly.map(slot => ({
          ...slot,
          serialNumber: slot.serialNumber || 0
        }));
        
        // Sort all slots by date and time
        slotsWithSerial.sort((a, b) => {
          if (a.date === b.date) {
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
          }
          return new Date(a.date) - new Date(b.date);
        });
        
        setAvailableSlots(slotsWithSerial);
        
        // Pre-select the existing appointment slot if available
        if (existingDate && appointment) {
          const existingSlot = slotsWithSerial.find(slot => 
            slot.date === existingDate && 
            slot.startTime === appointment.appointmentTime
          );
          
          if (existingSlot) {
            setSelectedTime(existingSlot);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available slots');
    }
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
    const startDay = firstDay.getDay();
    
    const today = new Date();
    const todayLocal = formatDateToLocalString(today);
    
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
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

  // Handle reschedule submission
  // const handleReschedule = async (e) => {
  //   e.preventDefault();
    
  //   if (!selectedDate || !selectedTime) {
  //     toast.error('Please select a new date and time slot');
  //     return;
  //   }
    
  //   if (!appointment) {
  //     toast.error('Appointment data not found');
  //     return;
  //   }
    
  //   // Confirm with user before rescheduling
  //   if (!window.confirm(`Are you sure you want to reschedule ${appointment.patient.fullName}'s appointment?\n\nFrom: ${new Date(appointment.appointmentDate).toLocaleDateString()} ${appointment.appointmentTime}\nTo: ${selectedSlotInfo?.formattedDate} ${selectedTime.startTime}`)) {
  //     return;
  //   }
    
  //   setSubmitting(true);
    
  //   try {
  //     const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  //     const token = localStorage.getItem('token');
  //     const doctorId = appointment.doctorId._id || appointment.doctorId;
      
  //     console.log('🔄 Starting reschedule process...');
      
  //     // 1. Free up the old slot (set to available)
  //     console.log('📝 Freeing old slot:', appointment.slotId);
  //     await axios.put(
  //       `${BACKEND_URL}/api/doctors/${doctorId}/slots/${appointment.slotId}/status`,
  //       { 
  //         status: 'available',
  //         patientInfo: null 
  //       },
  //       { 
  //         headers: { 'Authorization': `Bearer ${token}` } 
  //       }
  //     );
      
  //     // 2. Book the new slot
  //     console.log('📝 Booking new slot:', selectedTime._id);
  //     await axios.put(
  //       `${BACKEND_URL}/api/doctors/${doctorId}/slots/${selectedTime._id}/status`,
  //       { 
  //         status: 'booked',
  //         patientInfo: {
  //           name: appointment.patient.fullName,
  //           phone: appointment.patient.phone,
  //           email: appointment.patient.email,
  //           appointmentId: appointment._id,
  //           serialNumber: selectedTime.serialNumber || 0
  //         }
  //       },
  //       { 
  //         headers: { 'Authorization': `Bearer ${token}` } 
  //       }
  //     );
      
  //     // 3. Update the appointment record
  //     console.log('📝 Updating appointment record');
  //     const updateData = {
  //       appointmentDate: selectedDate,
  //       appointmentTime: selectedTime.startTime,
  //       endTime: selectedTime.endTime,
  //       slotId: selectedTime._id,
  //       slotSerialNumber: selectedTime.serialNumber || 0,
  //       status: appointment.status // Keep existing status
  //     };
      
  //     const response = await axios.put(
  //       `${BACKEND_URL}/api/appointments/${appointmentId}`,
  //       updateData,
  //       { headers: { 'Authorization': `Bearer ${token}` } }
  //     );
      
  //     if (response.data.success) {
  //       toast.success(`Appointment #${selectedTime.serialNumber} rescheduled successfully!`);
        
  //       // Update local appointment state
  //       setAppointment(prev => ({
  //         ...prev,
  //         ...updateData
  //       }));
        
  //       // Refresh slots to reflect changes
  //       fetchAvailableSlots(doctorId);
        
  //       // Show success message and redirect
  //       setTimeout(() => {
  //         router.push('/admin/allAppointments');
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error('❌ Error rescheduling appointment:', error);
      
  //     // Provide specific error messages
  //     if (error.response) {
  //       const status = error.response.status;
  //       const data = error.response.data;
        
  //       if (status === 400) {
  //         toast.error(data.message || 'Invalid data provided');
  //       } else if (status === 404) {
  //         toast.error(data.message || 'Slot or appointment not found');
  //       } else if (status === 409) {
  //         toast.error('This time slot is no longer available. Please select another slot.');
  //         // Refresh slots
  //         if (doctor) {
  //           fetchAvailableSlots(doctor._id);
  //         }
  //       } else {
  //         toast.error('Failed to reschedule appointment. Please try again.');
  //       }
  //     } else if (error.request) {
  //       toast.error('Network error. Please check your connection.');
  //     } else {
  //       toast.error('An unexpected error occurred.');
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  // Update the handleReschedule function in your frontend component
const handleReschedule = async (e) => {
  e.preventDefault();
  
  if (!selectedDate || !selectedTime) {
    toast.error('Please select a new date and time slot');
    return;
  }
  
  if (!appointment) {
    toast.error('Appointment data not found');
    return;
  }
  
  // Confirm with user before rescheduling
  if (!window.confirm(`Are you sure you want to reschedule ${appointment.patient.fullName}'s appointment?\n\nFrom: ${new Date(appointment.appointmentDate).toLocaleDateString()} ${appointment.appointmentTime}\nTo: ${selectedSlotInfo?.formattedDate} ${selectedTime.startTime}`)) {
    return;
  }
  
  setSubmitting(true);
  
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const doctorId = appointment.doctorId._id || appointment.doctorId;
    
    console.log('🔄 Starting reschedule process...');
    
    // 1. Free up the old slot (set to available)
    console.log('📝 Freeing old slot:', appointment.slotId);
    await axios.put(
      `${BACKEND_URL}/api/doctors/${doctorId}/slots/${appointment.slotId}/status`,
      { 
        status: 'available',
        patientInfo: null 
      },
      { 
        headers: { 'Authorization': `Bearer ${token}` } 
      }
    );
    
    // 2. Book the new slot
    console.log('📝 Booking new slot:', selectedTime._id);
    await axios.put(
      `${BACKEND_URL}/api/doctors/${doctorId}/slots/${selectedTime._id}/status`,
      { 
        status: 'booked',
        patientInfo: {
          name: appointment.patient.fullName,
          phone: appointment.patient.phone,
          email: appointment.patient.email,
          appointmentId: appointment._id,
          serialNumber: selectedTime.serialNumber || 0
        }
      },
      { 
        headers: { 'Authorization': `Bearer ${token}` } 
      }
    );
    
    // 3. Update the appointment record
    console.log('📝 Updating appointment record');
    const updateData = {
      appointmentDate: selectedDate,
      appointmentTime: selectedTime.startTime,
      endTime: selectedTime.endTime,
      slotId: selectedTime._id,
      slotSerialNumber: selectedTime.serialNumber || 0,
      status:  'confirmed'  
    };
    
    const response = await axios.put(
      `${BACKEND_URL}/api/appointments/${appointmentId}`,
      updateData,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      console.log('✅ Appointment rescheduled successfully!');
      
      // 4. Send reschedule email to patient
      try {
        console.log('📧 Preparing to send reschedule email...');
        
        const emailData = {
          patient: appointment.patient,
          doctor: appointment.doctorInfo,
          oldAppointmentDate: appointment.appointmentDate,
          oldAppointmentTime: appointment.appointmentTime,
          newAppointmentDate: selectedDate,
          newAppointmentTime: selectedTime.startTime,
          slotSerialNumber: selectedTime.serialNumber || 0,
          appointmentId: appointment._id,
          remarks: `Appointment rescheduled by clinic staff. New serial number: #${selectedTime.serialNumber || 0}`
        };
        
        // Send reschedule email
        const emailResponse = await axios.post(
          `${BACKEND_URL}/api/appointments/${appointmentId}/send-reschedule-email`,
          emailData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        if (emailResponse.data.success) {
          console.log('✅ Reschedule email sent successfully!');
          toast.success(`Appointment #${selectedTime.serialNumber} rescheduled and email sent to patient!`);
        } else {
          console.log('⚠️ Email sending failed:', emailResponse.data.error);
          toast.success(`Appointment #${selectedTime.serialNumber} rescheduled successfully! (Email not sent)`);
        }
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
        toast.success(`Appointment #${selectedTime.serialNumber} rescheduled successfully!`);
      }
      
      // Update local appointment state
      setAppointment(prev => ({
        ...prev,
        ...updateData
      }));
      
      // Refresh slots to reflect changes
      fetchAvailableSlots(doctorId);
      
      // Show success message and redirect
      setTimeout(() => {
        router.push('/admin/allAppointments');
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Error rescheduling appointment:', error);
    
    // Provide specific error messages
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        toast.error(data.message || 'Invalid data provided');
      } else if (status === 404) {
        toast.error(data.message || 'Slot or appointment not found');
      } else if (status === 409) {
        toast.error('This time slot is no longer available. Please select another slot.');
        // Refresh slots
        if (doctor) {
          fetchAvailableSlots(doctor._id);
        }
      } else {
        toast.error('Failed to reschedule appointment. Please try again.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
  } finally {
    setSubmitting(false);
  }
};

  // Refresh available slots
  const refreshSlots = async () => {
    if (!doctor) return;
    
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      toast.loading('Refreshing available slots...', { id: 'refresh' });
      
      await fetchAvailableSlots(doctor._id, selectedDate);
      
      toast.success(`Loaded ${availableSlots.length} available slots`, { id: 'refresh' });
    } catch (error) {
      console.error('Error refreshing slots:', error);
      toast.error('Failed to refresh slots', { id: 'refresh' });
    }
  };

  // Reset to original appointment
  const resetToOriginal = () => {
    if (!appointment) return;
    
    const originalDate = formatDateToLocalString(appointment.appointmentDate);
    setSelectedDate(originalDate);
    setSelectedTime(null);
    
    // Try to find and select the original slot
    const originalSlot = availableSlots.find(slot => 
      slot.date === originalDate && 
      slot.startTime === appointment.appointmentTime
    );
    
    if (originalSlot) {
      setSelectedTime(originalSlot);
      toast.success('Reset to original appointment time');
    } else {
      toast.info('Original slot is no longer available');
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
              <h3 className="text-xl font-semibold text-slate-800">Loading Appointment Details</h3>
              <p className="text-slate-600 mt-2">Preparing reschedule options...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Not Found</h2>
            <p className="text-slate-600 mb-6">The appointment you're looking for might not be available.</p>
            <Link
              href="/admin/allAppointments"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/allAppointments"
                className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reschedule Appointment</h1>
                <p className="text-slate-600 mt-1">Change date and time for {appointment.patient.fullName}'s appointment</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
             
              <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" />
                Appointment ID: {appointmentId?.substring(0, 8)}...
              </div>
            </div>
          </div>
          
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${
            appointment.status === 'confirmed' ? 'bg-emerald-50 border-emerald-200' :
            appointment.status === 'pending' ? 'bg-amber-50 border-amber-200' :
            appointment.status === 'cancelled' ? 'bg-red-50 border-red-200' :
            'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                  appointment.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {appointment.status === 'confirmed' && <CheckCircle className="w-5 h-5" />}
                  {appointment.status === 'pending' && <Clock className="w-5 h-5" />}
                  {appointment.status === 'cancelled' && <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-medium text-slate-800">Current Status</div>
                  <div className="text-sm text-slate-600">
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} • 
                    Serial #{appointment.slotSerialNumber || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Created: {new Date(appointment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Current Appointment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              Current Appointment Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Patient Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{appointment.patient.fullName}</div>
                      <div className="text-sm text-slate-600">
                        {appointment.patient.gender} • {new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()} years
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-700">
                      <Mail className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <div className="text-sm">{appointment.patient.email}</div>
                    </div>
                    
                    <div className="flex items-center text-slate-700">
                      <Phone className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <div className="text-sm">{appointment.patient.phone}</div>
                    </div>
                    
                    {appointment.patient.address && (
                      <div className="flex items-start text-slate-700">
                        <MapPin className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{appointment.patient.address}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-sm font-medium text-slate-700 mb-2">Reason for Visit</div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {appointment.patient.reason}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Current Schedule</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">Current Date & Time</span>
                      </div>
                      <div className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                        Serial No : {appointment.slotSerialNumber || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-lg font-semibold text-amber-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-lg font-semibold text-amber-900">
                        {appointment.appointmentTime} - {appointment.endTime}
                      </div>
                      <div className="text-sm text-amber-700">
                        Duration: {appointment.doctorInfo.perPatientTime || 15} minutes
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-3">Doctor Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-slate-500" />
                        <div className="text-sm font-medium text-slate-800">Dr. {appointment.doctorInfo.name}</div>
                      </div>
                      <div className="text-sm text-slate-600">{appointment.doctorInfo.speciality}</div>
                      <div className="text-sm text-slate-600">{appointment.doctorInfo.designation}</div>
                      <div className="text-sm text-slate-600">{appointment.doctorInfo.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time Selection for Reschedule */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-600" />
                Select New Date & Time
              </h2>
              <div className="mt-2 md:mt-0">
                <button
                  onClick={refreshSlots}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Available Slots
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Select New Date</span>
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
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Select New Time</span>
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
          
          {/* New Appointment Summary & Action */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* New Appointment Summary */}
            {selectedSlotInfo && (
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5" />
                  New Appointment Details
                </h4>
                
                {/* Comparison */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-lg">
                    <div className="text-sm text-slate-600">Current Serial</div>
                    <div className="text-lg font-bold text-amber-600">#{appointment.slotSerialNumber || 'N/A'}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-emerald-100 border border-emerald-300 rounded-lg">
                    <div className="text-sm text-emerald-700">New Serial</div>
                    <div className="text-lg font-bold text-emerald-800">#{selectedSlotInfo.serialNumber}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs text-emerald-700 font-medium">Date</div>
                      <div className="text-sm font-medium text-emerald-800">
                        {selectedSlotInfo.formattedDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs text-emerald-700 font-medium">Time</div>
                      <div className="text-sm font-medium text-emerald-800">
                        {selectedSlotInfo.formattedTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    Duration: {selectedSlotInfo.duration} minutes
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-200">
                    <div className="text-xs text-emerald-700 font-medium mb-1">Doctor</div>
                    <div className="text-sm font-medium text-emerald-800">
                      Dr. {appointment.doctorInfo.name} - {appointment.doctorInfo.speciality}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setShowDatePicker(true);
                    setShowTimePicker(false);
                  }}
                  className="mt-6 w-full px-4 py-2 text-sm border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium"
                >
                  Change Selection
                </button>
              </div>
            )}

            {/* Action Section */}
            <div className="space-y-6">
              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Notes
                </h4>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>The original appointment slot will be freed up and made available to other patients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Patient will be notified of the schedule change</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Appointment status will remain as "{appointment.status}"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>All appointment history will be preserved</span>
                  </li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="space-y-3">
                  <button
                    onClick={handleReschedule}
                    disabled={submitting || !selectedDate || !selectedTime}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-md hover:shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Rescheduling...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-5 h-5" />
                        <span>Confirm Reschedule</span>
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* <button
                      onClick={resetToOriginal}
                      className="px-4 py-3 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button> */}
                    
                    <Link
                      href="/admin/allAppointments"
                      className="px-4 py-3 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Cancel
                    </Link>
                  </div>
                </div>
                
                {/* Summary */}
                {selectedSlotInfo && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 mb-2">Reschedule Summary</div>
                    <div className="text-sm font-medium text-slate-800">
                      Changing from <span className="text-amber-600">Slot #{appointment.slotSerialNumber || 'N/A'}</span> 
                      {' '}to{' '}
                      <span className="text-emerald-600">Slot #{selectedSlotInfo.serialNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentPage;