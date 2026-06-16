import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { authFetch } from "@/src/lib/authFetch";
import { ImageUpload } from "@/src/components/admin/ImageUpload";

export function SettingsTab() {
  const [formData, setFormData] = useState({
    hospitalName: "",
    logoUrl: "",
    homeVideoUrl: "",
    aboutUsImageUrl: "",
    contactNumbers: ["", ""],
    emails: [""],
    address: "",
    googleMapsLink: "",
    whatsappNumber: "",
    socialHandles: {
      youtube: "",
      instagram: ""
    }
  });
  
  const [seoDefaults, setSeoDefaults] = useState({
    metaTitle: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await authFetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          hospitalName: data.hospitalName || "",
          logoUrl: data.logoUrl || "",
          homeVideoUrl: data.homeVideoUrl || "",
          aboutUsImageUrl: data.aboutUsImageUrl || "",
          contactNumbers: [
            data.contactNumbers?.[0] || "",
            data.contactNumbers?.[1] || ""
          ],
          emails: data.emails || [""],
          address: data.address || "",
          googleMapsLink: data.googleMapsLink || "",
          whatsappNumber: data.whatsappNumber || "",
          socialHandles: {
            youtube: data.socialHandles?.youtube || "",
            instagram: data.socialHandles?.instagram || ""
          }
        });
        if (data.seoDefaults) {
          setSeoDefaults(data.seoDefaults);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        contactNumbers: formData.contactNumbers.filter(Boolean),
        emails: formData.emails.filter(Boolean),
        seoDefaults
      };

      const res = await authFetch("/api/settings", {
        method: "POST", // The settingController uses POST/PUT properly or we can check
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
        setEditMode(false);
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm bg-white">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">General Information</h3>
                {editMode ? (
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setEditMode(true)} variant="outline" className="gap-2">
                    Edit
                  </Button>
                )}
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Hospital Logo</label>
                   {editMode ? (
                     <ImageUpload 
                       value={formData.logoUrl} 
                       onChange={(url) => setFormData({...formData, logoUrl: url})} 
                       label="Upload Logo (Cloudinary)" 
                     />
                   ) : (
                     <div className="h-20 w-auto">
                       {formData.logoUrl ? (
                         <img src={formData.logoUrl} alt="Logo" className="h-full object-contain" />
                       ) : (
                         <span className="text-sm text-slate-400">No logo uploaded</span>
                       )}
                     </div>
                   )}
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">About Us Image</label>
                   {editMode ? (
                     <ImageUpload 
                       value={formData.aboutUsImageUrl} 
                       onChange={(url) => setFormData({...formData, aboutUsImageUrl: url})} 
                       label="Upload About Us Image (Cloudinary)" 
                     />
                   ) : (
                     <div className="h-20 w-auto">
                       {formData.aboutUsImageUrl ? (
                         <img src={formData.aboutUsImageUrl} alt="About Us" className="h-full object-contain" />
                       ) : (
                         <span className="text-sm text-slate-400">No about us image uploaded</span>
                       )}
                     </div>
                   )}
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Home Video URL (YouTube)</label>
                   <Input 
                     value={formData.homeVideoUrl} 
                     onChange={(e) => setFormData({...formData, homeVideoUrl: e.target.value})} 
                     className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                     disabled={!editMode}
                     placeholder="https://www.youtube.com/embed/..."
                   />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Hospital Name</label>
                   <Input 
                     value={formData.hospitalName} 
                     onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} 
                     className="bg-slate-100 cursor-not-allowed opacity-70" 
                     disabled
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Primary Phone</label>
                      <Input 
                        value={formData.contactNumbers[0]} 
                        onChange={(e) => {
                          const newNums = [...formData.contactNumbers];
                          newNums[0] = e.target.value;
                          setFormData({...formData, contactNumbers: newNums});
                        }} 
                        className="bg-slate-100 cursor-not-allowed opacity-70" 
                        disabled
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Emergency Phone</label>
                      <Input 
                        value={formData.contactNumbers[1]} 
                        onChange={(e) => {
                          const newNums = [...formData.contactNumbers];
                          newNums[1] = e.target.value;
                          setFormData({...formData, contactNumbers: newNums});
                        }} 
                        className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editMode}
                      />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Primary Email</label>
                   <Input 
                     value={formData.emails[0] || ""} 
                     onChange={(e) => {
                       const newEmails = [...formData.emails];
                       newEmails[0] = e.target.value;
                       setFormData({...formData, emails: newEmails});
                     }} 
                     className="bg-slate-100 cursor-not-allowed opacity-70" 
                     disabled
                   />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Address</label>
                   <textarea
                     className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm focus-visible:outline-none cursor-not-allowed opacity-70"
                     value={formData.address}
                     onChange={(e) => setFormData({...formData, address: e.target.value})}
                     disabled
                   />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Google Maps Link</label>
                   <Input 
                     value={formData.googleMapsLink} 
                     onChange={(e) => setFormData({...formData, googleMapsLink: e.target.value})} 
                     className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                     disabled={!editMode}
                   />
                </div>
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="border-none shadow-sm bg-white">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800">Integrations & SEO</h3>
                   {editMode ? (
                     <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                       Save
                     </Button>
                   ) : (
                     <Button size="sm" onClick={() => setEditMode(true)} variant="outline" className="gap-2">
                       Edit
                     </Button>
                   )}
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">WhatsApp API Number</label>
                      <Input 
                        value={formData.whatsappNumber} 
                        onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} 
                        className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editMode}
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">YouTube Link</label>
                      <Input 
                        value={formData.socialHandles.youtube} 
                        onChange={(e) => setFormData({...formData, socialHandles: { ...formData.socialHandles, youtube: e.target.value }})} 
                        className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editMode}
                        placeholder="https://www.youtube.com/@lakecityhospitalbhopal"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Instagram Link</label>
                      <Input 
                        value={formData.socialHandles.instagram} 
                        onChange={(e) => setFormData({...formData, socialHandles: { ...formData.socialHandles, instagram: e.target.value }})} 
                        className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editMode}
                        placeholder="https://www.instagram.com/lakecity.hospital/"
                      />
                   </div>

                   <hr className="my-4 border-slate-200" />
                   
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Default Meta Title</label>
                      <Input 
                        value={seoDefaults.metaTitle} 
                        onChange={(e) => setSeoDefaults({...seoDefaults, metaTitle: e.target.value})} 
                        className={!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        placeholder="Lake City Caring Partners"
                        disabled={!editMode}
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Default Meta Description</label>
                      <textarea
                        className={`flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${!editMode ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"}`}
                        value={seoDefaults.description}
                        onChange={(e) => setSeoDefaults({...seoDefaults, description: e.target.value})}
                        disabled={!editMode}
                      />
                   </div>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
}
