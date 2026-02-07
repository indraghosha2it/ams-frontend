"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function TermsOfService() {
  const router = useRouter();


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50">
      {/* Navigation Bar */}
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
                onClick={() => router.push('/')}
                className="group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="flex items-center">
               <ArrowLeft className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />

                Back to Home
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full mb-6">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">1</span>
                Introduction
              </h2>
              <p className="text-slate-700 mb-4">
                Welcome to DocScheduler, a digital platform connecting patients with healthCare professionals. These Terms of Service govern your use of our appointment booking services, website, and related applications.
              </p>
              <p className="text-slate-700">
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>

            {/* Services Provided */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">2</span>
                Medical Appointment Services
              </h2>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 mb-6 border border-emerald-100">
                <h3 className="font-bold text-slate-800 mb-3">What We Provide:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span>Online appointment scheduling with certified DocScheduler professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span>Secure patient information management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span>Appointment reminder mails</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">✓</span>
                    <span>Digital health record access (where applicable)</span>
                  </li>
                </ul>
              </div>
              <p className="text-slate-700">
                <strong className="text-slate-900">Important:</strong> Our platform facilitates appointments but does not provide medical advice, diagnosis, or treatment. All medical decisions should be made in consultation with licensed DocScheduler providers.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">3</span>
                User Responsibilities
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-teal-600">👤</span>
                    </div>
                    <h4 className="font-bold text-slate-800">Account Accuracy</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    You must provide accurate personal and medical information. Keep your contact details updated for appointment notifications.
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-emerald-600">⏰</span>
                    </div>
                    <h4 className="font-bold text-slate-800">Appointment Management</h4>
                  </div>
                  <p className="text-slate-700 text-sm">
                    Arrive on time for appointments. Cancel or reschedule at least 24 hours in advance to avoid cancellation fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">4</span>
                Cancellation & No-Show Policy
              </h2>
              <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4">
                  <h3 className="font-bold text-lg">Cancellation Guidelines</h3>
                </div>
                <div className="bg-white p-6">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-slate-700 font-semibold">Time Before Appointment</th>
                        <th className="py-3 px-4 text-left text-slate-700 font-semibold">Cancellation Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-700">More than 24 hours</td>
                        <td className="py-3 px-4 text-emerald-600 font-medium">No charge</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-700">4-24 hours</td>
                        <td className="py-3 px-4 text-amber-600 font-medium">50% of appointment fee</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-700">Less than 4 hours or No-show</td>
                        <td className="py-3 px-4 text-red-600 font-medium">Full appointment fee</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">5</span>
                Privacy & Data Security
              </h2>
              <p className="text-slate-700 mb-4">
                We take your privacy seriously. All medical information is protected under HIPAA regulations and our comprehensive Privacy Policy. We implement industry-standard security measures to protect your data.
              </p>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-bold text-slate-800 mb-3">Your Data Rights:</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>Right to access your medical records</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>Right to request corrections</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>Right to data portability</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>Right to request deletion</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Need Help?</h2>
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white">
                <h3 className="font-bold text-xl mb-4">Contact Our Legal Team</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2">📧 legal@DocScheduler.com</p>
                    <p>📞 +1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-teal-100">For medical emergencies, please call 911 or visit your nearest emergency room.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600 mb-8">
          <p>By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
        </div>
      </div>
    </div>
  );
};
