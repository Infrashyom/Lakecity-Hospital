import { authFetch } from "@/src/lib/authFetch.js";
import React, { useState } from "react";
import { Plus, Building2, FileText, Edit, CheckCircle2, X } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";

function DepartmentModal({ isOpen, onClose, onSave, editingDept }: { isOpen: boolean; onClose: () => void; onSave: (dept: any) => void; editingDept?: any }) {
  const [formData, setFormData] = useState(editingDept || {
    name: "", shortDescription: "", 
    seoTitle: "", seoDescription: "", seoKeywords: "", status: "ACTIVE"
  });

  React.useEffect(() => {
    if (editingDept) {
      setFormData({ ...editingDept, status: editingDept.status || "ACTIVE" });
    } else {
      setFormData({
        name: "", shortDescription: "", 
        seoTitle: "", seoDescription: "", seoKeywords: "", status: "ACTIVE"
      });
    }
  }, [editingDept, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white overflow-hidden max-h-[90vh] flex flex-col rounded-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="font-bold text-lg">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department Name <span className="text-danger">*</span></label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Short Description</label>
              <textarea 
                value={formData.shortDescription || ''} 
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} 
                className="w-full rounded-xl border border-gray-200 p-3 min-h-[80px] text-sm focus:ring-2 focus:ring-primary outline-none" 
                placeholder="Overview of the department..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="deptStatus" 
                checked={formData.status === "ACTIVE"} 
                onChange={(e) => setFormData({...formData, status: e.target.checked ? "ACTIVE" : "INACTIVE"})} 
                className="rounded text-primary focus:ring-primary" 
              />
              <label htmlFor="deptStatus" className="text-sm font-medium">Active Department</label>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
               <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4"/> SEO & Meta Information</h3>
               <div>
                  <label className="text-sm font-medium mb-1 block">SEO Title</label>
                  <Input value={formData.seoTitle || ''} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} placeholder="Title for Search Engines" />
               </div>
               <div>
                  <label className="text-sm font-medium mb-1 block">SEO Meta Description</label>
                  <textarea 
                     value={formData.seoDescription || ''} 
                     onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} 
                     className="w-full rounded-xl border border-gray-200 p-3 min-h-[80px] text-sm focus:ring-2 focus:ring-primary outline-none" 
                     placeholder="Meta description..."
                  />
               </div>
               <div>
                  <label className="text-sm font-medium mb-1 block">SEO Keywords</label>
                  <Input value={formData.seoKeywords || ''} onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})} placeholder="e.g. cardiology, heart center, best cardiologist" />
               </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            if (!formData.name?.trim()) {
              alert("Department Name is required.");
              return;
            }
            onSave(formData);
          }}>{editingDept ? 'Save Changes' : 'Add Department'}</Button>
        </div>
      </Card>
    </div>
  );
}

export function DepartmentsTab({ departments, doctors, fetchDepartments, fetchDoctors }: { departments: any[], doctors: any[], fetchDepartments: () => void; fetchDoctors: () => void; }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  const handleSaveDepartment = async (deptData: any) => {
    try {
      const method = editingDept ? "PUT" : "POST";
      const url = editingDept ? `/api/departments/${editingDept._id || editingDept.id}` : `/api/departments`;
      
      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deptData)
      });

      if (response.ok) {
        fetchDepartments();
        setIsModalOpen(false);
        setEditingDept(null);
      }
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleSaveDoctor = async (docData: any) => {
      try {
        const response = await authFetch(`/api/doctors/${docData._id || docData.id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(docData)
        });
        if (response.ok) {
          fetchDoctors();
        }
      } catch (err) {
        console.error("Error updating doctor", err);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
         <div className="flex-1">
           <p className="text-slate-600 font-medium text-sm">Manage hospital departments, assign doctors, and configure SEO details.</p>
         </div>
        <Button onClick={() => { setEditingDept(null); setIsModalOpen(true); }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {departments.map((dept, i) => {
          const assignedDoctors = doctors.filter(d => 
            d.department === dept._id || d.department === dept.id
          );

          return (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all">
              <div className="p-5 flex flex-col items-start gap-4">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                  <div className="flex-1 flex gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{dept.name}</h3>
                      <p className="text-sm text-slate-500 font-medium w-full max-w-lg mb-2">{dept.shortDescription || 'No description provided.'}</p>
                      <div className="flex gap-4">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{assignedDoctors.length} Assigned Doctors</span>
                        {dept.seoTitle && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">SEO Configured</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0 justify-start md:justify-end">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => { setEditingDept(dept); setIsModalOpen(true); }}>
                      <Edit className="w-4 h-4" /> Edit Details
                    </Button>
                  </div>
                </div>

                {/* Assigned Doctors List */}
                <div className="w-full mt-4 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Assigned Doctors</h4>
                  {assignedDoctors.length === 0 ? (
                     <p className="text-xs text-slate-400 italic">No doctors assigned to this department yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {assignedDoctors.map(doc => (
                        <div key={doc._id || doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                          <p className="text-sm font-bold text-slate-800 truncate pr-2">{doc.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
        {departments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No departments found. Create your first department to get started.
          </div>
        )}
      </div>

      <DepartmentModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingDept(null); }} 
        onSave={handleSaveDepartment} 
        editingDept={editingDept}
      />
    </div>
  );
}
