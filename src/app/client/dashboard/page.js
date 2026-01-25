// src/app/client/dashboard/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin,
  DollarSign,
  Star,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Download,
  Share2,
  MoreVertical,
  CalendarDays,
  TrendingUp,
  UserCheck,
  Award
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState('upcoming');
  
  // Mock data for upcoming appointments
  const upcomingAppointments = [
    { 
      id: 1, 
      service: 'Premium Haircut & Styling', 
      staff: 'John Smith',
      date: 'Tomorrow, 10:00 AM',
      duration: '1 hour',
      price: '$45',
      location: 'Main Salon',
      status: 'confirmed'
    },
    { 
      id: 2, 
      service: 'Deep Tissue Massage', 
      staff: 'Sarah Johnson',
      date: 'Friday, 2:30 PM',
      duration: '1.5 hours',
      price: '$85',
      location: 'Spa Room 2',
      status: 'confirmed'
    },
    { 
      id: 3, 
      service: 'Manicure & Pedicure', 
      staff: 'Emma Wilson',
      date: 'Next Monday, 3:00 PM',
      duration: '1.5 hours',
      price: '$65',
      location: 'Nail Studio',
      status: 'pending'
    },
  ];

  // Past appointments
  const pastAppointments = [
    { 
      id: 4, 
      service: 'Facial Treatment', 
      staff: 'Lisa Chen',
      date: 'Jan 15, 2024',
      duration: '1 hour',
      price: '$75',
      location: 'Spa Room 1',
      status: 'completed',
      rating: 5,
      review: 'Amazing service! My skin feels incredible.'
    },
    { 
      id: 5, 
      service: 'Beard Trim', 
      staff: 'Mike Brown',
      date: 'Jan 10, 2024',
      duration: '30 mins',
      price: '$25',
      location: 'Barber Station',
      status: 'completed',
      rating: 4,
      review: 'Good trim, but a bit rushed.'
    },
    { 
      id: 6, 
      service: 'Hair Color', 
      staff: 'Anna Taylor',
      date: 'Jan 5, 2024',
      duration: '2.5 hours',
      price: '$120',
      location: 'Color Bar',
      status: 'completed',
      rating: 5,
      review: 'Perfect color! Exactly what I wanted.'
    },
  ];

  // Quick stats
  const clientStats = [
    { label: 'Total Appointments', value: '12', icon: <Calendar className="size-6" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { label: 'Upcoming', value: '3', icon: <Clock className="size-6" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
    { label: 'Total Spent', value: '$850', icon: <DollarSign className="size-6" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { label: 'Avg. Rating', value: '4.5', icon: <Star className="size-6" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
  ];

  // Favorite services
  const favoriteServices = [
    { name: 'Haircut & Styling', staff: 'John Smith', visits: 5, lastVisit: '2 weeks ago' },
    { name: 'Deep Tissue Massage', staff: 'Sarah Johnson', visits: 3, lastVisit: '1 month ago' },
    { name: 'Manicure', staff: 'Emma Wilson', visits: 4, lastVisit: '3 weeks ago' },
  ];

  // Upcoming reminders
  const reminders = [
    { type: 'appointment', text: 'Haircut with John Smith', time: 'Tomorrow, 10:00 AM' },
    { type: 'payment', text: 'Monthly membership renewal', time: 'In 3 days' },
    { type: 'review', text: 'Leave review for last service', time: 'Due today' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="size-4" />;
      case 'pending': return <AlertCircle className="size-4" />;
      case 'completed': return <CheckCircle className="size-4" />;
      case 'cancelled': return <XCircle className="size-4" />;
      default: return <Clock className="size-4" />;
    }
  };

  const handleReschedule = (appointmentId) => {
    router.push(`/client/book?reschedule=${appointmentId}`);
  };

  const handleCancel = (appointmentId) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      console.log(`Cancelling appointment ${appointmentId}`);
      alert('Appointment cancelled successfully');
    }
  };

  const handleDownloadReceipt = (appointmentId) => {
    console.log(`Downloading receipt for ${appointmentId}`);
    alert('Receipt downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100">You have {upcomingAppointments.length} upcoming appointments</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Loyalty Points</p>
              <p className="text-2xl font-bold">1,250</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Award className="size-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your scheduled appointments</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                  </select>
                  <Link
                    href="/client/book"
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Book New
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{appointment.service}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1.5 capitalize">{appointment.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center">
                          <Calendar className="size-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <UserCheck className="size-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Staff</p>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.staff}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="size-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign className="size-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.price}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <MessageSquare className="size-4 inline mr-1" />
                          Message Staff
                        </button>
                        <div className="flex-1"></div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <Link
                href="/client/upcoming"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View all upcoming appointments
                <ChevronRight className="size-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Past Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Appointments</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your previous service history</p>
              </div>
              <Link
                href="/client/history"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                View all history
              </Link>
            </div>
            
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.service}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{appointment.price}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Staff:</span> {appointment.staff}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Date:</span> {appointment.date}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Location:</span> {appointment.location}
                        </div>
                      </div>
                      
                      {appointment.rating && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`size-4 ${i < appointment.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Your rating: {appointment.rating}/5</span>
                        </div>
                      )}
                      
                      {appointment.review && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic border-l-4 border-blue-500 pl-3 py-1 mb-3">
                          "{appointment.review}"
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleDownloadReceipt(appointment.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                        >
                          <Download className="size-3 mr-1" />
                          Download Receipt
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
                          <Share2 className="size-3 mr-1" />
                          Share Review
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/client/book"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
              >
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  <CalendarDays className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Book Appointment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Schedule new service</p>
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </Link>
              
              <Link
                href="/client/messages"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-all group"
              >
                <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-3">
                  <MessageSquare className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">Messages</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3 unread messages</p>
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </Link>
              
              <Link
                href="/client/services"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
              >
                <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
                  <Star className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Browse Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover new treatments</p>
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </Link>
              
              <Link
                href="/client/reviews"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
              >
                <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-3">
                  <Star className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">Write Review</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share your experience</p>
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Favorite Services */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Favorite Services</h2>
            <div className="space-y-3">
              {favoriteServices.map((service, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="size-10 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mr-3">
                    <Star className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>{service.staff}</span>
                      <span className="mx-2">•</span>
                      <span>{service.visits} visits</span>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reminders</h2>
            <div className="space-y-3">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-100 dark:border-blue-800/30">
                  <div className={`p-2 rounded-md mr-3 ${reminder.type === 'appointment' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : reminder.type === 'payment'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                    {reminder.type === 'appointment' ? <Calendar className="size-4" /> : 
                     reminder.type === 'payment' ? <DollarSign className="size-4" /> :
                     <Star className="size-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{reminder.text}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.time}</p>
                  </div>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">Need Help?</h3>
            <p className="text-blue-100 mb-4">Our support team is here to help you with any questions.</p>
            <div className="space-y-3">
              <button className="flex items-center w-full p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Phone className="size-4 mr-2" />
                <span>Call Support</span>
              </button>
              <button className="flex items-center w-full p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Mail className="size-4 mr-2" />
                <span>Email Support</span>
              </button>
              <button className="flex items-center w-full p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <MessageSquare className="size-4 mr-2" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}