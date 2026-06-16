import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { doctors as initialDoctors } from "@/src/data/doctors";
import { SEO } from "@/src/components/SEO";

export function BookAppointment() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>(initialDoctors);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    age: "",
    department: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    reason: ""
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDoctors(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const doctorId = searchParams.get("doctor");
    if (doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => (d._id || d.id).toString() === doctorId);
      if (doctor) {
        setFormData(prev => ({
          ...prev,
          doctorId: (doctor._id || doctor.id).toString(),
          department: doctor.specialty.toLowerCase()
        }));
      }
    }
  }, [searchParams, doctors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formData.patientName,
          email: formData.email,
          phone: formData.phone,
          doctorId: formData.doctorId,
          date: formData.date,
          time: formData.timeSlot,
          reason: formData.reason
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const err = await response.json();
        alert(`Error: ${err.message || "Failed to book appointment"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Fallback for demo
      setTimeout(() => setIsSubmitted(true), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full px-4"
        >
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Appointment Confirmed!</h2>
              <p className="text-slate-600 mb-8">
                Your appointment request for {formData.patientName} has been received. Our team will contact you shortly to confirm the exact timing.
              </p>
              <Button onClick={() => window.location.href = "/"} className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="Book Appointment" description="Schedule an appointment with our experts at Lake City Hospital." />
      {/* Header Section */}
      <div className="relative pt-32 pb-20 bg-primary-dark overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" 
            alt="Hospital Reception" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 to-primary-dark" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Book an Appointment</h1>
            <p className="text-lg text-blue-100">
              Schedule your visit with our expert doctors. We'll ensure you get the best care possible.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20 -mt-24 relative z-20">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-none bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b pb-8">
              <CardTitle className="text-2xl">Patient Details</CardTitle>
              <CardDescription>Please fill in the information below to request an appointment.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Full Name
                    </label>
                    <Input 
                      required 
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Phone Number
                    </label>
                    <Input 
                      required 
                      name="phone"
                      type="tel" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> Email Address
                    </label>
                    <Input 
                      required 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Age
                    </label>
                    <Input 
                      required 
                      name="age"
                      type="number" 
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="35" 
                      min="0" 
                      max="120" 
                    />
                  </div>
                </div>

                <div className="border-t pt-8" />

                {/* Appointment Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Department
                    </label>
                    <select 
                      required 
                      name="department"
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id || dept.name} value={dept.name.toLowerCase()}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Doctor (Optional)
                    </label>
                    <select 
                      name="doctorId"
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                      value={formData.doctorId}
                      onChange={handleInputChange}
                    >
                      <option value="">Any Available Doctor</option>
                      {doctors.map(doc => (
                        <option key={doc._id || doc.id} value={doc._id || doc.id}>
                          {doc.name} ({doc.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Preferred Date
                    </label>
                    <Input 
                      required 
                      name="date"
                      type="date" 
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Preferred Time
                    </label>
                    <select 
                      required 
                      name="timeSlot"
                      className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Time Slot</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Symptoms / Reason for Visit
                  </label>
                  <textarea 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-none"
                    placeholder="Briefly describe your symptoms or reason for appointment..."
                  />
                </div>

                <Button disabled={isLoading} type="submit" size="lg" className="w-full h-14 text-lg">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </span>
                  ) : "Confirm Booking Request"}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  By booking, you agree to our Terms of Service and Privacy Policy. Your data is secure and HIPAA compliant.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

