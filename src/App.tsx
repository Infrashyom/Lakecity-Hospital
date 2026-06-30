/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FloatingActionButtons } from "@/src/components/layout/FloatingActionButtons";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { ScrollToTop } from "@/src/components/ScrollToTop";
import { useAnalyticsTracker } from "@/src/hooks/useAnalyticsTracker";
import { Loader2 } from "lucide-react";
import React, { Suspense, lazy } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Toaster } from "sonner";

// Lazy load pages for better performance
const Home = lazy(() => import("@/src/pages/Home").then(module => ({ default: module.Home })));
const BookAppointment = lazy(() => import("@/src/pages/BookAppointment").then(module => ({ default: module.BookAppointment })));
const Doctors = lazy(() => import("@/src/pages/Doctors").then(module => ({ default: module.Doctors })));
const DoctorProfile = lazy(() => import("@/src/pages/DoctorProfile").then(module => ({ default: module.DoctorProfile })));
const Departments = lazy(() => import("@/src/pages/Departments").then(module => ({ default: module.Departments })));
const About = lazy(() => import("@/src/pages/About").then(module => ({ default: module.About })));
const Contact = lazy(() => import("@/src/pages/Contact").then(module => ({ default: module.Contact })));
const Blog = lazy(() => import("@/src/pages/Blog").then(module => ({ default: module.Blog })));
const BlogDetails = lazy(() => import("@/src/pages/BlogDetails").then(module => ({ default: module.BlogDetails })));
const VirtualTour = lazy(() => import("@/src/pages/VirtualTour").then(module => ({ default: module.VirtualTour })));
const Gallery = lazy(() => import("@/src/pages/Gallery").then(module => ({ default: module.Gallery })));
const Insurances = lazy(() => import("@/src/pages/Insurances").then(module => ({ default: module.Insurances })));
const PrivacyPage = lazy(() => import("@/src/pages/PrivacyPage").then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import("@/src/pages/TermsPage").then(module => ({ default: module.TermsPage })));

const AdminLogin = lazy(() => import("@/src/pages/admin/AdminLogin").then(module => ({ default: module.AdminLogin })));
const AdminVerify = lazy(() => import("@/src/pages/admin/AdminVerify").then(module => ({ default: module.AdminVerify })));
const AdminDashboard = lazy(() => import("@/src/pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));

// Loading Fallback Component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

// Main Layout Wrapper
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <FloatingActionButtons />
  </>
);

export default function App() {
  useAnalyticsTracker();
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Main Website - With Navbar/Footer in App structure */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/departments" element={<MainLayout><Departments /></MainLayout>} />
          <Route path="/doctors" element={<MainLayout><Doctors /></MainLayout>} />
          <Route path="/doctors/:id" element={<MainLayout><DoctorProfile /></MainLayout>} />
          <Route path="/book" element={<MainLayout><BookAppointment /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
          <Route path="/blog/:id" element={<MainLayout><BlogDetails /></MainLayout>} />
          <Route path="/tour" element={<MainLayout><VirtualTour /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
          <Route path="/insurances" element={<MainLayout><Insurances /></MainLayout>} />
          <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
          <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />

          {/* Admin Portal */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify" element={<AdminVerify />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
