import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Calendar, CheckCircle2, Clock, FileText, Loader2, Mail, Phone, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "@/src/contexts/BookingContext";
import { toast } from "sonner";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookAppointmentModal({ isOpen, onClose }: BookAppointmentModalProps) {
    const { bookingDoctorId } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
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
            setDoctors(data.filter((doc: any) => doc.status !== "BANNED"));
          }
        }
      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setDepartments(data.filter((d: any) => d.status === "ACTIVE"));
          } else if (data && data.data && Array.isArray(data.data)) {
            setDepartments(data.data.filter((d: any) => d.status === "ACTIVE"));
          }
        }
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    
    if (isOpen) {
      fetchDoctors();
      fetchDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bookingDoctorId && isOpen && doctors.length > 0) {
      const doc = doctors.find(d => (d._id || d.id) === bookingDoctorId);
      if (doc && doc.department) {
        setFormData(prev => ({ 
          ...prev, 
          doctorId: bookingDoctorId,
          department: typeof doc.department === 'string' ? doc.department : (doc.department._id || doc.department.id)
        }));
      } else {
        setFormData(prev => ({ ...prev, doctorId: bookingDoctorId }));
      }
    }
  }, [bookingDoctorId, isOpen, doctors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "doctorId" && value) {
      const doc = doctors.find(d => (d._id || d.id) === value);
      if (doc && doc.department) {
        const deptId = typeof doc.department === 'string' ? doc.department : (doc.department._id || doc.department.id);
        setFormData(prev => ({ ...prev, [name]: value, department: deptId }));
        return;
      }
    }
    
    if (name === "department") {
      setFormData(prev => ({ ...prev, [name]: value, doctorId: "" })); // reset doctor if department changes
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          time: formData.timeSlot,
          department: formData.department || undefined,
          doctorId: formData.doctorId || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }
      
      setIsSubmitted(true);
      toast.success("Appointment request submitted successfully!");
    } catch (error) {
      toast.error("There was a problem submitting your request.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {

    
    setIsSubmitted(false);
    setFormData({
      patientName: "", phone: "", email: "", age: "", department: "", doctorId: "", date: "", timeSlot: "", reason: ""
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="appointment-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-20 pb-20"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl my-8 mx-auto"
          >
          <Card className="border-none shadow-2xl overflow-hidden rounded-2xl bg-white relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
                  Thank you for booking with us. Our desk will contact you shortly on <strong>{formData.phone}</strong> to confirm your appointment.
                </p>
                <Button onClick={handleClose} size="lg" className="px-8">
                  Done
                </Button>
              </CardContent>
            ) : (
              <>
                <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Book an Appointment</h2>
                  <p className="text-slate-600">Schedule your visit with our specialists.</p>
                </div>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Form Fields... (same as previous) */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> Patient Full Name
                          </label>
                          <Input required name="patientName" value={formData.patientName} onChange={handleInputChange} className="h-12" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Age</label>
                          <Input required name="age" type="number" value={formData.age} onChange={handleInputChange} className="h-12" placeholder="e.g. 35" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" /> Phone Number
                          </label>
                          <Input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="h-12" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" /> Email Address
                          </label>
                          <Input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="h-12" placeholder="john@example.com" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Department *</label>
                        <select 
                          required name="department"
                          className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          value={formData.department}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept: any) => (
                            <option key={dept._id || dept.id} value={dept._id || dept.id}>{dept.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Preferred Doctor (Optional)</label>
                        <select 
                          name="doctorId"
                          className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                          value={formData.doctorId}
                          onChange={handleInputChange}
                        >
                          <option value="">Any Available Doctor</option>
                          {doctors.filter((doc: any) => !formData.department || (typeof doc.department === 'string' ? doc.department === formData.department : (doc.department?._id === formData.department || doc.department?.id === formData.department))).map((doc: any) => (
                            <option key={doc._id || doc.id} value={doc._id || doc.id}>Dr. {doc.name} - {doc.specialty}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" /> Preferred Date
                        </label>
                        <Input 
                          required 
                          name="date"
                          type="date" min={new Date().toISOString().split("T")[0]} 
                          value={formData.date}
                          onChange={handleInputChange}
                          className="h-12"
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
                          <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" /> Symptoms / Reason for Visit
                        </label>
                        <textarea 
                          required
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          className="flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-none"
                          placeholder="Briefly describe your symptoms or reason for appointment..."
                        />
                      </div>
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
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
