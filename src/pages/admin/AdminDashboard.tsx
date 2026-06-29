import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { AdminSidebar, AdminTab } from "@/src/components/admin/AdminSidebar";
import { BlogEditorModal } from "@/src/components/admin/BlogEditorModal";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import { ImageUpload } from "@/src/components/admin/ImageUpload";
import { DepartmentsTab } from "@/src/components/admin/tabs/DepartmentsTab";
import { InsurancesTab } from "@/src/components/admin/tabs/InsurancesTab";
import { MediaGalleryTab } from "@/src/components/admin/tabs/MediaGalleryTab";
import { VirtualTourTab } from "@/src/components/admin/tabs/VirtualTourTab";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { authFetch } from "@/src/lib/authFetch.js";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye, EyeOff,
  MessageSquare,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDoctorModal({ isOpen, onClose, onSave, editingDoctor, departments = [] }: { isOpen: boolean; onClose: () => void; onSave: (doc: any) => void; editingDoctor?: any; departments?: any[] }) {
  const [formData, setFormData] = useState({
    name: "", specialty: "", image: "", experience: "", availability: "", bio: "",
    registrationNumber: "", consultationFees: 500, opdTiming: "", languages: "", status: "ACTIVE", 
    department: "", education: "", affiliations: "", publications: "", expertise: "", awards: "", surgeriesCount: 0
  });

  useEffect(() => {
    if (editingDoctor) {
      setFormData({
        name: editingDoctor.name || "",
        specialty: editingDoctor.specialty || "",
        image: editingDoctor.image || "",
        experience: editingDoctor.experience || "",
        availability: editingDoctor.availability || "",
        bio: editingDoctor.bio || "",
        registrationNumber: editingDoctor.registrationNumber || "",
        consultationFees: editingDoctor.consultationFees || 500,
        opdTiming: editingDoctor.opdTiming || "",
        languages: (editingDoctor.languages || []).join(", "),
        status: editingDoctor.status || "ACTIVE",
        department: editingDoctor.department || "",
        education: Array.isArray(editingDoctor.education) ? editingDoctor.education.join("\n") : (editingDoctor.education || ""),
        affiliations: Array.isArray(editingDoctor.affiliations) ? editingDoctor.affiliations.join("\n") : (editingDoctor.affiliations || ""),
        publications: Array.isArray(editingDoctor.publications) ? editingDoctor.publications.join("\n") : (editingDoctor.publications || ""),
        expertise: Array.isArray(editingDoctor.expertise) ? editingDoctor.expertise.join("\n") : (editingDoctor.expertise || ""),
        awards: Array.isArray(editingDoctor.awards) ? editingDoctor.awards.join("\n") : (editingDoctor.awards || ""),
        surgeriesCount: editingDoctor.surgeriesCount || 0
      });
    } else {
      setFormData({ 
        name: "", specialty: "", image: "", experience: "", availability: "", bio: "",
        registrationNumber: "", consultationFees: 500, opdTiming: "", languages: "", status: "ACTIVE", 
        department: "", education: "", affiliations: "", publications: "", expertise: "", awards: "", surgeriesCount: 0
      });
    }
  }, [editingDoctor, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="font-bold text-lg">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name <span className="text-danger">*</span></label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Dr. John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Specialty <span className="text-danger">*</span></label>
              <Input value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} placeholder="Cardiology" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <select 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full rounded-md border border-slate-200 h-9 px-3 text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="">No Department</option>
                {departments.map((dep: any) => (
                  <option key={dep._id || dep.id} value={dep._id || dep.id}>{dep.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reg Number <span className="text-danger">*</span></label>
              <Input value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} placeholder="MCI-12345" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Experience (Years) <span className="text-danger">*</span></label>
              <Input type="number" min="0" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} placeholder="10" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Consultation Fees</label>
              <Input type="number" value={formData.consultationFees} onChange={(e) => setFormData({...formData, consultationFees: Number(e.target.value)})} placeholder="500" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Languages</label>
              <Input value={formData.languages} onChange={(e) => setFormData({...formData, languages: e.target.value})} placeholder="English, Hindi" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">OPD Timing</label>
              <Input value={formData.opdTiming} onChange={(e) => setFormData({...formData, opdTiming: e.target.value})} placeholder="10 AM - 2 PM" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Availability (Days)</label>
              <Input value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} placeholder="Mon, Wed, Fri" />
            </div>
          </div>
          <ImageUpload 
            value={formData.image} 
            onChange={(url) => setFormData({...formData, image: url})} 
            label="Doctor Photo"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Education (Separate by new line)</label>
              <textarea value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="MBBS, AIIMS&#10;MD - Cardiology" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Affiliations (Separate by new line)</label>
              <textarea value={formData.affiliations} onChange={(e) => setFormData({...formData, affiliations: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="Member of API&#10;Fellow of ACC" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Awards (Separate by new line)</label>
              <textarea value={formData.awards} onChange={(e) => setFormData({...formData, awards: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="Best Doctor 2021&#10;Excellence Award" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Expertise (Separate by new line)</label>
              <textarea value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="Heart Surgery&#10;Angioplasty" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Publications (Separate by new line)</label>
              <textarea value={formData.publications} onChange={(e) => setFormData({...formData, publications: e.target.value})} className="w-full rounded-xl border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="Journal of Cardiology 2020" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Successful Surgeries</label>
              <Input type="number" value={formData.surgeriesCount} onChange={(e) => setFormData({...formData, surgeriesCount: Number(e.target.value)})} placeholder="1000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})} 
              className="w-full rounded-xl border border-gray-200 p-3 min-h-[100px] text-sm focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Brief biography..."
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (!formData.name.trim() || !formData.specialty.trim() || !formData.registrationNumber.trim() || !String(formData.experience).trim() || !formData.availability.trim()) {
              toast.error("Name, Specialty, Reg Number, Experience, and Availability are mandatory fields.");
              return;
            }
            const payload: any = {
              ...formData, 
              experience: Number(formData.experience) || 0,
              surgeriesCount: Number(formData.surgeriesCount) || 0,
              consultationFees: formData.consultationFees ? Number(formData.consultationFees) : 500,
              languages: formData.languages.split(',').map(s=>s.trim()).filter(Boolean),
              education: formData.education.split(/\n|;/).map(s=>s.trim()).filter(Boolean),
              affiliations: formData.affiliations.split(/\n|;/).map(s=>s.trim()).filter(Boolean),
              publications: formData.publications.split(/\n|;/).map(s=>s.trim()).filter(Boolean),
              expertise: formData.expertise.split(/\n|;/).map(s=>s.trim()).filter(Boolean),
              awards: formData.awards.split(/\n|;/).map(s=>s.trim()).filter(Boolean),
            };
            if (!payload.department) {
              delete payload.department;
            }
            onSave(payload);
          }}>{editingDoctor ? 'Save Changes' : 'Add Doctor'}</Button>
        </div>
      </Card>
    </div>
  );
}

// BlogModal extracted to src/components/admin/BlogEditorModal.tsx

import { ReviewsTab } from "@/src/components/admin/tabs/ReviewsTab";
import { SettingsTab } from "@/src/components/admin/tabs/SettingsTab";
import { toast } from "sonner";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  
  // Custom Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [banConfirmDoctor, setBanConfirmDoctor] = useState<any | null>(null);
  const [deleteConfirmAppointmentId, setDeleteConfirmAppointmentId] = useState<string | null>(null);
  const [deleteConfirmBlogId, setDeleteConfirmBlogId] = useState<string | null>(null);

  const [apptSearchTerm, setApptSearchTerm] = useState("");
  const [apptFilterStatus, setApptFilterStatus] = useState("All");

  const navigate = useNavigate();

  const [clicks, setClicks] = useState<any[]>([]);

  const fetchAppointments = async () => {
    try {
      const apptsRes = await authFetch("/api/appointments");
      if (apptsRes.ok) setAppointments(await apptsRes.json());
    } catch (error) {
      console.error("Fetch errors:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const docsRes = await authFetch("/api/doctors");
      if (docsRes.ok) setDoctors(await docsRes.json());
    } catch (error) {
      console.error("Fetch errors:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await authFetch("/api/departments");
      if (res.ok) setDepartments(await res.json());
    } catch (error) {
       console.error("Fetch errors:", error);
    }
  };

  const fetchContent = async () => {
    try {
      const blogsRes = await authFetch("/api/content?type=blog");
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      const pagesRes = await authFetch("/api/content?type=page");
      if (pagesRes.ok) setPages(await pagesRes.json());
    } catch (error) {
      console.error("Fetch errors:", error);
    }
  };

  const fetchClicks = async () => {
    try {
      const res = await authFetch("/api/analytics/clicks");
      if (res.ok) setClicks(await res.json());
    } catch (error) {
      console.error("Fetch errors:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await authFetch("/api/reviews");
      if (res.ok) setReviews(await res.json());
    } catch (error) {
      console.error("Fetch errors:", error);
    }
  };

  useEffect(() => {
    // Automatically set a bypass token for direct access
    localStorage.setItem("admin_token", "bypass_token");
    
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
         fetchAppointments(), 
         fetchDoctors(), 
         fetchDepartments(), 
         fetchContent(),
         fetchClicks(),
         fetchReviews()
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    const adminDataString = localStorage.getItem("admin_info") || "{}";
    let email = "admin@lakecity.com";
    try {
      const parsed = JSON.parse(adminDataString);
      if (parsed.email) email = parsed.email;
    } catch(e) {}

    try {
      const res = await authFetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...passwordForm })
      });
      if (res.ok) {
        toast.success("Password updated");
        setIsPasswordModalOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await res.json();
        toast.error(error.message || "Error updating password");
      }
    } catch (error) {
      toast.error("Error updating password");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await authFetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = (a.patientName || "").toLowerCase().includes(apptSearchTerm.toLowerCase()) || 
                          (a.phone || "").includes(apptSearchTerm);
    const matchesStatus = apptFilterStatus === "All" || a.status === apptFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportAppointmentsCSV = () => {
    const headers = "Patient Name,Phone,Email,Doctor,Department,Date,Time,Status\n";
    const rows = filteredAppointments.map(a => 
      `"${a.patientName || ""}","${a.phone || ""}","${a.email || ""}","${a.doctorId?.name || 'Any Available'}","${a.department || 'General'}","${new Date(a.date).toLocaleDateString()}","${a.time}","${a.status}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveDoctor = async (docData: any) => {
    try {
      if (editingDoctor) {
        const response = await authFetch(`/api/doctors/${editingDoctor._id || editingDoctor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(docData)
        });
        if (response.ok) {
          fetchDoctors();
          setIsDoctorModalOpen(false);
          setEditingDoctor(null);
          toast.success("Doctor details updated successfully.");
        } else {
          toast.error("Failed to update doctor.");
        }
      } else {
        const response = await authFetch(`/api/doctors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(docData)
        });
        if (response.ok) {
          fetchDoctors();
          setIsDoctorModalOpen(false);
          toast.success("Doctor added successfully.");
        } else {
          toast.error("Failed to add doctor.");
        }
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("An error occurred while saving doctor.");
    }
  };

  const handleBanDoctor = async () => {
    if (!banConfirmDoctor) return;
    try {
      const updatedDoctor = { ...banConfirmDoctor, status: banConfirmDoctor.status === "BANNED" ? "ACTIVE" : "BANNED" };
      const response = await authFetch(`/api/doctors/${banConfirmDoctor._id || banConfirmDoctor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDoctor)
      });
      if (response.ok) {
        fetchDoctors();
        toast.success(`Doctor ${updatedDoctor.status === 'BANNED' ? 'banned' : 'unbanned'} successfully.`);
      } else {
        toast.error("Failed to update doctor status.");
      }
    } catch (error) {
      console.error("Error updating doctor status:", error);
      toast.error("An error occurred while updating doctor status.");
    } finally {
      setBanConfirmDoctor(null);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!deleteConfirmAppointmentId) return;
    try {
      const response = await authFetch(`/api/appointments/${deleteConfirmAppointmentId}`, { method: "DELETE" });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setDeleteConfirmAppointmentId(null);
    }
  };

  const handleSaveBlog = async (blogData: any) => {
    try {
      const method = editingBlog ? "PUT" : "POST";
      const url = editingBlog ? `/api/content/${editingBlog._id || editingBlog.id}` : `/api/content`;
      
      const payload = { ...blogData, type: "blog", slug: blogData.title.toLowerCase().replace(/\s+/g, '-') };

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchContent();
        setIsBlogModalOpen(false);
        setEditingBlog(null);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!deleteConfirmBlogId) return;
    try {
      const response = await authFetch(`/api/content/${deleteConfirmBlogId}`, { method: "DELETE" });
      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setDeleteConfirmBlogId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 w-full max-w-[100vw]">
        <AdminHeader 
          title={activeTab === 'content' ? 'Blog Manager' : activeTab === 'media' ? 'Media Gallery' : activeTab === 'tour' ? 'Virtual Tour' : activeTab} 
          onAddClick={
            activeTab === 'doctors' ? () => { setEditingDoctor(null); setIsDoctorModalOpen(true); } :
            activeTab === 'content' ? () => { setEditingBlog(null); setIsBlogModalOpen(true); } : 
            undefined
          }
          addLabel={activeTab === 'content' ? 'Write Article' : 'Add New'}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <AddDoctorModal 
          isOpen={isDoctorModalOpen} 
          onClose={() => { setIsDoctorModalOpen(false); setEditingDoctor(null); }} 
          onSave={handleSaveDoctor} 
          editingDoctor={editingDoctor} 
          departments={departments}
        />

        <BlogEditorModal
          isOpen={isBlogModalOpen}
          onClose={() => { setIsBlogModalOpen(false); setEditingBlog(null); }}
          onSave={handleSaveBlog}
          editingBlog={editingBlog}
        />

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-800">Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Today's Appointments</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {appointments.filter(a => {
                      const date = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
                      return date.toDateString() === new Date().toDateString();
                    }).length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Appointments</p>
                  <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Doctors</p>
                  <p className="text-3xl font-bold text-slate-900">{doctors.length}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Departments</p>
                  <p className="text-3xl font-bold text-slate-900">{departments.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">WhatsApp Clicks</p>
                  <p className="text-3xl font-bold text-success">{clicks.filter(c => c.type === 'whatsapp').length}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-slate-500 mb-1">Phone Clicks</p>
                  <p className="text-3xl font-bold text-blue-600">{clicks.filter(c => c.type === 'phone').length}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <Card glass className="bg-white border-none shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Visits</p>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card glass className="bg-white border-none shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">New</p>
                    <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'New').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card glass className="bg-white border-none shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'Completed').length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-800">Recent Appointments</h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Input 
                    placeholder="Search patient or phone..." 
                    value={apptSearchTerm}
                    onChange={(e) => setApptSearchTerm(e.target.value)}
                    className="h-9 w-full sm:w-64" 
                  />
                  <select 
                    className="h-9 rounded-md border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={apptFilterStatus}
                    onChange={(e) => setApptFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Button size="sm" className="gap-2 shrink-0" onClick={exportAppointmentsCSV}>
                    Export CSV
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Patient</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Doctor / Dept</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appt, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{appt.patientName}</p>
                           <p className="text-xs text-slate-500 mt-1 cursor-pointer hover:text-primary transition-colors hover:underline">Add Note</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1 text-sm text-slate-600">
                             <a href={`tel:${appt.phone}`} className="hover:text-primary">{appt.phone}</a>
                             <a href={`mailto:${appt.email}`} className="text-xs">{appt.email}</a>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-medium">{appt.doctorId?.name || "Any Available"}</p>
                          <p className="text-xs text-slate-500">{appt.department || "General"}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(appt.date).toLocaleDateString()} <br/>
                          <span className="font-medium text-slate-800">{appt.time}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase select-none cursor-pointer outline-none border-2 border-transparent focus:border-slate-300 ${
                              appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' :
                              appt.status === 'Completed' ? 'bg-green-100 text-green-600' :
                              appt.status === 'New' ? 'bg-orange-100 text-orange-600' :
                              appt.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-slate-100 text-slate-600'
                            }`}
                            value={appt.status}
                            onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <Button
                               variant="outline"
                               size="icon"
                               className="text-green-600 border-green-200 hover:bg-green-50"
                               onClick={() => window.open(`https://wa.me/${appt.phone.replace(/\D/g,'')}`, '_blank')}
                             >
                                <MessageSquare className="w-4 h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="text-red-500 hover:text-red-700 hover:bg-red-50"
                               onClick={() => setDeleteConfirmAppointmentId(appt._id)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                          No appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "doctors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doc, i) => (
              <Card key={i} className={`border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow flex flex-col ${doc.status === 'INACTIVE' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-4 items-start mb-6">
                    <img 
                      src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e2e8f0&color=64748b&size=400`} 
                      alt={doc.name} 
                      className="w-16 h-16 rounded-2xl object-cover border shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight mb-1">{doc.name}</h3>
                      <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                      {doc.registrationNumber && <p className="text-[10px] text-slate-400 mt-0.5">Reg: {doc.registrationNumber}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Exp. / Fees</span>
                      <span className="font-bold text-slate-700">{doc.experience} Yrs / ₹{doc.consultationFees || 500}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Timing</span>
                      <span className="font-medium text-slate-700 truncate max-w-[120px]">{doc.opdTiming || 'Not set'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2" onClick={() => { setEditingDoctor(doc); setIsDoctorModalOpen(true); }}>
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button 
                        variant={doc.status === "BANNED" ? "success" : "danger"} 
                        className="flex-1 gap-2" 
                        onClick={() => setBanConfirmDoctor(doc)}
                      >
                        {doc.status === "BANNED" ? "Unban" : "Ban"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {doctors.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center text-slate-400">
                No doctors found.
              </div>
            )}
          </div>
        )}



        {activeTab === "departments" && (
          <DepartmentsTab 
            departments={departments} 
            doctors={doctors}
            fetchDepartments={fetchDepartments}
            fetchDoctors={fetchDoctors}
          />
        )}

        {activeTab === "insurances" && (
          <InsurancesTab />
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {blogs.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
                  No blog posts found. Create your first!
                </div>
              ) : (
                blogs.map((post, i) => (
                  <div key={post._id || i} className="bg-white rounded-xl p-4 flex flex-col md:flex-row gap-6 shadow-sm border border-slate-100 items-start">
                    <div className="w-full md:w-[240px] h-[160px] rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img 
                        src={post.image || `https://images.unsplash.com/photo-1576091160550-2173ff9e5eb4?w=400&h=300&fit=crop&random=${i}`} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col pt-2 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
                          <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{post.author || "ADMIN"}</span>
                          {!post.isPublished && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-orange-600">DRAFT</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100"
                            onClick={() => window.open(`/blog/${post.slug || post._id || post.id}`, "_blank")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100" 
                            onClick={() => { setEditingBlog(post); setIsBlogModalOpen(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100" 
                            onClick={() => setDeleteConfirmBlogId(post._id || post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 pr-12">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 pr-4 leading-relaxed">
                        {post.content ? post.content.replace(/<[^>]*>?/gm, '') : 'No description available for this post.'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewsTab 
            reviews={reviews} 
            onUpdate={async (id, updates) => {
              try {
                const res = await authFetch(`/api/reviews/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify(updates)
                });
                if(res.ok) {
                   fetchReviews();
                }
              } catch(e) {
                console.error("Failed to update review", e);
              }
            }} 
          />
        )}

        {activeTab === "media" && (
          <MediaGalleryTab />
        )}

        {activeTab === "tour" && (
          <VirtualTourTab />
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <SettingsTab />
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-none shadow-sm bg-danger/5 border-danger/20">
                <div className="p-6">
                  <h3 className="font-bold text-danger mb-2">Security & Roles</h3>
                  <p className="text-sm text-slate-600 mb-4">Manage admin roles, password resets, and view login logs.</p>
                  <Button variant="danger" className="w-full max-w-sm" onClick={() => {
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setIsPasswordModalOpen(true);
                  }}>Change Password</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm bg-white overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg">Change Password</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Current Password</label>
                <div className="relative">
                  <Input type={showCurrentPassword ? "text" : "password"} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="pr-10" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">New Password</label>
                <div className="relative">
                  <Input type={showNewPassword ? "text" : "password"} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="pr-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="pr-10" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={handlePasswordChange}>Update Password</Button>
            </div>
          </Card>
        </div>
      )}

      <ConfirmModal
        isOpen={!!banConfirmDoctor}
        title={banConfirmDoctor?.status === "BANNED" ? "Unban Doctor" : "Ban Doctor"}
        message={`Are you sure you want to ${banConfirmDoctor?.status === "BANNED" ? "unban" : "ban"} ${banConfirmDoctor?.name}?`}
        confirmText={banConfirmDoctor?.status === "BANNED" ? "Unban" : "Ban"}
        onConfirm={handleBanDoctor}
        onCancel={() => setBanConfirmDoctor(null)}
      />

      <ConfirmModal
        isOpen={!!deleteConfirmAppointmentId}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteAppointment}
        onCancel={() => setDeleteConfirmAppointmentId(null)}
      />

      <ConfirmModal
        isOpen={!!deleteConfirmBlogId}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteBlog}
        onCancel={() => setDeleteConfirmBlogId(null)}
      />
    </div>
  );
}
