"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  MapPin, 
  Clock, 
  Calendar,
  Search,
  Filter,
  User
} from 'lucide-react';

const BookApp = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('all');
  
  // Get unique specialities for filter
  const specialities = ['all', ...new Set(doctors.map(doctor => doctor.speciality))];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpeciality, doctors]);

  const fetchDoctors = async () => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${BACKEND_URL}/api/doctors`);
      
      if (response.data.success) {
        // Only show active doctors to clients
        const activeDoctors = response.data.data.filter(d => d.status === 'active');
        setDoctors(activeDoctors);
        setFilteredDoctors(activeDoctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let result = doctors;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by speciality
    if (selectedSpeciality !== 'all') {
      result = result.filter(doctor => 
        doctor.speciality.toLowerCase() === selectedSpeciality.toLowerCase()
      );
    }

    setFilteredDoctors(result);
  };

  const getWorkingDays = (schedule) => {
    if (!schedule) return [];
    return schedule
      .filter(day => day.isWorking && day.startTime && day.endTime)
      .map(day => day.day);
  };

  const getDaysGrid = (daysArray) => {
    if (daysArray.length === 0) return [];
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return daysArray
      .filter(day => dayOrder.includes(day))
      .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-6">
        <Toaster position="top-right" />
        <div className="flex justify-center items-center h-96">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
    const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'on_leave': return 'bg-amber-100 text-amber-800 border border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Find & Book Your Doctor
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Choose from our expert medical professionals and schedule your appointment in minutes
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors by name, specialty, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Speciality Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <select
                  value={selectedSpeciality}
                  onChange={(e) => setSelectedSpeciality(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white appearance-none"
                >
                  <option value="all">All Specialities</option>
                  {specialities.filter(s => s !== 'all').map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-slate-700">
                <span className="font-semibold text-emerald-600">{filteredDoctors.length}</span>
                <span className="text-slate-500 ml-2">
                  {filteredDoctors.length === 1 ? 'doctor available' : 'doctors available'}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                All doctors are verified professionals
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="text-emerald-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No doctors found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No doctors match "${searchTerm}". Try a different search term.`
                : 'Currently no doctors are available for appointments.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpeciality('all');
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const workingDays = getDaysGrid(getWorkingDays(doctor.schedule));
              
              return (
                <div key={doctor._id} className="flex flex-col h-full">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                    {/* Doctor Image - Fixed Height */}
                    <div className="relative h-48 bg-white">
                      {doctor.image?.url ? (
                        <img 
                          src={doctor.image.url} 
                          alt={doctor.name}
                          className="w-full p-3 rounded-2xl h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <User className="w-16 h-16 text-emerald-400 mx-auto mb-2" />
                            <div className="text-emerald-600 font-medium">Professional Photo</div>
                          </div>
                        </div>
                      )}
                      

                           {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                      {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                    </div>
                  </div>
                  
                




                      {/* Speciality Badge */}
                      <div className="absolute bottom-4 left-4 mb-1">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm rounded-lg font-semibold shadow-lg">
                          {doctor.speciality}
                        </span>
                      </div>
                    </div>

                    {/* Doctor Info - Flex-grow to make cards equal height */}
                    <div className="p-5 flex-grow flex flex-col">
                      {/* Name and Designation */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">{doctor.name}</h3>
                        <p className="text-emerald-600 font-medium text-sm line-clamp-1">{doctor.designation}</p>
                      </div>

                      {/* Doctor Details with Icons */}
                      <div className="space-y-3 mb-4 flex-grow">
                        {/* Location */}
                        <div className="flex items-start text-slate-600">
                          <MapPin className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm line-clamp-2">{doctor.location || "Main Hospital"}</span>
                        </div>

                        {/* Consultation Time */}
                        <div className="flex items-center text-slate-600">
                          <Clock className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{doctor.perPatientTime} min</span>
                        </div>

                        {/* Available Days */}
                        <div className="flex items-start text-slate-600">
                          <Calendar className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            {workingDays.length === 0 ? (
                              <span className="text-sm text-slate-500 italic">Not available</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {workingDays.map((day, index) => {
                                  // Short form for days
                                  const dayShort = day.substring(0, 3);
                                  return (
                                    <span 
                                      key={index} 
                                      className="inline-flex items-center justify-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100"
                                    >
                                      {dayShort}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Book Appointment Button - Fixed at bottom */}
                      <Link
                        href={`/book-appointment/${doctor._id}`}
                        className="mt-4 block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                        </svg>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Need Help Booking?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                support@hospital.com
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                +1 (555) 123-4567
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                24/7 Support Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookApp;