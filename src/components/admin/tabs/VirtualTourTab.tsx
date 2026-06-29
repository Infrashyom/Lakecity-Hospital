import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import { Plus, Edit, Trash2, MapPin, UploadCloud, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { authFetch } from "@/src/lib/authFetch.js";
import { toast } from "sonner";

export function VirtualTourTab() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>({ name: "", description: "", image: "", hotspots: [] });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      const response = await authFetch("/api/content?type=tour");
      if (response.ok) {
        setRooms(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      setCurrentRoom((prev: any) => ({...prev, image: uploadData.data.url}));
      toast.success("Image uploaded successfully!");
      
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image.");
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = currentRoom._id ? "PUT" : "POST";
      const url = currentRoom._id ? `/api/content/${currentRoom._id}` : "/api/content";
      
      const payload = { ...currentRoom, type: "tour" };
      delete payload._id;

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      fetchRooms();
      setIsEditing(false);
      toast.success("Room saved successfully.");
    } catch(err) {
      toast.error("Failed to save room.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await authFetch(`/api/content/${deleteConfirmId}`, { method: "DELETE" });
      fetchRooms();
      toast.success("Room deleted successfully.");
    } catch(err) {
      toast.error("Failed to delete room.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{currentRoom._id ? 'Edit' : 'Add'} Room</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Room Name</label>
          <Input value={currentRoom.name} onChange={e => setCurrentRoom({...currentRoom, name: e.target.value})} placeholder="e.g. Lobby" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea 
            value={currentRoom.description} 
            onChange={e => setCurrentRoom({...currentRoom, description: e.target.value})} 
            className="w-full rounded-xl border border-gray-200 p-3 min-h-[100px] text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Image (360 preferred or high-res wide)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp"
            />
            {currentRoom.image ? (
              <div className="relative w-32 h-20 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <img src={currentRoom.image} className="w-full h-full object-cover" alt="Room preview" />
              </div>
            ) : (
              <div className="w-32 h-20 rounded-md bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                 No Image
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Button size="sm" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />} 
                {currentRoom.image ? 'Replace Image' : 'Upload Image'}
              </Button>
              <Input 
                value={currentRoom.image} 
                onChange={e => setCurrentRoom({...currentRoom, image: e.target.value})} 
                placeholder="Or paste URL: https://" 
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Room</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <p className="text-slate-600 font-medium text-sm">Manage the virtual tour rooms and panoramas.</p>
        <Button className="gap-2" onClick={() => { setCurrentRoom({ name: "", description: "", image: "", hotspots: [] }); setIsEditing(true); }}>
          <Plus className="w-4 h-4" /> Add Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">
          No virtual tour rooms added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map(room => (
            <Card key={room._id} className="overflow-hidden border border-slate-100 shadow-sm">
              <div className="h-48 bg-slate-200 relative">
                <img src={room.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{room.name}</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">{room.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setCurrentRoom(room); setIsEditing(true); }}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                  <Button variant="danger" size="icon" onClick={() => setDeleteConfirmId(room._id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Room"
        message="Are you sure you want to remove this room from the tour?"
        confirmText="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
