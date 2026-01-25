// src/app/staff/dashboard/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Eye,
  Edit3,
  MessageSquare,
  Phone,
  MapPin,
  Filter,
  ChevronRight,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function StaffDashboard() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('today');
  
  // Mock data for assigned appointments
  const assignedAppointments = [
    { 
      id: 1, 
      client: 'John Doe', 
      service: 'Haircut & Styling', 
      time: '10:00 AM - 11:00 AM', 
      status: 'confirmed',
      duration: '1 hour',
      clientPhone: '(123) 456-7890',
      clientEmail: 'john@example.com',
      notes: 'Regular customer, prefers scissor cut',
      rating: 4.8
    },
    { 
      id: 2, 
      client: 'Sarah Johnson', 
      service: 'Deep Tissue Massage', 
      time: '11:30 AM - 12:30 PM', 
      status: 'pending',
      duration: '1 hour',
      clientPhone: '(234) 567-8901',
      clientEmail: 'sarah@example.com',
      notes: 'First time client, mention Groupon',
      rating: null
    },
    { 
      id: 3, 
      client: 'Mike Chen', 
      service: 'Facial Treatment', 
      time: '2:00 PM - 3:00 PM', 
      status: 'confirmed',
      duration: '1 hour',
      clientPhone: '(345) 678-9012',
      clientEmail: 'mike@example.com',
      notes: 'Allergic to fragrances',
      rating: 4.9
    },
    { 
      id: 4, 
      client: 'Emma Wilson', 
      service: 'Manicure & Pedicure', 
      time: '3:30 PM - 4:30 PM', 
      status: 'cancelled',
      duration: '1 hour',
      clientPhone: '(456) 789-0123',
      clientEmail: 'emma@example.com',
      notes: 'Prefers gel polish',
      rating: 4.7
    },
    { 
      id: 5, 
      client: 'Robert Brown', 
      service: 'Beard Trim', 
      time: '5:00 PM - 5:30 PM', 
      status: 'confirmed',
      duration: '30 mins',
      clientPhone: '(567) 890-1234',
      clientEmail: 'robert@example.com',
      notes: 'Quick trim only',
      rating: 4.5
    },
  ];

  // Today's schedule timeline
  const todaysSchedule = [
    { time: '9:00 AM', client: 'Opening', service: 'Setup', type: 'setup' },
    { time: '10:00 AM', client: 'John Doe', service: 'Haircut', status: 'upcoming' },
    { time: '11:30 AM', client: 'Sarah Johnson', service: 'Massage', status: 'upcoming' },
    { time: '1:00 PM', client: 'Lunch Break', service: 'Break', type: 'break' },
    { time: '2:00 PM', client: 'Mike Chen', service: 'Facial', status: 'upcoming' },
    { time: '3:30 PM', client: 'Emma Wilson', service: 'Manicure', status: 'upcoming' },
    { time: '5:00 PM', client: 'Robert Brown', service: 'Beard Trim', status: 'upcoming' },
    { time: '6:00 PM', client: 'Closing', service: 'Cleanup', type: 'cleanup' },
  ];

  // Quick stats
  const quickStats = [
    { label: 'Total Appointments', value: '24', change: '+12%', trend: 'up' },
    { label: 'Completion Rate', value: '92%', change: '+3%', trend: 'up' },
    { label: 'Client Satisfaction', value: '4.7', change: '+0.2', trend: 'up' },
    { label: 'Revenue', value: '$2,850', change: '-5%', trend: 'down' },
  ];

  // Recent client reviews
  const recentReviews = [
    { client: 'John Doe', service: 'Haircut', rating: 5, comment: 'Excellent service as always!', date: 'Today' },
    { client: 'Lisa Smith', service: 'Massage', rating: 4, comment: 'Very relaxing experience', date: 'Yesterday' },
    { client: 'David Lee', service: 'Facial', rating: 5, comment: 'Skin feels amazing!', date: '2 days ago' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="size-4" />;
      case 'pending': return <AlertCircle className="size-4" />;
      case 'cancelled': return <XCircle className="size-4" />;
      default: return <Clock className="size-4" />;
    }
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    // In real app, this would call an API
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
    // Show success message
    alert(`Appointment status updated to ${newStatus}`);
  };

  const handleViewClient = (clientId) => {
    router.push(`/staff/clients/${clientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Staff!</h1>
            <p className="text-green-100">You have {assignedAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length} appointments today</p>
          </div>
          <div className="hidden md:block">
            <Clock className="size-24 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                index === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                index === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                {index === 0 ? <Calendar className="size-5" /> : 
                 index === 1 ? <CheckCircle className="size-5" /> :
                 index === 2 ? <Star className="size-5" /> :
                 <TrendingUp className="size-5" />}
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' ? 
                  <TrendingUp className="size-4 text-green-500" /> : 
                  <TrendingDown className="size-4 text-red-500" />}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assigned Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assigned Appointments</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your appointments for today</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700"
                  >
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">This Week</option>
                  </select>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Filter className="size-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client & Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
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
                  {assignedAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 size-10 rounded-full flex items-center justify-center">
                              <Users className="size-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {appointment.client}
                              {appointment.rating && (
                                <span className="ml-2 inline-flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                                  <Star className="size-3 mr-1 fill-current" />
                                  {appointment.rating}
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.service}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Phone className="size-3 inline mr-1" />
                              {appointment.clientPhone}
                            </p>
                            {appointment.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                Note: {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{appointment.time}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1.5 capitalize">{appointment.status}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClient(appointment.id)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View Client"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Confirm"
                          >
                            <CheckCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Cancel"
                          >
                            <XCircle className="size-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'reschedule')}
                            className="p-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            title="Reschedule"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                              <MoreVertical className="size-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/staff/appointments"
                className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                View all appointments
                <ChevronRight className="size-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Recent Client Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Client Reviews</h2>
            <div className="space-y-4">
              {recentReviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 size-10 rounded-full flex items-center justify-center">
                      <Users className="size-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{review.client}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`size-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.service}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{review.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Today's Schedule */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Schedule</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                View Calendar
              </button>
            </div>
            
            <div className="space-y-4">
              {todaysSchedule.map((item, index) => (
                <div key={index} className={`flex items-center p-3 rounded-lg ${item.type === 'setup' || item.type === 'cleanup' || item.type === 'break' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'bg-green-50 dark:bg-green-900/20'} transition-all hover:scale-[1.02]`}>
                  <div className={`size-12 rounded-lg flex items-center justify-center mr-3 ${item.type === 'setup' || item.type === 'cleanup' 
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400' 
                    : item.type === 'break'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-gradient-to-r from-green-400 to-blue-400 text-white'}`}>
                    <Clock className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.client}</h4>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.service}</p>
                    {item.status === 'upcoming' && !item.type && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                          Upcoming
                        </span>
                        <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                          Check-in
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-all">
                <CheckCircle className="size-6 text-green-600 dark:text-green-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Check-in Client</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <MessageSquare className="size-6 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Send Message</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                <Edit3 className="size-6 text-purple-600 dark:text-purple-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Update Notes</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                <Clock className="size-6 text-orange-600 dark:text-orange-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Start Break</span>
              </button>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tomorrow's Appointments</h2>
            <div className="space-y-3">
              {[
                { time: '9:30 AM', client: 'Alex Turner', service: 'Haircut', duration: '45 mins' },
                { time: '11:00 AM', client: 'Maria Garcia', service: 'Manicure', duration: '1 hour' },
                { time: '2:00 PM', client: 'James Wilson', service: 'Massage', duration: '1.5 hours' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="size-10 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center mr-3">
                    <Calendar className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{appointment.client}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{appointment.time}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}