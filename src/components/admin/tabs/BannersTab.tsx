import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/Button";
import { ImagePlus, Loader2, Plus, Trash2, Edit } from "lucide-react";
import { authFetch } from "@/src/lib/authFetch.js";
import { toast } from "sonner";
import { ConfirmModal } from "../ConfirmModal";

export function BannersTab() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    desktopImage: "",
    mobileImage: "",
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const res = await authFetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const data = await res.json();
      setFormData((prev) => ({ ...prev, [type === "desktop" ? "desktopImage" : "mobileImage"]: data.data.url }));
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.desktopImage || !formData.mobileImage) {
      toast.error("Both Desktop and Mobile images are required");
      return;
    }

    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id || editingBanner.id}` : "/api/banners";
      const method = editingBanner ? "PUT" : "POST";
      
      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Banner ${editingBanner ? "updated" : "created"} successfully`);
        setIsModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await authFetch(`/api/banners/${deleteConfirmId}`, { method: "DELETE" });
      toast.success("Banner deleted");
      fetchBanners();
    } catch (err) {
      toast.error("Failed to delete banner");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Button onClick={() => { setEditingBanner(null); setFormData({ title: "", description: "", desktopImage: "", mobileImage: "", isActive: true }); setIsModalOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Banner
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <div key={banner._id || banner.id} className="bg-white p-4 flex gap-6 items-center rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-2">
              <div className="w-40 aspect-video rounded-lg overflow-hidden bg-slate-100 relative">
                <img src={banner.desktopImage} alt="Desktop" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">Desktop</span>
              </div>
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-100 relative">
                <img src={banner.mobileImage} alt="Mobile" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 text-[8px] bg-black/60 text-white px-1 py-0.5 rounded">Mobile</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900">{banner.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{banner.description}</p>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => {
                setEditingBanner(banner);
                setFormData({ title: banner.title, description: banner.description || "", desktopImage: banner.desktopImage, mobileImage: banner.mobileImage, isActive: banner.isActive });
                setIsModalOpen(true);
              }} className="p-2 text-slate-500 hover:text-primary transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => setDeleteConfirmId(banner._id || banner.id)} className="p-2 text-slate-500 hover:text-danger transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold">{editingBanner ? "Edit Banner" : "Add New Banner"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input type="text" required className="w-full border rounded-lg px-4 py-2" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full border rounded-lg px-4 py-2" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Desktop Image * (16:9)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      {formData.desktopImage ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                          <img src={formData.desktopImage} className="w-full h-full object-cover" />
                        </div>
                      ) : <div className="aspect-video bg-slate-50 rounded-lg mb-2 flex items-center justify-center"><ImagePlus className="w-8 h-8 text-slate-300" /></div>}
                      <input type="file" id="desktopUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "desktop")} />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("desktopUpload")?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload Desktop"}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile Image * (9:16)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      {formData.mobileImage ? (
                        <div className="relative w-24 mx-auto aspect-[9/16] rounded-lg overflow-hidden mb-2">
                          <img src={formData.mobileImage} className="w-full h-full object-cover" />
                        </div>
                      ) : <div className="w-24 mx-auto aspect-[9/16] bg-slate-50 rounded-lg mb-2 flex items-center justify-center"><ImagePlus className="w-6 h-6 text-slate-300" /></div>}
                      <input type="file" id="mobileUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "mobile")} />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("mobileUpload")?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload Mobile"}
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isUploading || !formData.desktopImage || !formData.mobileImage}>Save Banner</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
