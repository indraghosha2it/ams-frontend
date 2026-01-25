// src/app/page.js
'use client';

import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  BarChart,
  Shield,
  Bell,
  ArrowRight,
  ChevronRight,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Calendar className="size-6" />,
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling optimized for your business needs',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      icon: <Users className="size-6" />,
      title: 'Client Management',
      description: 'Complete client profiles with history and preferences',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      icon: <BarChart className="size-6" />,
      title: 'Analytics & Reports',
      description: 'Real-time insights to grow your business',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
    {
      icon: <Bell className="size-6" />,
      title: 'Smart Reminders',
      description: 'Automated notifications to reduce no-shows',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
    {
      icon: <Shield className="size-6" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with full compliance',
      color: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    },
    {
      icon: <Zap className="size-6" />,
      title: 'Fast & Reliable',
      description: '99.9% uptime with instant response times',
      color: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '1M+', label: 'Appointments' },
    { number: '98%', label: 'Satisfaction' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 size-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="size-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ScheduleFlow
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Edition</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Testimonials
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/signin')}
                className="group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
              <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Trusted by professionals worldwide
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white">Modern</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Appointment Management
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Streamline your scheduling process with our intelligent platform designed for modern businesses.
              Save time, reduce no-shows, and grow your client base.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => router.push('/signin?mode=signup')}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  Start Free Trial
                  <ChevronRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={() => router.push('/signin')}
                className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
              >
                Book a Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage appointments efficiently and professionally
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-6 shadow-lg`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust ScheduleFlow for their appointment management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/signin?mode=signup')}
              className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => router.push('/signin')}
              className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="size-8 text-white" />
                <span className="text-xl font-bold text-white">ScheduleFlow</span>
              </div>
              <p className="text-sm">
                Professional appointment management for modern businesses.
              </p>
            </div>
            
            {['Product', 'Company', 'Resources', 'Legal'].map((category) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <ul className="space-y-2 text-sm">
                  {['Feature 1', 'Feature 2', 'Feature 3'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2024 ScheduleFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}