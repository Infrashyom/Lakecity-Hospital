import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import { Button } from "@/src/components/ui/Button";
import { authFetch } from "@/src/lib/authFetch.js";
import {
  Edit,
  Eye,
  FileText,
  Home,
  ImageIcon,
  Loader2,
  Plus,
  Star,
  Trash2
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

export function MediaGalleryTab() {
  const [folders, setFolders] = useState([
    "Doctor Photos",
    "Hospital Facility / Infra",
    "Awards & Credentials",
  ]);
  const [activeFolder, setActiveFolder] = useState("Doctor Photos");
  const [media, setMedia] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; url: string } | null>(null);


  const [uploadModal, setUploadModal] = useState<{ isOpen: boolean; file: File | null; title: string }>({ isOpen: false, file: null, title: '' });

  const fetchMedia = async () => {
    try {
      const response = await authFetch("/api/content?type=media");
      if (response.ok) {
        const fetchedMedia = await response.json();
        setMedia(fetchedMedia);

        // Extract unique categories from media and combine with default ones
        const uniqueCategories = new Set([
          "Doctor Photos",
          "Hospital Facility / Infra",
          "Awards & Credentials",
        ]);
        fetchedMedia.forEach((m: any) => {
          if (m.category) {
            uniqueCategories.add(m.category);
          }
        });
        setFolders(Array.from(uniqueCategories));
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const activeMedia = media.filter((m) => m.category === activeFolder);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    let files;
    if (e.target && e.target.files) {
      files = e.target.files;
    } else if (e.dataTransfer && e.dataTransfer.files) {
      files = e.dataTransfer.files;
    }
    
    if (!files || files.length === 0) return;

    const file = files[0];
    const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
    setUploadModal({ isOpen: true, file, title: defaultTitle });
  };

  const processUpload = async () => {
    if (!uploadModal.file) return;

    setIsUploading(true);
    setUploadModal({ ...uploadModal, isOpen: false });

    try {
      const formData = new FormData();
      formData.append("image", uploadModal.file);

      const uploadRes = await authFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.data.url;

      // Save to our backend
      const saveResponse = await authFetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "media",
          title: uploadModal.title || uploadModal.file.name,
          image: imageUrl,
          category: activeFolder,
        }),
      });

      if (saveResponse.ok) {
        fetchMedia();
        toast.success("Image uploaded successfully.");
      } else {
        toast.error("Failed to save image record.");
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const mockEvent = {
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmTarget) return;
    const { id } = deleteConfirmTarget;
    try {
      const response = await authFetch(`/api/content/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMedia(media.filter((m) => (m._id || m.id) !== id));
      }
    } catch (error) {
      console.error("Error deleting media", error);
    } finally {
      setDeleteConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 px-2">Folders</h3>
          {folders.map((cat, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${activeFolder === cat ? "bg-primary/10 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"}`}
              onClick={() => setActiveFolder(cat)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span className="text-sm">{cat}</span>
              </div>

            </div>
          ))}

        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Media
              </Button>
              <div className="flex items-center gap-2 text-sm font-medium text-danger bg-danger/10 px-3 py-1.5 rounded-lg border border-danger/20">
                <ImageIcon className="w-4 h-4" /> Home Images: {media.filter(m => m.showOnHome).length}/6
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> {activeFolder}
              </h3>
              <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {activeMedia.length} files
              </span>
            </div>
          </div>

          {activeMedia.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No media files in this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeMedia.map((file, i) => (
                <div
                  key={file._id || i}
                  className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900"
                >
                  <img
                    src={file.image}
                    alt={file.title || `Media ${i}`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent opacity-100" />
                  
                  {/* Bottom text */}
                  <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                    <p className="font-medium text-sm truncate">{file.title || "Image"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-0.5">{file.category}</p>
                  </div>

                  {/* Fixed Star Icon (Top Right) */}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      title={file.showOnHome ? "Remove from Home Page" : "Show on Home Page"}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!file.showOnHome && media.filter(m => m.showOnHome).length >= 6) {
                          toast.error("Maximum 6 images can be shown on the home page gallery layout. Please remove one first.");
                          return;
                        }
                        try {
                          await authFetch(`/api/content/${file._id || file.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ showOnHome: !file.showOnHome }),
                          });
                          fetchMedia();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${file.showOnHome ? 'bg-yellow-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                    >
                      <Star className={`w-4 h-4 ${file.showOnHome ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Hover Actions (Center) */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                    <button
                      title="View Image"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.image, "_blank");
                      }}
                      className="p-3 rounded-full bg-white text-primary hover:bg-slate-50 transition-colors shadow-lg transform hover:scale-110"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmTarget({ id: file._id || file.id, url: file.image });
                      }}
                      className="p-3 rounded-full bg-white text-danger hover:bg-red-50 transition-colors shadow-lg transform hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={!!deleteConfirmTarget}
        title="Remove Image"
        message="Are you sure you want to remove this image? This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmTarget(null)}
      />


      {uploadModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Set Image Title</h3>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                value={uploadModal.title} 
                onChange={e => setUploadModal({ ...uploadModal, title: e.target.value })} 
                placeholder="Enter title for image"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => {
                  setUploadModal({ isOpen: false, file: null, title: '' });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}>Cancel</Button>
                <Button onClick={processUpload}>Upload</Button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
