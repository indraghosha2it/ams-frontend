'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  PlusCircle,
  BarChart3,
  UserCircle,
  Eye,
  Clock,
  FileText,
  Activity,
  Stethoscope,
  UserPlus,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  CalendarRange,
  TrendingDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  UserCheck,
  Bell,
  Clock3,
  CalendarCheck,
  ClipboardList,
 Contact,
  History
} from 'lucide-react';

export default function StaffDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState({ up: true, percentage: 12 });
  
  // Staff-specific quick actions (no doctor management)
  const quickActions = [
    { title: 'Reschedule Appointment', icon: <Calendar />, color: 'from-blue-500 to-cyan-600', href: '/staff/appointments' },
    { title: 'All Appointment ', icon: <ClipboardList />, color: 'from-purple-500 to-indigo-600', href: '/staff/appointments' },
    { title: 'View Clients', icon: <Contact />, color: 'from-amber-500 to-orange-600', href: '/staff/viewClients' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ams-backend-psi.vercel.app';
      const token = localStorage.getItem('token');
      
      // Fetch appointments
      const appointmentsResponse = await axios.get(`${BACKEND_URL}/api/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (appointmentsResponse.data.success) {
        const allAppointments = appointmentsResponse.data.data;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('📊 === STAFF DASHBOARD STATS DEBUG ===');
        console.log('Total appointments from API:', allAppointments.length);
        
        // Get current month start and end dates (simpler approach)
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        // First day of current month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        // Last day of current month
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        
        console.log('Current month:', firstDayOfMonth.toDateString(), 'to', lastDayOfMonth.toDateString());
        
        // Calculate stats
        const todayAppointmentsCount = allAppointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          appDate.setHours(0, 0, 0, 0);
          return appDate.getTime() === today.getTime();
        }).length;
        
        const upcomingAppointmentsCount = allAppointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          return appDate > new Date(today.getTime() + 24 * 60 * 60 * 1000);
        }).length;
        
        const pendingAppointmentsCount = allAppointments.filter(app => app.status === 'pending').length;
        
        // Calculate current month appointments - SIMPLIFIED
        const currentMonthAppointments = allAppointments.filter(app => {
          try {
            const appDate = new Date(app.appointmentDate);
            // Reset time to compare only dates
            appDate.setHours(0, 0, 0, 0);
            const monthStart = new Date(firstDayOfMonth);
            monthStart.setHours(0, 0, 0, 0);
            const monthEnd = new Date(lastDayOfMonth);
            monthEnd.setHours(23, 59, 59, 999);
            
            return appDate >= monthStart && appDate <= monthEnd;
          } catch (error) {
            console.error('Error parsing date:', app.appointmentDate);
            return false;
          }
        }).length;
        
        console.log('Current month appointments count:', currentMonthAppointments);
        
        // Get today's appointments for display
        const todaysApps = allAppointments.filter(app => {
          try {
            const appDate = new Date(app.appointmentDate);
            appDate.setHours(0, 0, 0, 0);
            return appDate.getTime() === today.getTime();
          } catch (error) {
            return false;
          }
        }).slice(0, 4);
        
        // Get recent appointments (last 4)
        const recentApps = allAppointments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        // Calculate monthly trend (for current month vs last month)
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        // First and last day of previous month
        const firstDayPrevMonth = new Date(prevMonthYear, prevMonth, 1);
        const lastDayPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0);
        
        const prevMonthApps = allAppointments.filter(app => {
          try {
            const appDate = new Date(app.appointmentDate);
            appDate.setHours(0, 0, 0, 0);
            const prevMonthStart = new Date(firstDayPrevMonth);
            prevMonthStart.setHours(0, 0, 0, 0);
            const prevMonthEnd = new Date(lastDayPrevMonth);
            prevMonthEnd.setHours(23, 59, 59, 999);
            
            return appDate >= prevMonthStart && appDate <= prevMonthEnd;
          } catch (error) {
            return false;
          }
        }).length;
        
        const monthlyPercentage = prevMonthApps > 0 
          ? Math.round(((currentMonthAppointments - prevMonthApps) / prevMonthApps) * 100)
          : currentMonthAppointments > 0 ? 100 : 0;
        
        setStats({
          todayAppointments: todayAppointmentsCount,
          upcomingAppointments: upcomingAppointmentsCount,
          totalAppointments: currentMonthAppointments, // Current month appointments
          totalPatients: new Set(allAppointments.map(app => app.patient?.email)).size,
          pendingAppointments: pendingAppointmentsCount
        });
        
        setTodayAppointments(todaysApps);
        setRecentAppointments(recentApps);
        setMonthlyTrend({
          up: currentMonthAppointments >= prevMonthApps,
          percentage: Math.abs(monthlyPercentage)
        });
        
        console.log('✅ Staff Stats set:', {
          currentMonthAppointments,
          todayAppointmentsCount,
          upcomingAppointmentsCount,
          pendingAppointmentsCount
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="size-3 mr-1" />;
      case 'pending': return <Clock className="size-3 mr-1" />;
      case 'cancelled': return <AlertCircle className="size-3 mr-1" />;
      default: return <Clock className="size-3 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800">Loading Staff Dashboard</h3>
            <p className="text-slate-600 mt-2">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Banner - Staff Specific */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">Welcome, Staff Member! 👋</h1>
                  <p className="text-emerald-100 opacity-90">Here's your appointment management dashboard</p>
                </div>
              </div>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center">
                  <Clock className="size-4 mr-2" />
                  <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="size-4 mr-2" />
                  <span className="text-sm">{stats.todayAppointments} appointments scheduled today</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <CalendarCheck className="size-24 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Staff Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Appointments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md">
              <Calendar className="size-5 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium ${monthlyTrend.up ? 'text-emerald-600' : 'text-red-600'}`}>
              {monthlyTrend.up ? <ArrowUpRight className="size-4 mr-1" /> : <ArrowDownRight className="size-4 mr-1" />}
              {monthlyTrend.percentage}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.todayAppointments}</h3>
          <p className="text-sm text-slate-600">Today's Appointments</p>
          <div className="mt-2 text-xs text-slate-500">
            <span className="inline-flex items-center">
              <TrendingUp className="size-3 mr-1" />
              {stats.pendingAppointments} pending approval
            </span>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 shadow-md">
              <CalendarRange className="size-5 text-white" />
            </div>
            <div className="text-sm font-medium text-blue-600">Total</div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.upcomingAppointments}</h3>
          <p className="text-sm text-slate-600">Upcoming Appointments</p>
          <div className="mt-2 text-xs text-slate-500">
            Scheduled in advance
          </div>
        </div>

        {/* Total Appointments (Monthly) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-500 shadow-md">
              <FileText className="size-5 text-white" />
            </div>
            <div className="text-sm font-medium text-purple-600">This month</div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.totalAppointments}</h3>
          <p className="text-sm text-slate-600">Total Appointments</p>
          <div className="mt-2 text-xs text-slate-500">
            All appointments this month
          </div>
        </div>

        {/* Patients Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 shadow-md">
              <Users className="size-5 text-white" />
            </div>
            <div className="text-sm font-medium text-amber-600">Active</div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{stats.totalPatients}</h3>
          <p className="text-sm text-slate-600">Total Patients</p>
          <div className="mt-2 text-xs text-slate-500">
            Unique patients this month
          </div>
        </div>
      </div>

      {/* Today's Appointments & Quick Insights - Matched to Admin Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments - Matched to Admin Design */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Today's Appointments</h2>
                <Link href="/staff/appointments" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                  View All <ChevronRight className="size-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 text-4xl mb-3">📅</div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No appointments today</h3>
                  <p className="text-slate-500 mb-4">No appointments scheduled for today</p>
                  <Link
                    href="/staff/allAppointments"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Schedule Appointment
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mr-4">
                          <UserCircle className="size-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{appointment.patient?.fullName || 'N/A'}</h4>
                          <p className="text-sm text-slate-600">{appointment.appointmentTime || 'N/A'} • {appointment.doctorInfo?.name || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                        </span>
                        <Link
                          href={`/staff/allAppointments`}
                          className="text-emerald-600 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights - Matched to Admin Design */}
        <div>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <Activity className="size-4" />
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-600 text-sm">Total Patients</div>
                  <div className="font-semibold text-slate-900">{stats.totalPatients}</div>
                </div>
                <div className="text-emerald-500 bg-emerald-100 p-2 rounded-lg">
                  <Users className="size-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-600 text-sm">Pending Approvals</div>
                  <div className="font-semibold text-amber-700">{stats.pendingAppointments}</div>
                </div>
                <div className="text-amber-500 bg-amber-100 p-2 rounded-lg">
                  <Clock className="size-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-600 text-sm">Upcoming Appointments </div>
                  <div className="font-semibold text-blue-700">
                    {stats.upcomingAppointments}
                  </div>
                </div>
                <div className="text-blue-500 bg-blue-100 p-2 rounded-lg">
                  <CalendarRange className="size-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-600 text-sm">Monthly Growth</div>
                  <div className={`font-semibold ${monthlyTrend.up ? 'text-emerald-700' : 'text-red-700'}`}>
                    {monthlyTrend.up ? '+' : '-'}{monthlyTrend.percentage}%
                  </div>
                </div>
                <div className={`${monthlyTrend.up ? 'text-emerald-500 bg-emerald-100' : 'text-red-500 bg-red-100'} p-2 rounded-lg`}>
                  {monthlyTrend.up ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-emerald-200">
              <div className="text-xs text-slate-600 mb-2">System Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-emerald-700 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
          
          {/* Refresh Button - Matched to Admin Design */}
          <div className="mt-4">
            <button
              onClick={fetchDashboardData}
              className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
            >
              <Activity className="size-4" />
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1  gap-8 mt-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Recent Appointments</h2>
                <Link href="/staff/appointments" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <UserCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {appointment.patient?.fullName || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {appointment.patient?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{appointment.doctorInfo?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500">{appointment.doctorInfo?.speciality || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {appointment.appointmentTime || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 bg-gradient-to-r ${action.color} text-white shadow-md`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-emerald-600">
                {action.title}
              </h3>
              <p className="text-sm text-slate-500">
                Click to {action.title.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}