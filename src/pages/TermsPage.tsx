import React from "react";
import { SEO } from "@/src/components/SEO";

export function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20">
      <SEO title="Terms and Conditions" description="Terms and conditions for using Lake City Hospital's services." />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-slate-700 leading-relaxed text-lg">
            Welcome to Lake City Hospital. By accessing our services or using our website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">1. Medical Disclaimer</h2>
          <p className="text-slate-700 leading-relaxed">
            The content provided on this website is for informational purposes only and is not intended to substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>

          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">2. Appointments and Cancellations</h2>
          <p className="text-slate-700 leading-relaxed">
            While we strive to honor all scheduled appointments promptly, medical emergencies may require us to reschedule. 
            We request that you provide at least 24 hours' notice for regular appointment cancellations to allow us to offer that time to another patient in need.
          </p>

          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">3. Financial Responsibilities</h2>
          <p className="text-slate-700 leading-relaxed">
            Patients or their guarantors are responsible for all charges incurred during treatment. For insurance claims, 
            it is the patient's responsibility to understand their coverage and fulfill any co-payments or deductibles as required by their policy.
          </p>

          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">4. Patient Conduct</h2>
          <p className="text-slate-700 leading-relaxed">
            We are committed to providing a safe, healing environment. We expect all patients and visitors to treat our staff and other patients with respect. 
            Aggressive behavior or harassment will not be tolerated and may result in discharge from the facility.
          </p>
          
          <p className="text-slate-500 mt-12 text-sm italic">
            Last updated: October 2023. These terms are subject to change without notice.
          </p>
        </div>
      </div>
    </div>
  );
}
