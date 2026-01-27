"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${BACKEND_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async (doctorId) => {
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      toast.loading('Generating time slots...', { id: 'slots' });
      
      const response = await axios.post(
        `${BACKEND_URL}/api/doctors/${doctorId}/generate-slots`,
        { days: 30 },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Generated ${response.data.data.slots.length} slots for 30 days!`, { id: 'slots' });
        fetchDoctors();
      }
    } catch (error) {
      console.error('Error generating slots:', error);
      if (error.response) {
        toast.error(`Error: ${error.response.data?.message || 'Failed to generate slots'}`, { id: 'slots' });
      } else {
        toast.error('Failed to generate slots', { id: 'slots' });
      }
    }
  };

  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) return;
    
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.delete(
        `${BACKEND_URL}/api/doctors/${doctorId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Dr. ${doctorName} deleted successfully`);
        fetchDoctors();
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast.error('Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Doctors Management</h1>
              <p className="text-slate-600 mt-1">Manage all healthcare professionals and their schedules</p>
            </div>
            <Link
              href="/admin/createService"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center shadow-md hover:shadow-lg"
            >
              <span className="text-lg font-semibold">+</span>
              <span>Add New Doctor</span>
            </Link>
          </div>
        </div>

        {/* Search and Stats Bar */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search doctors by name, specialty, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white shadow-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="text-emerald-400 text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No doctors found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first doctor'}
            </p>
            <Link
              href="/admin/createService"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <span>+ Add Doctor</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Doctor Header - Square Image */}
                <div className="relative">
                  <div className="h-56 bg-white flex items-center justify-center">
                    {doctor.image?.url ? (
                      <img 
                        src={doctor.image.url} 
                        alt={doctor.name}
                        className="w-full h-full rounded-lg p-2 object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl text-emerald-400 mb-2">
                          👨‍⚕️
                        </div>
                        <div className="text-emerald-600 font-medium">No Image</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                      {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                    </div>
                  </div>
                  
                  {/* Specialty Tag */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm rounded-lg font-medium shadow-md">
                      {doctor.speciality || "Cardiology"}
                    </span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-5">
                  {/* Name and Designation */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900 truncate">{doctor.name}</h3>
                    <p className="text-emerald-600 text-sm font-medium mb-2">{doctor.designation || "Medical Specialist"}</p>
                  
                  </div>

                  {/* Contact Information - NO background colors */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-slate-700">
                      <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <div>
                     
                        <span className="text-sm truncate text-slate-800">{doctor.email || "No email"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-700">
                      <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <div>
                    
                        <span className="text-sm text-slate-800">{doctor.phone || "Not provided"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        <div>
                         
                          <span className="text-sm text-slate-800">{doctor.perPatientTime || 15} minutes</span>
                        </div>
                      </div>
                    
                    </div>
                  </div>

                  {/* Slots Information */}
                  <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg p-4 mb-5 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Available Slots</p>
                        <p className="text-2xl font-bold text-slate-900">{doctor.timeSlots?.length || 0}</p>
                      </div>
                      <button
                        onClick={() => generateSlots(doctor._id)}
                        className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-all ${
                          doctor.timeSlots?.length > 0 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                        } ${!doctor.schedule?.some(s => s.isWorking) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!doctor.schedule?.some(s => s.isWorking)}
                        title={!doctor.schedule?.some(s => s.isWorking) ? "Set working schedule first" : ""}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/>
                        </svg>
                        {doctor.timeSlots?.length > 0 ? 'Regenerate' : 'Generate Slots'}
                      </button>
                    </div>
                    {doctor.lastSlotGeneration && (
                      <p className="text-xs text-slate-500">
                        Last updated: {new Date(doctor.lastSlotGeneration).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Book Appointment Button - Single Row */}
                  <div className="mb-4">
                    <button
                      onClick={() => {/* Add booking logic */}}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                      </svg>
                      Book Appointment
                    </button>
                  </div>

                  {/* Delete and Edit Buttons - Separate Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDeleteDoctor(doctor._id, doctor.name)}
                      className="px-3 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium border border-red-200 hover:border-red-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
                      </svg>
                      Delete
                    </button>
                    
                    <Link
                      href={`/admin/doctors/${doctor._id}/edit`}
                      className="px-3 py-2.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium border border-amber-200 hover:border-amber-300"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-1.414-1.414-11.313 11.314 1.414 1.416z"/>
                      </svg>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{doctors.length}</div>
                <div className="text-slate-600 text-sm font-medium">Total Doctors</div>
              </div>
              <div className="text-emerald-500 text-2xl bg-emerald-100 p-3 rounded-lg">👨‍⚕️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {doctors.filter(d => d.status === 'active').length}
                </div>
                <div className="text-slate-600 text-sm font-medium">Active</div>
              </div>
              <div className="text-emerald-500 text-2xl bg-emerald-100 p-3 rounded-lg">✅</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {doctors.filter(d => d.status === 'on_leave').length}
                </div>
                <div className="text-slate-600 text-sm font-medium">On Leave</div>
              </div>
              <div className="text-amber-500 text-2xl bg-amber-100 p-3 rounded-lg">🏖️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-teal-50 rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-teal-700">
                  {doctors.reduce((total, doctor) => total + (doctor.timeSlots?.length || 0), 0)}
                </div>
                <div className="text-slate-600 text-sm font-medium">Total Slots</div>
              </div>
              <div className="text-teal-500 text-2xl bg-teal-100 p-3 rounded-lg">📅</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;