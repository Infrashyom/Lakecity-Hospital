import { ImageUpload } from "@/src/components/admin/ImageUpload";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { authFetch } from "@/src/lib/authFetch";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSettings } from "@/src/contexts/SettingsContext";

export function SettingsTab() {
  const { refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    hospitalName: "",
    logoUrl: "",
    aboutUsImageUrl: "",
    featuredVideos: ["", "", ""],
    heroCarousel: [
      { image: "", title: "", description: "" },
      { image: "", title: "", description: "" },
      { image: "", title: "", description: "" }
    ],
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
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingIntegrations, setIsSavingIntegrations] = useState(false);
  
  const [editModeGeneral, setEditModeGeneral] = useState(false);
  const [editModeIntegrations, setEditModeIntegrations] = useState(false);

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
          aboutUsImageUrl: data.aboutUsImageUrl || "",
          featuredVideos: data.featuredVideos?.length === 3 ? data.featuredVideos : [
            data.featuredVideos?.[0] || "",
            data.featuredVideos?.[1] || "",
            data.featuredVideos?.[2] || ""
          ],
          heroCarousel: data.heroCarousel?.length === 3 ? data.heroCarousel : [
            data.heroCarousel?.[0] || { image: "", title: "", description: "" },
            data.heroCarousel?.[1] || { image: "", title: "", description: "" },
            data.heroCarousel?.[2] || { image: "", title: "", description: "" }
          ],
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

  const handleSave = async (section: "general" | "integrations") => {
    if (section === "general") setIsSavingGeneral(true);
    else setIsSavingIntegrations(true);

    try {
      const payload = {
        ...formData,
        contactNumbers: formData.contactNumbers.filter(Boolean),
        emails: formData.emails.filter(Boolean),
        seoDefaults
      };

      const res = await authFetch("/api/settings", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
        if (section === "general") setEditModeGeneral(false);
        else setEditModeIntegrations(false);
        await refreshSettings();
      } else {
        const errText = await res.text();
        console.error("Save settings error:", errText);
        toast.error("Failed to save settings: " + errText);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings");
    } finally {
      if (section === "general") setIsSavingGeneral(false);
      else setIsSavingIntegrations(false);
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
                {editModeGeneral ? (
                  <Button size="sm" onClick={() => handleSave("general")} disabled={isSavingGeneral} className="gap-2">
                    {isSavingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setEditModeGeneral(true)} variant="outline" className="gap-2">
                    Edit
                  </Button>
                )}
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Hospital Logo</label>
                   {editModeGeneral ? (
                     <ImageUpload 
                       value={formData.logoUrl} 
                       onChange={(url) => setFormData({...formData, logoUrl: url})} 
                       label="Upload Logo" 
                     />
                   ) : (
                     <div className="h-20 w-auto bg-slate-50 border border-slate-100 rounded-md p-2 flex items-center justify-center">
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
                   {editModeGeneral ? (
                     <ImageUpload 
                       value={formData.aboutUsImageUrl} 
                       onChange={(url) => setFormData({...formData, aboutUsImageUrl: url})} 
                       label="Upload About Us Image" 
                     />
                   ) : (
                     <div className="h-20 w-auto bg-slate-50 border border-slate-100 rounded-md p-2 flex items-center justify-center">
                       {formData.aboutUsImageUrl ? (
                         <img src={formData.aboutUsImageUrl} alt="About Us" className="h-full object-contain" />
                       ) : (
                         <span className="text-sm text-slate-400">No about us image uploaded</span>
                       )}
                     </div>
                   )}
                </div>
                <div className="space-y-4 border border-slate-200 rounded-xl p-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Hero Carousel (3 Images)</h4>
                    <p className="text-xs text-slate-500 mt-1">Recommended aspect ratio: 16:9 or 4:3 (e.g., 1280x720 or 800x600).</p>
                  </div>
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="border-t border-slate-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Slide {idx + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase text-slate-500 block">Image</label>
                           {editModeGeneral ? (
                             <ImageUpload 
                               value={formData.heroCarousel[idx].image}
                               onChange={(url) => {
                                 const newCarousel = [...formData.heroCarousel];
                                 newCarousel[idx].image = url;
                                 setFormData({...formData, heroCarousel: newCarousel});
                               }}
                             />
                           ) : (
                             <Input 
                               value={formData.heroCarousel[idx].image} 
                               className="bg-slate-50 cursor-not-allowed opacity-70"
                               disabled
                               placeholder="No image uploaded"
                             />
                           )}
                           <label className="text-xs font-bold uppercase text-slate-500 block mt-3">Title</label>
                           <Input 
                             value={formData.heroCarousel[idx].title} 
                             onChange={(e) => {
                               const newCarousel = [...formData.heroCarousel];
                               newCarousel[idx].title = e.target.value;
                               setFormData({...formData, heroCarousel: newCarousel});
                             }} 
                             className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                             disabled={!editModeGeneral}
                           />
                        </div>
                        <div>
                           <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Description</label>
                           <textarea 
                             value={formData.heroCarousel[idx].description} 
                             onChange={(e) => {
                               const newCarousel = [...formData.heroCarousel];
                               newCarousel[idx].description = e.target.value;
                               setFormData({...formData, heroCarousel: newCarousel});
                             }} 
                             className={`flex min-h-[105px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"}`}
                             disabled={!editModeGeneral}
                           />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Hospital Name</label>
                   <Input 
                     value={formData.hospitalName} 
                     onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} 
                     className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                     disabled={!editModeGeneral}
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
                        className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeGeneral}
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
                        className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeGeneral}
                      />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Primary Email</label>
                      <Input 
                        value={formData.emails[0] || ""} 
                        onChange={(e) => {
                          const newEmails = [...formData.emails];
                          newEmails[0] = e.target.value;
                          setFormData({...formData, emails: newEmails});
                        }} 
                        className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeGeneral}
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Secondary Email</label>
                      <Input 
                        value={formData.emails[1] || ""} 
                        onChange={(e) => {
                          const newEmails = [...formData.emails];
                          newEmails[1] = e.target.value;
                          setFormData({...formData, emails: newEmails});
                        }} 
                        className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeGeneral}
                      />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Address</label>
                   <textarea
                     className={`flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"}`}
                     value={formData.address}
                     onChange={(e) => setFormData({...formData, address: e.target.value})}
                     disabled={!editModeGeneral}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Google Maps Link</label>
                   <Input 
                     value={formData.googleMapsLink} 
                     onChange={(e) => setFormData({...formData, googleMapsLink: e.target.value})} 
                     className={!editModeGeneral ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                     disabled={!editModeGeneral}
                   />
                </div>
             </div>
          </Card>

          <div className="space-y-6">
             <Card className="border-none shadow-sm bg-white">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800">Integrations & SEO</h3>
                   {editModeIntegrations ? (
                     <Button size="sm" onClick={() => handleSave("integrations")} disabled={isSavingIntegrations} className="gap-2">
                       {isSavingIntegrations ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                       Save
                     </Button>
                   ) : (
                     <Button size="sm" onClick={() => setEditModeIntegrations(true)} variant="outline" className="gap-2">
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
                        className={!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeIntegrations}
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">YouTube Link</label>
                      <Input 
                        value={formData.socialHandles.youtube} 
                        onChange={(e) => setFormData({...formData, socialHandles: { ...formData.socialHandles, youtube: e.target.value }})} 
                        className={!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeIntegrations}
                        placeholder="https://www.youtube.com/@lakecityhospitalbhopal"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Instagram Link</label>
                      <Input 
                        value={formData.socialHandles.instagram} 
                        onChange={(e) => setFormData({...formData, socialHandles: { ...formData.socialHandles, instagram: e.target.value }})} 
                        className={!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        disabled={!editModeIntegrations}
                        placeholder="https://www.instagram.com/lakecity.hospital/"
                      />
                   </div>

                   <hr className="my-4 border-slate-200" />
                   
                   <div className="space-y-4 border border-slate-200 rounded-xl p-4">
                     <h4 className="font-bold text-slate-800 text-sm">Featured YouTube Videos (Homepage)</h4>
                     <p className="text-xs text-slate-500 mt-1">Add up to 3 YouTube video URLs to feature on the homepage.</p>
                     {[0, 1, 2].map((idx) => (
                       <div key={idx} className="border-t border-slate-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                          <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Video {idx + 1} URL</label>
                          <Input 
                            value={formData.featuredVideos[idx]} 
                            onChange={(e) => {
                              const newVideos = [...formData.featuredVideos];
                              newVideos[idx] = e.target.value;
                              setFormData({...formData, featuredVideos: newVideos});
                            }} 
                            className={!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                            disabled={!editModeIntegrations}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                       </div>
                     ))}
                   </div>

                   <hr className="my-4 border-slate-200" />
                   
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Default Meta Title</label>
                      <Input 
                        value={seoDefaults.metaTitle} 
                        onChange={(e) => setSeoDefaults({...seoDefaults, metaTitle: e.target.value})} 
                        className={!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"} 
                        placeholder="Lake City Caring Partners"
                        disabled={!editModeIntegrations}
                      />
                   </div>
                   <div>
                      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Default Meta Description</label>
                      <textarea
                        className={`flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${!editModeIntegrations ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white"}`}
                        value={seoDefaults.description}
                        onChange={(e) => setSeoDefaults({...seoDefaults, description: e.target.value})}
                        disabled={!editModeIntegrations}
                      />
                   </div>
                 </div>
              </Card>
          </div>
       </div>
    </div>
  );
}
