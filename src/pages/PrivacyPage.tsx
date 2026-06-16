import React from "react";
import { SEO } from "@/src/components/SEO";

export function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20">
      <SEO title="Privacy Policy" description="Privacy policy and data handling practices at Lake City Hospital." />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-slate-700 leading-relaxed text-lg">
            At Lake City Hospital, we take your privacy and the security of your personal health information very seriously. 
            This Privacy Policy describes how we collect, use, and protect your information.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 leading-relaxed">
            We collect personal and medical information that you provide to us directly through forms, appointments, and consultations. 
            This may include your name, contact details, medical history, and insurance information.
          </p>

          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 leading-relaxed">
            Your information is used solely to provide you with the best possible medical care. It helps our doctors make informed decisions, 
            allows us to process billing and insurance claims, and ensures smooth communication regarding your appointments and treatments.
          </p>

          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">3. Data Security and Confidentiality</h2>
          <p className="text-slate-700 leading-relaxed">
            We implement strict physical, electronic, and administrative security measures to protect your health data from unauthorized access. 
            All staff are bound by strict confidentiality agreements, and your records are stored securely in compliance with applicable healthcare regulations.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="text-slate-700 leading-relaxed">
            We do not sell your personal information. We may share necessary medical data with specialists, laboratories, or insurance providers 
            only as required for your direct medical treatment or billing, and only with your consent where required by law.
          </p>
          
          <p className="text-slate-500 mt-12 text-sm italic">
            Last updated: October 2023. For any privacy-related inquiries, please contact our administration.
          </p>
        </div>
      </div>
    </div>
  );
}
