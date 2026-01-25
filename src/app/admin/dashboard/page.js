// src/app/admin/dashboard/page.js
'use client';

import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Package, 
  Briefcase, 
  PlusCircle,
  BarChart3,
  UserCircle,
  Building2,
  Eye,
  Edit3,
  Trash2 
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  
  // Move these from layout.js
  const stats = [
    { label: 'Total Appointments', value: '1,254', change: '+12%', icon: <Calendar className="size-5" /> },
    { label: 'Active Services', value: '24', change: '+3', icon: <Package className="size-5" /> },
    { label: 'Total Clients', value: '856', change: '+8%', icon: <Users className="size-5" /> },
    { label: 'Staff Members', value: '12', change: '+2', icon: <Briefcase className="size-5" /> },
  ];

  const recentAppointments = [
    { id: 1, client: 'John Doe', service: 'Haircut', time: 'Today, 10:00 AM', status: 'Confirmed' },
    { id: 2, client: 'Jane Smith', service: 'Massage', time: 'Today, 11:30 AM', status: 'Pending' },
    { id: 3, client: 'Bob Johnson', service: 'Facial', time: 'Today, 2:00 PM', status: 'Confirmed' },
    { id: 4, client: 'Alice Brown', service: 'Manicure', time: 'Tomorrow, 9:00 AM', status: 'Pending' },
  ];

  const quickActions = [
    { title: 'Add New Service', icon: <PlusCircle />, color: 'bg-blue-500', href: '/admin/services/create' },
    { title: 'Schedule Appointment', icon: <Calendar />, color: 'bg-green-500', href: '/admin/appointments/create' },
    { title: 'Add Staff Member', icon: <UserCircle />, color: 'bg-purple-500', href: '/admin/staff/create' },
    { title: 'View Reports', icon: <BarChart3 />, color: 'bg-orange-500', href: '/admin/reports' },
  ];

  return (
    <>
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-blue-100">Here's what's happening with your business today.</p>
            </div>
            <div className="hidden md:block">
              <Calendar className="size-24 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                index === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                index === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 ${action.color} text-white`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to {action.title.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Appointments & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Appointments</h2>
                <Link href="/admin/appointments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Service
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
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 size-10">
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 size-10 rounded-full flex items-center justify-center">
                              <UserCircle className="size-6 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.client}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{appointment.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <Eye className="size-4" />
                          </button>
                          <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                            <Edit3 className="size-4" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { user: 'John Doe', action: 'booked an appointment', time: '10 min ago' },
                { user: 'Staff Member', action: 'updated service pricing', time: '1 hour ago' },
                { user: 'Jane Smith', action: 'completed payment', time: '2 hours ago' },
                { user: 'System', action: 'weekly backup completed', time: '3 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 size-10 rounded-full flex items-center justify-center">
                      <UserCircle className="size-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Status</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: 'Server Uptime', value: '99.9%', status: 'good' },
                { name: 'Database', value: 'Healthy', status: 'good' },
                { name: 'API Response', value: 'Fast', status: 'good' },
                { name: 'Storage', value: '85%', status: 'warning' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'good' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.value}
                    </span>
                    <div className={`size-2 rounded-full ${
                      item.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}