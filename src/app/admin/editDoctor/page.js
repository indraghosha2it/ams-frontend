"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  Calendar, 
  Clock, 
  X, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  SkipForward,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const EditDoctorPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [originalImage, setOriginalImage] = useState('');
  
  // Modal state for slots generation
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [generatingSlots, setGeneratingSlots] = useState(false);
  const [slotDays, setSlotDays] = useState(30);
  
  // Initial form state with break times
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    designation: '',
    location: '',
    description: '',
    perPatientTime: 15,
    status: 'active',
    schedule: [
      { 
        day: 'Monday', 
        startTime: '09:00', 
        endTime: '17:00', 
        isWorking: true,
        breakTimes: [] 
      },
      { 
        day: 'Tuesday', 
        startTime: '09:00', 
        endTime: '17:00', 
        isWorking: true,
        breakTimes: [] 
      },
      { 
        day: 'Wednesday', 
        startTime: '09:00', 
        endTime: '17:00', 
        isWorking: true,
        breakTimes: [] 
      },
      { 
        day: 'Thursday', 
        startTime: '09:00', 
        endTime: '17:00', 
        isWorking: true,
        breakTimes: [] 
      },
      { 
        day: 'Friday', 
        startTime: '09:00', 
        endTime: '13:00', 
        isWorking: true,
        breakTimes: [] 
      },
      { 
        day: 'Saturday', 
        startTime: '', 
        endTime: '', 
        isWorking: false,
        breakTimes: [] 
      },
      { 
        day: 'Sunday', 
        startTime: '', 
        endTime: '', 
        isWorking: false,
        breakTimes: [] 
      },
    ],
    offDays: []
  });

  // Fetch doctor data on component mount
  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    } else {
      toast.error('No doctor ID provided');
      router.push('/admin/doctors');
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${BACKEND_URL}/api/doctors/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        const doctor = response.data.data;
        
        // Set original image for reference
        if (doctor.image?.url) {
          setOriginalImage(doctor.image.url);
          setPreview(doctor.image.url);
        }
        
        // Transform doctor data to form state
        const transformedSchedule = doctor.schedule?.map(schedule => ({
          day: schedule.day,
          startTime: schedule.startTime || '',
          endTime: schedule.endTime || '',
          isWorking: schedule.isWorking || false,
          breakTimes: schedule.breakTimes?.map(breakTime => ({
            startTime: breakTime.startTime || '',
            endTime: breakTime.endTime || ''
          })) || []
        })) || formData.schedule; // Fallback to default schedule
        
        setFormData({
          name: doctor.name || '',
          email: doctor.email || '',
          phone: doctor.phone || '',
          speciality: doctor.speciality || '',
          designation: doctor.designation || '',
          location: doctor.location || '',
          description: doctor.description || '',
          perPatientTime: doctor.perPatientTime || 15,
          status: doctor.status || 'active',
          schedule: transformedSchedule,
          offDays: doctor.offDays?.map(offDay => ({
            date: offDay.date || '',
            reason: offDay.reason || ''
          })) || []
        });
        
        toast.success('Doctor data loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor data');
      router.push('/admin/doctors');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle schedule changes
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    
    if (field === 'isWorking') {
      updatedSchedule[index][field] = value === 'true';
      if (!value) {
        updatedSchedule[index].startTime = '';
        updatedSchedule[index].endTime = '';
        updatedSchedule[index].breakTimes = [];
      }
    } else {
      updatedSchedule[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      schedule: updatedSchedule
    }));
  };

  // Add break time to a specific day
  const addBreakTime = (dayIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].breakTimes.push({
      startTime: '12:00',
      endTime: '13:00'
    });
    
    setFormData(prev => ({
      ...prev,
      schedule: updatedSchedule
    }));
  };

  // Remove break time from a specific day
  const removeBreakTime = (dayIndex, breakIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].breakTimes = updatedSchedule[dayIndex].breakTimes.filter(
      (_, index) => index !== breakIndex
    );
    
    setFormData(prev => ({
      ...prev,
      schedule: updatedSchedule
    }));
  };

  // Handle break time change
  const handleBreakTimeChange = (dayIndex, breakIndex, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].breakTimes[breakIndex][field] = value;
    
    setFormData(prev => ({
      ...prev,
      schedule: updatedSchedule
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setPreview(originalImage);
  };

  // Add off day
  const addOffDay = () => {
    setFormData(prev => ({
      ...prev,
      offDays: [...prev.offDays, { date: '', reason: '' }]
    }));
  };

  // Remove off day
  const removeOffDay = (index) => {
    const updatedOffDays = formData.offDays.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      offDays: updatedOffDays
    }));
  };

  // Handle off day change
  const handleOffDayChange = (index, field, value) => {
    const updatedOffDays = [...formData.offDays];
    updatedOffDays[index][field] = value;
    setFormData(prev => ({
      ...prev,
      offDays: updatedOffDays
    }));
  };

  // Function to upload image to ImageBB
  const uploadImageToImageBB = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);
      
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        return {
          url: response.data.data.url,
          public_id: response.data.data.id
        };
      }
      throw new Error('Failed to upload image to ImageBB');
    } catch (error) {
      console.error('ImageBB upload error:', error);
      throw error;
    }
  };

  // Generate slots for the doctor
  const generateSlotsForDoctor = async () => {
    try {
      setGeneratingSlots(true);
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      toast.loading('Generating time slots...', { id: 'slot-generation' });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/doctors/${doctorId}/generate-slots`,
        { days: slotDays },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Generated ${response.data.data.slots.length} slots for ${slotDays} days!`, { 
          id: 'slot-generation',
          duration: 4000 
        });
        
        // Close modal after delay
        setTimeout(() => {
          setShowSlotModal(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error generating slots:', error);
      
      if (error.response) {
        toast.error(`Error: ${error.response.data?.message || 'Failed to generate slots'}`, { id: 'slot-generation' });
      } else {
        toast.error('Failed to generate slots', { id: 'slot-generation' });
      }
    } finally {
      setGeneratingSlots(false);
    }
  };

  // Skip slot generation
  const skipSlotGeneration = () => {
    setShowSlotModal(false);
  };

  // Handle form submission (UPDATE)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Basic email validation
//     const validateEmail = (email) => {
//       const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return re.test(email);
//     };
    
//     if (!formData.email.trim()) {
//       toast.error('Email is required.');
//       return;
//     }
    
//     if (!validateEmail(formData.email)) {
//       toast.error('Please enter a valid email address.');
//       return;
//     }
    
//     // Validate required fields
//     if (!formData.name.trim()) {
//       toast.error('Doctor name is required.');
//       return;
//     }
    
//     if (!formData.speciality.trim()) {
//       toast.error('Speciality is required.');
//       return;
//     }
    
//     if (!formData.designation.trim()) {
//       toast.error('Designation is required.');
//       return;
//     }
    
//     if (!formData.location.trim()) {
//       toast.error('Location is required.');
//       return;
//     }
    
//     setUpdating(true);

//     try {
//       // Upload image to ImageBB if new image selected
//       let imageData = null;
//       if (image) {
//         toast.loading('Uploading image...', { id: 'image-upload' });
//         try {
//           imageData = await uploadImageToImageBB(image);
//           toast.success('Image uploaded successfully!', { id: 'image-upload' });
//         } catch (uploadError) {
//           toast.error('Failed to upload image. Keeping existing image.', { id: 'image-upload' });
//           console.error('Image upload failed:', uploadError);
//         }
//       }

//       // Create doctor data for update
//       const doctorData = {
//         name: formData.name.trim(),
//         email: formData.email.trim().toLowerCase(),
//         phone: formData.phone.trim() || '',
//         speciality: formData.speciality.trim(),
//         designation: formData.designation.trim(),
//         location: formData.location.trim(),
//         description: formData.description.trim(),
//         perPatientTime: Number(formData.perPatientTime) || 15,
//         status: formData.status,
//         schedule: formData.schedule.map(day => ({
//           day: day.day,
//           startTime: day.isWorking ? day.startTime || '09:00' : '',
//           endTime: day.isWorking ? day.endTime || '17:00' : '',
//           isWorking: day.isWorking,
//           breakTimes: day.isWorking ? day.breakTimes : []
//         })),
//         offDays: formData.offDays.map(offDay => ({
//           date: offDay.date,
//           reason: offDay.reason?.trim() || ''
//         }))
//       };

//       // Add image data if new image uploaded
//       if (imageData) {
//         doctorData.image = {
//           url: imageData.url,
//           public_id: imageData.public_id
//         };
//       } else if (originalImage) {
//         // Keep existing image
//         doctorData.image = {
//           url: originalImage,
//           public_id: formData.image?.public_id || ''
//         };
//       }

//       console.log('📤 Sending doctor update data:', doctorData);
      
//       const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
//       const token = localStorage.getItem('token');
      
//       // Check if token exists
//       if (!token) {
//         toast.error('Authentication token not found. Please login again.');
//         router.push('/login');
//         setUpdating(false);
//         return;
//       }
      
//       // Make the API call with a timeout
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000);
      
//       try {
//         const response = await axios.put(
//           `${BACKEND_URL}/api/doctors/${doctorId}`,
//           doctorData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             signal: controller.signal
//           }
//         );
        
//         clearTimeout(timeoutId);
        
//         console.log('✅ Success! Response:', response.data);
        
//         if (response.data.success) {
//           const doctor = response.data.data;
          
//           toast.success('Doctor updated successfully!');
          
//           // Show the slot generation modal
//           setTimeout(() => {
//             setShowSlotModal(true);
//           }, 1000);
//         }
//       } catch (requestError) {
//         clearTimeout(timeoutId);
//         throw requestError;
//       }
//     } catch (error) {
//       console.error('❌ Error updating doctor:', error);
      
//       // Handle different types of errors
//       if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
//         toast.error('Request timeout. Please try again.', {
//           duration: 5000,
//           icon: '⏰'
//         });
//       } else if (error.response) {
//         // Server responded with an error status
//         const status = error.response.status;
//         let errorMessage = 'Failed to update doctor';
        
//         // Extract error message from response
//         const responseData = error.response.data;
        
//         if (typeof responseData === 'string') {
//           errorMessage = responseData;
//         } else if (responseData?.message) {
//           errorMessage = responseData.message;
//         } else if (responseData?.error) {
//           errorMessage = responseData.error;
//         } else if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
//           // Try to extract first error message from object
//           const firstKey = Object.keys(responseData)[0];
//           if (Array.isArray(responseData[firstKey])) {
//             errorMessage = responseData[firstKey][0] || errorMessage;
//           } else if (typeof responseData[firstKey] === 'string') {
//             errorMessage = responseData[firstKey];
//           }
//         }
        
//         const errorLower = errorMessage.toLowerCase();
        
//         // Check for duplicate email (if email was changed)
//         if (errorLower.includes('email') && 
//             (errorLower.includes('already exists') || 
//              errorLower.includes('duplicate') ||
//              errorLower.includes('already registered') ||
//              errorLower.includes('email already'))) {
//           toast.error('Email already exists. Please use a different email address.', {
//             duration: 5000,
//             icon: '⚠️'
//           });
//         } else if (status === 400) {
//           toast.error(`Validation Error: ${errorMessage}`);
//         } else if (status === 401) {
//           toast.error('Session expired. Please login again.', {
//             duration: 4000,
//             icon: '🔒'
//           });
//           setTimeout(() => {
//             router.push('/login');
//           }, 2000);
//         } else if (status === 403) {
//           toast.error('You do not have permission to update doctors.');
//         } else if (status === 404) {
//           toast.error('Doctor not found. It may have been deleted.');
//           setTimeout(() => {
//             router.push('/admin/doctors');
//           }, 2000);
//         } else if (status === 500) {
//           toast.error('Server error. Please try again later.');
//         } else {
//           toast.error(`Error ${status}: ${errorMessage}`);
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         toast.error('No response from server. Please check your internet connection.', {
//           duration: 5000,
//           icon: '📡'
//         });
//       } else {
//         // Something else happened
//         toast.error(error.message || 'Failed to update doctor');
//       }
//     } finally {
//       setUpdating(false);
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  if (!formData.email.trim()) {
    toast.error('Email is required.');
    return;
  }
  
  if (!validateEmail(formData.email)) {
    toast.error('Please enter a valid email address.');
    return;
  }
  
  // Validate required fields
  if (!formData.name.trim()) {
    toast.error('Doctor name is required.');
    return;
  }
  
  if (!formData.speciality.trim()) {
    toast.error('Speciality is required.');
    return;
  }
  
  if (!formData.designation.trim()) {
    toast.error('Designation is required.');
    return;
  }
  
  if (!formData.location.trim()) {
    toast.error('Location is required.');
    return;
  }
  
  setUpdating(true);

  try {
    // Upload image to ImageBB if new image selected
    let imageData = null;
    if (image) {
      toast.loading('Uploading image...', { id: 'image-upload' });
      try {
        imageData = await uploadImageToImageBB(image);
        toast.success('Image uploaded successfully!', { id: 'image-upload' });
      } catch (uploadError) {
        toast.error('Failed to upload image. Keeping existing image.', { id: 'image-upload' });
        console.error('Image upload failed:', uploadError);
      }
    }

    // Create doctor data for update - ONLY SEND UPDATABLE FIELDS
    const doctorData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || '',
      speciality: formData.speciality.trim(),
      designation: formData.designation.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      perPatientTime: Number(formData.perPatientTime) || 15,
      status: formData.status,
      schedule: formData.schedule.map(day => ({
        day: day.day,
        startTime: day.isWorking ? day.startTime || '09:00' : '',
        endTime: day.isWorking ? day.endTime || '17:00' : '',
        isWorking: day.isWorking,
        breakTimes: day.isWorking ? day.breakTimes : []
      })),
      offDays: formData.offDays.map(offDay => ({
        date: offDay.date,
        reason: offDay.reason?.trim() || ''
      }))
    };

    // Add image data if new image uploaded
    if (imageData) {
      doctorData.image = {
        url: imageData.url,
        public_id: imageData.public_id
      };
    } else if (originalImage && !image) {
      // If no new image but original exists, keep it
      doctorData.image = {
        url: originalImage,
        public_id: formData.image?.public_id || ''
      };
    }

    console.log('📤 Sending doctor update data:', doctorData);
    
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      router.push('/login');
      setUpdating(false);
      return;
    }
    
    // Show loading toast
    toast.loading('Updating doctor profile...', { id: 'update-doctor' });
    
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/doctors/${doctorId}`,
        doctorData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      console.log('✅ Success! Response:', response.data);
      
      if (response.data.success) {
        toast.success('Doctor updated successfully!', { id: 'update-doctor' });
        
        // Show the slot generation modal
        setTimeout(() => {
          setShowSlotModal(true);
        }, 1000);
      }
    } catch (requestError) {
      // Dismiss loading toast
      toast.dismiss('update-doctor');
      
      throw requestError;
    }
  } catch (error) {
    console.error('❌ Error updating doctor:', error);
    
    // Handle different types of errors
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.', {
        duration: 5000,
        icon: '⏰'
      });
    } else if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      let errorMessage = 'Failed to update doctor';
      
      // Extract error message from response
      const responseData = error.response.data;
      
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
        // Try to extract first error message from object
        const firstKey = Object.keys(responseData)[0];
        if (Array.isArray(responseData[firstKey])) {
          errorMessage = responseData[firstKey][0] || errorMessage;
        } else if (typeof responseData[firstKey] === 'string') {
          errorMessage = responseData[firstKey];
        }
      }
      
      const errorLower = errorMessage.toLowerCase();
      
      // Check for duplicate email
      if (errorLower.includes('email') && 
          (errorLower.includes('already exists') || 
           errorLower.includes('duplicate') ||
           errorLower.includes('already registered') ||
           errorLower.includes('email already'))) {
        toast.error('Email already exists. Please use a different email address.', {
          duration: 5000,
          icon: '⚠️'
        });
      } else if (status === 400) {
        // Show more detailed validation errors
        if (responseData.message && responseData.message.includes('Validation error:')) {
          toast.error(responseData.message, {
            duration: 6000,
            icon: '📋'
          });
        } else {
          toast.error(`Validation Error: ${errorMessage}`, {
            duration: 5000,
            icon: '⚠️'
          });
        }
      } else if (status === 401) {
        toast.error('Session expired. Please login again.', {
          duration: 4000,
          icon: '🔒'
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (status === 403) {
        toast.error('You do not have permission to update doctors.');
      } else if (status === 404) {
        toast.error('Doctor not found. It may have been deleted.');
        setTimeout(() => {
          router.push('/admin/doctors');
        }, 2000);
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Error ${status}: ${errorMessage}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('No response from server. Please check your internet connection.', {
        duration: 5000,
        icon: '📡'
      });
    } else {
      // Something else happened
      toast.error(error.message || 'Failed to update doctor');
    }
  } finally {
    setUpdating(false);
  }
};

  // Reset form to original data
  const handleReset = () => {
    fetchDoctor();
    toast.success('Form reset to original values');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-800">Loading Doctor Information</h3>
              <p className="text-slate-600 mt-2">Please wait while we fetch the doctor's details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <Toaster position="top-right" />
      
      {/* Slot Generation Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Calendar className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Generate Time Slots</h3>
                    <p className="text-slate-600 text-sm">For Dr. {formData.name}</p>
                  </div>
                </div>
                <button
                  onClick={skipSlotGeneration}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="size-5 text-slate-500" />
                </button>
              </div>
              
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="size-5 text-emerald-600" />
                  <p className="text-emerald-700 text-sm font-medium">
                    Doctor profile updated successfully! Regenerate appointment slots if needed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Schedule Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="size-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Per Patient Time</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      {formData.perPatientTime} minutes
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Working Days</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formData.schedule.filter(s => s.isWorking).length} days
                    </span>
                  </div>
                </div>
                
                {/* Days Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Generate slots for how many days?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[7, 14, 30, 60, 90].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setSlotDays(days)}
                        className={`py-2 rounded-lg border transition-all ${
                          slotDays === days
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                            : 'border-slate-300 hover:border-emerald-300 text-slate-600'
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSlotDays(120)}
                      className={`py-2 rounded-lg border transition-all ${
                        slotDays === 120
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                          : 'border-slate-300 hover:border-emerald-300 text-slate-600'
                      }`}
                    >
                      120 days
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={skipSlotGeneration}
                disabled={generatingSlots}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <SkipForward className="size-4" />
                Skip for Now
              </button>
              
              <button
                onClick={generateSlotsForDoctor}
                disabled={generatingSlots}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {generatingSlots ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="size-4" />
                    Generate Slots
                  </>
                )}
              </button>
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
                href="/admin/doctors"
                className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="size-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">update Doctor Profile</h1>
                <p className="text-slate-600 mt-1">Update doctor information, schedule, and availability</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              Doctor ID: {doctorId?.substring(0, 8)}...
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Dr. John Smith"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="doctor@hospital.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Speciality *
                  </label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    placeholder="MD, Cardiologist"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Hospital name, floor, room number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Professional background, experience, achievements..."
                />
              </div>
            </div>

            {/* Right Column - Image, Time & Status */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-4">Profile Image</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 relative">
                    {preview ? (
                      <>
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG up to 5MB</p>
                    {image && (
                      <div className="mt-2 text-sm text-emerald-600 flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {image.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Per Patient Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Per Patient Time *
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      name="perPatientTime"
                      min="10"
                      max="60"
                      step="5"
                      value={formData.perPatientTime}
                      onChange={handleChange}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>10 min</span>
                      <span>35 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                  <div className="min-w-[80px] text-center">
                    <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
                      {formData.perPatientTime} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-white"
                >
                  <option value="active" className="text-emerald-600">🟢 Active</option>
                  <option value="inactive" className="text-slate-500">⚫ Inactive</option>
                  <option value="on_leave" className="text-amber-600">🟡 On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 border-slate-200 mb-6">Weekly Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.schedule.map((daySchedule, index) => (
                <div key={daySchedule.day} className={`border rounded-xl p-4 ${daySchedule.isWorking ? 'bg-white border-emerald-200' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-800">{daySchedule.day}</h3>
                    <select
                      value={daySchedule.isWorking}
                      onChange={(e) => handleScheduleChange(index, 'isWorking', e.target.value)}
                      className={`text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${daySchedule.isWorking ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-300'}`}
                    >
                      <option value={true}>Working Day</option>
                      <option value={false}>Day Off</option>
                    </select>
                  </div>
                  
                  {daySchedule.isWorking ? (
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1.5 font-medium">Start Time</label>
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1.5 font-medium">End Time</label>
                          <input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                      
                      {/* Break Times Section */}
                      <div className="mt-2 pt-4 border-t border-slate-200 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-medium text-slate-700">Break Times</label>
                          <button
                            type="button"
                            onClick={() => addBreakTime(index)}
                            className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Break
                          </button>
                        </div>
                        
                        {daySchedule.breakTimes.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-xs text-slate-500 text-center">No break times added</p>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="space-y-2">
                              {daySchedule.breakTimes.map((breakTime, breakIndex) => (
                                <div key={breakIndex} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                  <div className="flex-1 min-w-0">
                                    <input
                                      type="time"
                                      value={breakTime.startTime}
                                      onChange={(e) => handleBreakTimeChange(index, breakIndex, 'startTime', e.target.value)}
                                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                  </div>
                                  <span className="text-xs text-slate-400 shrink-0">to</span>
                                  <div className="flex-1 min-w-0">
                                    <input
                                      type="time"
                                      value={breakTime.endTime}
                                      onChange={(e) => handleBreakTimeChange(index, breakIndex, 'endTime', e.target.value)}
                                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeBreakTime(index, breakIndex)}
                                    className="text-xs px-2 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition shrink-0"
                                    title="Remove break"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center">
                              Breaks: {daySchedule.breakTimes.length}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl text-slate-400 mb-2">🏝️</div>
                        <span className="text-sm text-slate-500">Day Off</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Off Days */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Off Days (Holidays/Leave)</h2>
              <button
                type="button"
                onClick={addOffDay}
                className="px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Off Day
              </button>
            </div>
            
            {formData.offDays.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                <div className="text-slate-400 text-3xl mb-2">📅</div>
                <p className="text-slate-500">No off days added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.offDays.map((offDay, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-slate-200 rounded-lg bg-white">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Date</label>
                      <input
                        type="date"
                        value={offDay.date}
                        onChange={(e) => handleOffDayChange(index, 'date', e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Reason</label>
                      <input
                        type="text"
                        value={offDay.reason}
                        onChange={(e) => handleOffDayChange(index, 'reason', e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Holiday, Personal Leave, etc."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOffDay(index)}
                      className="mt-6 md:mt-0 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between space-x-4 pt-8 border-t border-slate-200">
            <div className="flex space-x-4">
              <Link
                href="/admin/doctors"
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Doctors
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Doctor</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Information Box */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-emerald-500 text-xl">💡</div>
            <div>
              <h3 className="font-semibold text-emerald-800 mb-2">Editing Tips</h3>
              <p className="text-emerald-700 text-sm mb-3">
                After updating the doctor's profile, you can regenerate time slots if you've changed 
                the schedule, working hours, or break times. The system will create new appointment 
                slots based on the updated schedule.
              </p>
              <ul className="text-emerald-700 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span><strong>Email:</strong> Changing email may require verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span><strong>Schedule Changes:</strong> Consider regenerating slots after schedule updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span><strong>Image:</strong> Upload new image or keep existing one</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorPage;