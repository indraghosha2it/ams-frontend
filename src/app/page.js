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
  Sparkles,
  Stethoscope,
  Pill,
  Heart,
  Activity,
  Smartphone,
  ShieldCheck,
  CalendarCheck,
  UserCheck,
  Clock4,
  Video,
  Mail,
  UserCog,
  CalendarClock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <CalendarCheck className="size-6" />,
      title: 'Smart Appointment Booking',
      description: 'Patients can book appointments 24/7 with real-time availability',
      color: 'bg-gradient-to-br from-teal-500 to-emerald-500',
      highlight: true
    },
    {
      icon: <CalendarClock className="size-6" />,
      title: 'Time Slot Management',
      description: 'Flexible scheduling with customizable time slots for each doctor',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      icon: <UserCheck className="size-6" />,
      title: 'Patient Management',
      description: 'Complete patient profiles with medical history tracking',
      color: 'bg-gradient-to-br from-teal-600 to-emerald-600',
    },
    {
      icon: <Mail className="size-6" />,
      title: 'Appointment Status via Email',
      description: 'Automatic email confirmations and status updates for patients',
      color: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    },
    {
      icon: <UserCog className="size-6" />,
      title: 'Doctor Management',
      description: 'Manage multiple doctors with individual schedules and specialties',
      color: 'bg-gradient-to-br from-teal-700 to-emerald-700',
    },
    {
      icon: <BarChart className="size-6" />,
      title: 'Practice Analytics',
      description: 'Insights on patient flow, appointment trends, and practice efficiency',
      color: 'bg-gradient-to-br from-emerald-700 to-teal-800',
    },
  ];

  const specializations = [
    { name: 'General Practice', icon: <Stethoscope className="size-5" /> },
    { name: 'Pediatrics', icon: <Heart className="size-5" /> },
    { name: 'Cardiology', icon: <Activity className="size-5" /> },
    { name: 'Dermatology', icon: <Pill className="size-5" /> },
    { name: 'Orthopedics', icon: <CheckCircle className="size-5" /> },
    { name: 'Dental', icon: <Users className="size-5" /> },
  ];

  const stats = [
    { number: '5K+', label: 'Healthcare Providers' },
    { number: '2M+', label: 'Patients Served' },
    { number: '99%', label: 'Patient Satisfaction' },
    { number: '40%', label: 'Reduced No-Shows' },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Cardiologist',
      text: 'Reduced administrative work by 70% and improved patient satisfaction significantly.',
      avatar: 'SC'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Pediatric Clinic Director',
      text: 'The time slot management system has optimized our clinic workflow perfectly.',
      avatar: 'MR'
    },
    {
      name: 'MediCare Group',
      role: 'Multi-Specialty Hospital',
      text: 'Scaled our appointment system across 15 clinics seamlessly.',
      avatar: 'MG'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-teal-500 to-emerald-600 size-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="size-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  DocScheduler
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Edition</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#features" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a 
                href="#specializations" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('specializations').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Specializations
              </a>
              <a 
                href="/termsOfService" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-sm"
              >
                Terms
              </a>
              <a 
                href="/privacyPolicy" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-sm"
              >
                Privacy Policy
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/signin')}
                className="group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/10 dark:to-emerald-900/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2305b8a4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-200 dark:border-teal-800">
                <Sparkles className="size-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                  Trusted by 5,000+ Healthcare Providers
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="block text-gray-900 dark:text-white">Modern Healthcare</span>
                <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Appointment System
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
                Streamline patient scheduling, reduce administrative burden, and enhance patient care with our professional appointment management platform designed specifically for healthcare providers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => router.push('/signin?mode=signup')}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    Start Free Trial
                    <ChevronRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => router.push('/signin')}
                  className="px-8 py-4 rounded-xl border-2 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-semibold hover:border-teal-500 hover:text-teal-800 dark:hover:text-teal-200 transition-all duration-300 hover:-translate-y-1"
                >
                  Schedule a Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="mt-12 lg:mt-0 relative">
              <div className="relative bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-3xl p-8 border border-teal-200 dark:border-teal-800 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                        <CalendarClock className="size-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Efficient Scheduling</h3>
                        <p className="text-sm text-gray-500">Smart time slot management for doctors</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['15-min intervals', 'Multiple doctors', 'Real-time updates'].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item}</span>
                          <CheckCircle className="size-4 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">95%</div>
                      <p className="text-sm text-gray-500 mt-1">Appointment Accuracy</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">98%</div>
                      <p className="text-sm text-gray-500 mt-1">Email Delivery Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <section id="specializations" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built for All Medical Specialties
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Customizable workflows for every healthcare discipline
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {specializations.map((spec, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600"
              >
                <div className="inline-flex p-3 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-3 group-hover:scale-110 transition-transform">
                  {spec.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {spec.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Healthcare-First Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Designed specifically for medical practices and healthcare providers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${feature.highlight ? 'ring-2 ring-teal-500/20' : ''}`}
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
                  {feature.highlight && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how medical practices are transforming their operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 size-12 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-teal-600 dark:text-teal-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="size-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-sm mb-8">
            <CalendarCheck className="size-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Practice?
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join thousands of healthcare providers who trust DocScheduler for efficient patient management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/signin?mode=signup')}
              className="px-8 py-4 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => router.push('/signin')}
              className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Sign In to Your Account
            </button>
          </div>
          <p className="text-sm text-teal-200 mt-6">
            Easy setup • 24/7 Support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-teal-800 to-emerald-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 size-10 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="size-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">DocScheduler</span>
                <p className="text-xs text-teal-200">Healthcare Edition</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-8">
              <a 
                href="/signin" 
                className="text-teal-200 hover:text-white transition-colors font-medium text-sm"
              >
                Sign In
              </a>
              <a 
                href="/termsOfService" 
                className="text-teal-200 hover:text-white transition-colors font-medium text-sm"
              >
                Terms of Service
              </a>
              <a 
                href="/privacyPolicy" 
                className="text-teal-200 hover:text-white transition-colors font-medium text-sm"
              >
                Privacy Policy
              </a>
            </div>
          </div>
          
          <div className="border-t border-teal-700 mt-8 pt-8 text-center text-sm">
            <p className="text-teal-300">© 2026 DocScheduler. All rights reserved.</p>
            <p className="text-xs text-teal-400 mt-2">Designed for medical professionals and healthcare providers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}