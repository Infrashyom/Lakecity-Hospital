import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Bold, Italic, Type, List, Link as LinkIcon, Undo, Redo } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export function BlogEditorModal({ isOpen, onClose, onSave, editingBlog }: { isOpen: boolean; onClose: () => void; onSave: (blog: any) => void; editingBlog?: any }) {
  const [formData, setFormData] = useState({
    title: "", author: "Admin", content: "", excerpt: "", isPublished: true, image: "", seoTitle: "", seoDescription: ""
  });

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || "",
        author: editingBlog.author || "Admin",
        content: editingBlog.content || "",
        excerpt: editingBlog.excerpt || "",
        isPublished: editingBlog.isPublished ?? true,
        image: editingBlog.image || "",
        seoTitle: editingBlog.seoTitle || "",
        seoDescription: editingBlog.seoDescription || ""
      });
    } else {
      setFormData({ 
        title: "", author: "Admin", content: "", excerpt: "", isPublished: true, image: "", seoTitle: "", seoDescription: ""
      });
    }
  }, [editingBlog, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl bg-white overflow-hidden max-h-[90vh] flex flex-col rounded-xl">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-xl text-slate-800">{editingBlog ? 'Edit Article' : 'New Article'}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Cover Image</label>
                <div 
                  className="w-full aspect-[4/3] bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden relative"
                  onClick={() => {
                    const url = prompt("Enter image URL (Cloudinary upload coming soon):", formData.image);
                    if (url !== null) setFormData({...formData, image: url});
                  }}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">High quality (1920px+) supported</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Author Name</label>
                <Input 
                  value={formData.author} 
                  onChange={(e) => setFormData({...formData, author: e.target.value})} 
                  className="h-12 bg-slate-50/50 border-slate-200 shadow-none text-slate-700"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Title</label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="Article Headline..." 
                  className="h-12 bg-slate-50/50 border-slate-200 shadow-none text-lg font-medium text-slate-800 placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Summary</label>
                <textarea 
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]" 
                  placeholder="Brief overview..."
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Main Content</label>
                <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white">
                  
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 border-b border-slate-100 p-2 bg-slate-50">
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"><Undo className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors mr-2"><Redo className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mr-2" />
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors mr-2"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mr-2" />
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"><Type className="w-4 h-4" /> <span className="text-xs font-medium">Size </span></button>
                    <div className="w-px h-4 bg-slate-300 mx-2" />
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"><List className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"><LinkIcon className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  </div>
                  
                  {/* Editor Area */}
                  <textarea 
                    value={formData.content} 
                    onChange={(e) => setFormData({...formData, content: e.target.value})} 
                    className="w-full flex-1 p-4 bg-transparent resize-none text-slate-700 outline-none min-h-[300px]"
                    placeholder="Write your article content here..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50">
          <Button variant="outline" className="h-11 px-6 shadow-none" onClick={onClose}>Cancel</Button>
          <Button className="h-11 px-8 shadow-sm" onClick={() => {
             if (!formData.title.trim() || !formData.content.trim()) {
               alert("Title and content are mandatory fields.");
               return;
             }
             onSave({...formData, isPublished: true});
          }}>Save Article</Button>
        </div>
      </Card>
    </div>
  );
}
