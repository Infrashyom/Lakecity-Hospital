import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { toast } from "sonner";

export function ReviewEditorModal({ isOpen, onClose, onSave, editingReview }: { isOpen: boolean; onClose: () => void; onSave: (review: any) => void; editingReview?: any }) {
  const [formData, setFormData] = useState({
    patientName: "",
    comment: "",
    rating: 5
  });

  useEffect(() => {
    if (isOpen) {
      if (editingReview) {
        setFormData({
          patientName: editingReview.patientName || "",
          comment: editingReview.comment || "",
          rating: editingReview.rating || 5
        });
      } else {
        setFormData({
          patientName: "",
          comment: "",
          rating: 5
        });
      }
    }
  }, [editingReview, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-xl text-slate-800">{editingReview ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Patient Name</label>
            <input 
              type="text" 
              value={formData.patientName} 
              onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 focus:ring-1 focus:ring-primary outline-none" 
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Review Text</label>
            <textarea 
              value={formData.comment} 
              onChange={(e) => setFormData({...formData, comment: e.target.value})} 
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-primary outline-none resize-y min-h-[120px]" 
              placeholder="Write the testimonial..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Rating</label>
            <input 
              type="number"
              min="1"
              max="5"
              value={formData.rating} 
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value) || 5})} 
              className="w-24 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 focus:ring-1 focus:ring-primary outline-none" 
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
             className="gap-2 bg-primary hover:bg-primary-dark text-white" 
             onClick={() => {
               if (!formData.patientName.trim() || !formData.comment.trim()) {
                 toast.error("Name and Review Text are required.");
                 return;
               }
               onSave(formData);
             }}
          >
             <Check className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
