"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  
import { ArrowLeft, Stethoscope } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 mb-6">Protecting Your Health Information with Security</p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* HIPAA Compliance Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
           
                <p className="text-teal-100 text-sm">Your medical data is protected under strict healthcare regulations</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-teal-100 text-sm">Data Encryption</div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">1</span>
                Our Commitment to Privacy
              </h2>
              <p className="text-slate-700 mb-4">
                At HealthCare, we are committed to protecting your personal health information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable laws. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">2</span>
                Information We Collect
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-emerald-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-teal-600 mr-2">🩺</span>
                    Medical Information
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      <span>Medical history and conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      <span>Medications and allergies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      <span>Appointment history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-teal-500 mr-2">•</span>
                      <span>Treatment notes and diagnoses</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-emerald-600 mr-2">👤</span>
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>Name, date of birth, and contact details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>Insurance information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>Emergency contact information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>Billing and payment information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">3</span>
                How We Use Your Information
              </h2>
              <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
                <div className="bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-800">Primary Uses</h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-teal-600">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Medical Care Coordination</h4>
                        <p className="text-slate-700 text-sm">Schedule and manage your appointments with healthcare providers</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-emerald-600">💊</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Treatment & Referrals</h4>
                        <p className="text-slate-700 text-sm">Facilitate communication between you and your healthcare team</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-teal-600">📊</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Health Analytics</h4>
                        <p className="text-slate-700 text-sm">Improve healthcare services through anonymized data analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-emerald-600">🔔</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-2">Patient Communications</h4>
                        <p className="text-slate-700 text-sm">Send appointment reminders and health notifications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">4</span>
                Data Security Measures
              </h2>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 mb-6 border border-emerald-100">
                <h3 className="font-bold text-slate-800 mb-4 text-center">Enterprise-Grade Security</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="text-2xl text-teal-600 mb-2">🔐</div>
                    <div className="font-medium text-slate-800">End-to-End Encryption</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="text-2xl text-teal-600 mb-2">📱</div>
                    <div className="font-medium text-slate-800">Two-Factor Authentication</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="text-2xl text-teal-600 mb-2">🛡️</div>
                    <div className="font-medium text-slate-800">Regular Security Audits</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="text-2xl text-teal-600 mb-2">👁️</div>
                    <div className="font-medium text-slate-800">Access Controls</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-700">
                We implement physical, technical, and administrative safeguards to protect your information against unauthorized access, disclosure, alteration, or destruction.
              </p>
            </div>

            {/* Your Rights */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">5</span>
                Your Privacy Rights
              </h2>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-teal-600 font-bold mr-3">A.</span>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Right to Access</h4>
                    <p className="text-slate-700 text-sm">Request copies of your medical records and health information</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-teal-600 font-bold mr-3">B.</span>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Right to Amend</h4>
                    <p className="text-slate-700 text-sm">Request corrections to inaccurate or incomplete information</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-teal-600 font-bold mr-3">C.</span>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Right to Restrict</h4>
                    <p className="text-slate-700 text-sm">Limit how we use or disclose your information</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-teal-600 font-bold mr-3">D.</span>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Right to Complain</h4>
                    <p className="text-slate-700 text-sm">File a complaint if you believe your privacy rights have been violated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy Officer Contact</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Privacy Inquiries</h3>
                    <p className="text-slate-700 mb-2">📧 privacy@healthcare.com</p>
                    <p className="text-slate-700">📞 +1 (555) 987-6543</p>
                    <p className="text-sm text-slate-600 mt-3">Monday-Friday, 9 AM - 5 PM EST</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Mailing Address</h3>
                    <p className="text-slate-700">
                      HealthCare Privacy Office<br />
                      123 Medical Plaza, Suite 500<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Notice */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">🔄</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Policy Updates</h3>
              <p className="text-teal-100">
                This Privacy Policy may be updated periodically. We will notify you of any material changes via email or through our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-600 mb-8">
          <p className="mb-4">Thank you for trusting HealthCare with your healthcare needs. We are committed to protecting your privacy and providing secure healthcare services.</p>
          <div className="flex justify-center space-x-6">
          
          
           
          </div>
        </div>
      </div>
    </div>
  );
};
