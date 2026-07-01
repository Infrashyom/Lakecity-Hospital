import { authFetch } from "@/src/lib/authFetch";
import { Loader2, UploadCloud, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className = "", label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Check size, e.g. < 20MB
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image is too large. Max size is 20MB");
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
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await res.json();
      onChange(data.data.url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <div className="flex gap-4 items-center">
        {value ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shrink-0 bg-slate-50 relative overflow-hidden group hover:bg-slate-100 hover:border-primary/50 transition-colors cursor-pointer">
             {isUploading ? (
               <div className="flex flex-col items-center gap-2">
                 <Loader2 className="w-6 h-6 animate-spin text-primary" />
                 <span className="text-xs text-primary font-medium">Uploading...</span>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-2">
                 <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                 <span className="text-xs text-slate-500 font-medium group-hover:text-primary transition-colors">Click to upload</span>
               </div>
             )}
             <input type="file" accept="image/*, image/heic, image/heif, .heic, .heif" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
          </div>
        )}
      </div>
    </div>
  );
}
