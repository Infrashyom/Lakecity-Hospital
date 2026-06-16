import React, { useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { authFetch } from "@/src/lib/authFetch";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className = "", label = "Image URL" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Check size, e.g. < 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max size is 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const res = await authFetch("/api/upload", {
        method: "POST",
        body: formData, // do not stringify
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onChange(data.data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Check server configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <div className="flex gap-2 items-start">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shrink-0 bg-slate-50 relative overflow-hidden group hover:bg-slate-100 transition-colors">
             {isUploading ? (
               <Loader2 className="w-5 h-5 animate-spin text-primary" />
             ) : (
               <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
             )}
             <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border border-slate-200 h-9 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Or enter a direct image URL"
          />
          <p className="text-xs text-slate-500">
            Click the box to upload, or paste a URL directly.
          </p>
        </div>
      </div>
    </div>
  );
}
