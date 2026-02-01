// // src/app/admin/layout.js
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   LayoutDashboard, 
//   Calendar, 
//   Users, 
//   Settings, 
//   Menu, 
//   X,
//   Bell,
//   LogOut,
//   UserCircle,
//   Package,
//   Briefcase,
//   BarChart3,
//   Building2,
//   Shield,
//   Search,
//   ChevronDown,
//   PlusCircle,
//   HelpCircle,
//   Moon,
//   UserPlus,
//   Stethoscope,
//   Sun
// } from 'lucide-react';

// export default function AdminLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [user, setUser] = useState(null);
//   const [notifications, setNotifications] = useState([
//     { id: 1, text: 'New appointment booked', time: '5 min ago', read: false },
//     { id: 2, text: 'Service "Haircut" updated', time: '1 hour ago', read: false },
//     { id: 3, text: 'New client registered', time: '2 hours ago', read: true },
//   ]);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const userMenuRef = useRef(null);

//   useEffect(() => {
//     // Check if user is logged in and is admin
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       setUser(userData);
      
//       // Redirect if not admin
//       if (userData.role !== 'admin') {
//         router.push('/client/dashboard');
//       }
//     } else {
//       router.push('/signin');
//     }

//     // Check dark mode preference
//     const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
//                       window.matchMedia('(prefers-color-scheme: dark)').matches;
//     setDarkMode(isDarkMode);
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     }

//     // Close user menu when clicking outside
//     const handleClickOutside = (event) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setUserMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [router]);

//   useEffect(() => {
//     // Update dark mode class
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('darkMode', 'true');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('darkMode', 'false');
//     }
//   }, [darkMode]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     router.push('/');
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const navItems = [
//     { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="size-5" /> },
//     { name: 'Doctors', href: '/admin/doctors', icon: <Stethoscope className="size-5" /> },
//     { name: 'Create Service', href: '/admin/createService', icon: <PlusCircle className="size-5" /> },
//     { name: 'Appointments', href: '/admin/appointments', icon: <Calendar className="size-5" /> },
//     { name: 'View Clients', href: '/admin/viewClients', icon: <Users className="size-5" /> },
//     { name: 'Create Client', href: '/admin/createClient', icon: <UserPlus className="size-5" /> },
//     { name: 'View Admin & Staff', href: '/admin/viewAdminStaff', icon: <Briefcase className="size-5" /> },
//     { name: 'Create Admin/Staff', href: '/admin/createUsers', icon: <Shield className="size-5" /> },

//     { name: 'Settings', href: '/admin/settings', icon: <Settings className="size-5" /> },
//   ];

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
//             <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 size-10 rounded-lg flex items-center justify-center">
//                 <Building2 className="size-6 text-white" />
//               </div>
//               {sidebarOpen && (
//                 <div>
//                   <h1 className="text-lg font-bold text-gray-900 dark:text-white">ScheduleFlow</h1>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
//             </button>
//           </div>

//           {/* User Profile */}
//           <div className={`px-4 py-6 border-b border-gray-200 dark:border-gray-700 ${sidebarOpen ? '' : 'flex justify-center'}`}>
//             <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'flex-col'}`}>
//               <div className="bg-gradient-to-r from-blue-400 to-purple-400 size-12 rounded-full flex items-center justify-center">
//                 <UserCircle className="size-8 text-white" />
//               </div>
//               {sidebarOpen && (
//                 <div className="flex-1 min-w-0">
//                   <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//                     {user.name}
//                   </h2>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
//                   <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full">
//                     <Shield className="size-3 mr-1" />
//                     Admin
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} rounded-lg transition-all ${
//                     isActive
//                       ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
//                       : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   {item.icon}
//                   {sidebarOpen && <span className="font-medium">{item.name}</span>}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout Button in Sidebar */}
//           <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//             <button
//               onClick={handleLogout}
//               className={`flex items-center w-full ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all`}
//             >
//               <LogOut className="size-5" />
//               {sidebarOpen && <span className="font-medium">Logout</span>}
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Top Navigation Bar */}
//         <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between">
//               {/* Search */}
//               <div className="flex-1 max-w-xl">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
//                   <input
//                     type="search"
//                     placeholder="Search appointments, clients, services..."
//                     className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600"
//                   />
//                 </div>
//               </div>

//               {/* Right Side Actions */}
//               <div className="flex items-center space-x-4">
//                 {/* Dark Mode Toggle */}
//                 <button
//                   onClick={toggleDarkMode}
//                   className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   aria-label="Toggle dark mode"
//                 >
//                   {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
//                 </button>

//                 {/* Help Button */}
//                 <button
//                   className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   aria-label="Help"
//                 >
//                   <HelpCircle className="size-5" />
//                 </button>

//                 {/* Notifications */}
//                 <div className="relative">
//                   <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//                     <Bell className="size-5" />
//                     {notifications.filter(n => !n.read).length > 0 && (
//                       <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
//                     )}
//                   </button>
//                 </div>

//                 {/* User Menu */}
//                 <div className="relative" ref={userMenuRef}>
//                   <button
//                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                     className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                   >
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
//                     </div>
//                     <div className="bg-gradient-to-r from-blue-400 to-purple-400 size-10 rounded-full flex items-center justify-center">
//                       <UserCircle className="size-6 text-white" />
//                     </div>
//                     <ChevronDown className={`size-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {/* User Dropdown Menu */}
//                   {userMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
//                       {/* User Info */}
//                       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                         <div className="flex items-center space-x-3">
//                           <div className="bg-gradient-to-r from-blue-400 to-purple-400 size-12 rounded-full flex items-center justify-center">
//                             <UserCircle className="size-8 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
//                             <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full">
//                               <Shield className="size-3 mr-1" />
//                               Admin
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Menu Items */}
//                       <div className="py-2">
//                         <Link
//                           href="/admin/profile"
//                           className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           onClick={() => setUserMenuOpen(false)}
//                         >
//                           <UserCircle className="size-5 mr-3 text-gray-400" />
//                           My Profile
//                         </Link>
//                         <Link
//                           href="/admin/settings"
//                           className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           onClick={() => setUserMenuOpen(false)}
//                         >
//                           <Settings className="size-5 mr-3 text-gray-400" />
//                           Account Settings
//                         </Link>
//                         <Link
//                           href="/help"
//                           className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                           onClick={() => setUserMenuOpen(false)}
//                         >
//                           <HelpCircle className="size-5 mr-3 text-gray-400" />
//                           Help & Support
//                         </Link>
//                       </div>

//                       {/* Logout Button */}
//                       <div className="border-t border-gray-200 dark:border-gray-700 p-2">
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
//                         >
//                           <LogOut className="size-5 mr-3" />
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <div className="p-6">
//           {children}
//         </div>

//         {/* Footer */}
//         <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               © {new Date().getFullYear()} ScheduleFlow. All rights reserved.
//             </p>
//             <div className="flex items-center space-x-6">
//               <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
//                 Privacy Policy
//               </a>
//               <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
//                 Terms of Service
//               </a>
//               <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
//                 Help Center
//               </a>
//             </div>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// }



// src/app/admin/layout.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Menu, 
  X,
  Bell,
  LogOut,
  UserCircle,
  Package,
  Briefcase,
  BarChart3,
  Building2,
  Shield,
  Search,
  ChevronDown,
  PlusCircle,
  HelpCircle,
  Moon,
  UserPlus,
  Stethoscope,
  Sun,
  Clock,
  FileText,
  Activity
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New appointment booked', time: '5 min ago', read: false },
    { id: 2, text: 'Doctor slot generated', time: '1 hour ago', read: false },
    { id: 3, text: 'New client registered', time: '2 hours ago', read: true },
  ]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      if (userData.role !== 'admin') {
        router.push('/client/dashboard');
      }
    } else {
      router.push('/signin');
    }

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  useEffect(() => {
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
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="size-5" /> },
    { name: 'Doctors', href: '/admin/doctors', icon: <Stethoscope className="size-5" /> },
    { name: 'Create Doctor', href: '/admin/createService', icon: <PlusCircle className="size-5" /> },
    { name: 'All Appointments', href: '/admin/allAppointments', icon: <Calendar className="size-5" /> },
    { name: 'View Clients', href: '/admin/viewClients', icon: <Users className="size-5" /> },
    { name: 'Create Client', href: '/admin/createClient', icon: <UserPlus className="size-5" /> },
    { name: 'View Admin & Staff', href: '/admin/viewAdminStaff', icon: <Briefcase className="size-5" /> },
    { name: 'Create User', href: '/admin/createUsers', icon: <Shield className="size-5" /> },
   
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="size-5" /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl border-r border-slate-200 dark:border-gray-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-gray-700">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 size-10 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="size-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">MediFlow</h1>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Healthcare Admin</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-400"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* User Profile */}
          <div className={`px-4 py-6 border-b border-slate-200 dark:border-gray-700 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'flex-col'}`}>
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 size-12 rounded-full flex items-center justify-center shadow-md">
                <UserCircle className="size-8 text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-gray-400">{user.email}</p>
                  <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 rounded-full">
                    <Shield className="size-3 mr-1" />
                    Administrator
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 shadow-sm'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <div className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-gray-400'}>
                    {item.icon}
                  </div>
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'p-3 justify-center'} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:shadow-sm`}
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
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 size-5" />
                  <input
                    type="search"
                    placeholder="Search doctors, appointments, clients..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </button>

                {/* Help Button */}
                <button
                  className="p-2.5 text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all"
                  aria-label="Help"
                >
                  <HelpCircle className="size-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2.5 text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all">
                    <Bell className="size-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                    )}
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all group"
                  >
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Admin Panel</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 size-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <UserCircle className="size-6 text-white" />
                    </div>
                    <ChevronDown className={`size-4 text-emerald-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-gray-700 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="p-4 border-b border-slate-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 size-12 rounded-full flex items-center justify-center shadow">
                            <UserCircle className="size-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-gray-400">{user.email}</p>
                            <div className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 rounded-full">
                              <Shield className="size-3 mr-1" />
                              Super Admin
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/admin/profile"
                          className="flex items-center px-4 py-3 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle className="size-5 mr-3 text-emerald-500" />
                          My Profile
                        </Link>
                        <Link
                          href="/admin/settings"
                          className="flex items-center px-4 py-3 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="size-5 mr-3 text-emerald-500" />
                          Account Settings
                        </Link>
                        <Link
                          href="/help"
                          className="flex items-center px-4 py-3 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <HelpCircle className="size-5 mr-3 text-emerald-500" />
                          Help & Support
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-slate-200 dark:border-gray-700 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <LogOut className="size-5 mr-3" />
                          Sign Out
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
        <div className="p-4 md:p-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-gray-400">
              © {new Date().getFullYear()} MediFlow Healthcare. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Help Center
              </a>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">System Active</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}