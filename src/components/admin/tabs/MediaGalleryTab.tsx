import { authFetch } from "@/src/lib/authFetch.js";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import {
  ImageIcon,
  FileText,
  Plus,
  Edit,
  Trash2,
  Loader2,
  UploadCloud,
  Home,
} from "lucide-react";

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", files[0]);

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
          title: files[0].name || "Uploaded Image",
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

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image.");
      setIsUploading(false);
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
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-primary shrink-0"
                onClick={async (e) => {
                  e.stopPropagation();
                  const newName = prompt("Enter new folder name:", cat);
                  if (newName && newName.trim() !== "" && newName !== cat) {
                    const finalName = newName.trim();
                    const updatedFolders = [...folders];
                    updatedFolders[i] = finalName;
                    setFolders(updatedFolders);
                    if (activeFolder === cat) {
                      setActiveFolder(finalName);
                    }

                    // Update all media in this category
                    const itemsToUpdate = media.filter(
                      (m) => m.category === cat,
                    );
                    if (itemsToUpdate.length > 0) {
                      const tasks = itemsToUpdate.map((m) =>
                        authFetch(`/api/content/${m._id || m.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ category: finalName }),
                        }),
                      );
                      await Promise.all(tasks);
                      fetchMedia();
                    }
                  }
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-100 px-2 flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs flex-1 border border-dashed border-primary/30"
              onClick={() => {
                const name = prompt("Enter new folder name:");
                if (name) setFolders([...folders, name]);
              }}
            >
              + New Folder
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> {activeFolder}
              </h3>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded border border-primary/20 flex items-center gap-1" title="The home page gallery layout requires up to 6 images">
                <Home className="w-3.5 h-3.5" /> Home Page Layout: {media.filter(m => m.showOnHome).length} / 6 Assigned
              </span>
            </div>
            <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {activeMedia.length} files
            </span>
          </div>

          {/* Drag drop zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${isUploading ? "border-primary/50 bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Plus className="w-5 h-5 text-primary" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-700">
              {isUploading
                ? "Uploading to Cloudinary..."
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
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
                  className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
                >
                  <img
                    src={file.image}
                    alt={file.title || `Media ${i}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      title={file.showOnHome ? "Remove from Home Page" : "Show on Home Page"}
                      className={`h-8 w-8 text-white hover:bg-white/20 ${file.showOnHome ? 'bg-primary border-primary' : 'border-white bg-transparent'}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!file.showOnHome && media.filter(m => m.showOnHome).length >= 6) {
                          alert("Maximum 6 images can be shown on the home page gallery layout. Please remove one first.");
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
                    >
                      <Home className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      title="View Full Image"
                      className="h-8 w-8 text-white border-white bg-transparent hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.image, "_blank");
                      }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="danger"
                      className="h-8 w-8 text-white border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmTarget({ id: file._id || file.id, url: file.image });
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
    </div>
  );
}
