// src/app/staff/layout.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock,
  Menu, 
  X,
  Bell,
  LogOut,
  UserCircle,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ChevronDown,
  BarChart3,
  Settings,
  MessageSquare,
  HelpCircle,
  Moon,
  Sun,
  Briefcase,
  Filter,
  MoreVertical
} from 'lucide-react';

export default function StaffLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New appointment assigned', time: '5 min ago', read: false },
    { id: 2, text: 'Appointment reminder: John Doe at 10:00 AM', time: '1 hour ago', read: false },
    { id: 3, text: 'Client review received', time: '2 hours ago', read: true },
  ]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in and is staff
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Redirect if not staff
      if (!['staff', 'admin'].includes(userData.role)) {
        router.push('/client/dashboard');
      }
    } else {
      router.push('/signin');
    }

    // Check dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  useEffect(() => {
    // Update dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navItems = [
    { name: 'Dashboard', href: '/staff/dashboard', icon: <LayoutDashboard className="size-5" /> },
    { name: 'Appointments', href: '/staff/appointments', icon: <Clock className="size-5" /> },
    { name: 'View Clients', href: '/staff/viewClients', icon: <Users className="size-5" /> },
        { name: 'My Schedule', href: '/staff/schedule', icon: <Calendar className="size-5" /> },

    { name: 'Services', href: '/staff/services', icon: <Package className="size-5" /> },
    { name: 'Messages', href: '/staff/messages', icon: <MessageSquare className="size-5" /> },
    { name: 'Reports', href: '/staff/reports', icon: <BarChart3 className="size-5" /> },
    { name: 'Settings', href: '/staff/settings', icon: <Settings className="size-5" /> },
  ];


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="bg-gradient-to-r from-green-600 to-blue-600 size-10 rounded-lg flex items-center justify-center">
                <Calendar className="size-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">ScheduleFlow</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Staff Portal</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* User Profile */}
          <div className={`px-4 py-6 border-b border-gray-200 dark:border-gray-700 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'flex-col'}`}>
              <div className="bg-gradient-to-r from-green-400 to-blue-400 size-12 rounded-full flex items-center justify-center">
                <UserCircle className="size-8 text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full">
                    <Briefcase className="size-3 mr-1" />
                    Staff
                  </div>
                </div>
              )}
            </div>
          </div>

       

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 text-green-600 dark:text-green-400 border-l-4 border-green-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button in Sidebar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all`}
            >
              <LogOut className="size-5" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                  <input
                    type="search"
                    placeholder="Search appointments, clients, services..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-600"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </button>

                {/* Help Button */}
                <button
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Help"
                >
                  <HelpCircle className="size-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Bell className="size-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Staff Member</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 size-10 rounded-full flex items-center justify-center">
                      <UserCircle className="size-6 text-white" />
                    </div>
                    <ChevronDown className={`size-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-green-400 to-blue-400 size-12 rounded-full flex items-center justify-center">
                            <UserCircle className="size-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full">
                              <Briefcase className="size-3 mr-1" />
                              Staff
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/staff/profile"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle className="size-5 mr-3 text-gray-400" />
                          My Profile
                        </Link>
                        <Link
                          href="/staff/settings"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="size-5 mr-3 text-gray-400" />
                          Account Settings
                        </Link>
                        <Link
                          href="/help"
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <HelpCircle className="size-5 mr-3 text-gray-400" />
                          Help & Support
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <LogOut className="size-5 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} ScheduleFlow Staff Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Logged in as: <span className="font-medium">{user.name}</span>
              </span>
              <button
                onClick={() => router.push('/staff/schedule')}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                View Today's Schedule
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}