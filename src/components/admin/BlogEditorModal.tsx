import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { X, Loader2, ImageIcon, Bold, Italic, List, Link as LinkIcon, Undo, Redo, Type, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { authFetch } from "@/src/lib/authFetch";
import { toast } from "sonner";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Max size is 5MB");
        return;
      }

      const uploadData = new FormData();
      uploadData.append("image", file);
      
      const toastId = toast.loading("Uploading image...");

      try {
        const res = await authFetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        const url = data.data.url;

        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image uploaded successfully", { id: toastId });
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error("Failed to upload image. Check server configuration.", { id: toastId });
      }
    };
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 p-2 bg-slate-50 flex-wrap">
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"><Undo className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"><Redo className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-slate-300 mx-2" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}><Bold className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}><Italic className="w-4 h-4" /></button>
      <div className="w-px h-4 bg-slate-300 mx-2" />

      <div className="relative flex items-center hover:bg-slate-200 rounded-lg transition-colors">
        <Type className="w-4 h-4 ml-2 text-slate-500 pointer-events-none" />
        <select
          className="appearance-none bg-transparent pl-1 pr-6 py-2 text-sm font-medium text-slate-600 outline-none cursor-pointer"
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : 'p'}
        >
          <option value="p">Normal</option>
          <option value="h2">Large</option>
          <option value="h1">Huge</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-1 pointer-events-none" />
      </div>

      <div className="w-px h-4 bg-slate-300 mx-2" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}><List className="w-4 h-4" /></button>
      <button type="button" onClick={setLink} className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}><LinkIcon className="w-4 h-4" /></button>
      <button type="button" onClick={addImage} className="p-2 rounded-lg transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-200"><ImageIcon className="w-4 h-4" /></button>
    </div>
  );
};

const editorExtensions = [
  StarterKit,
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Link.configure({
    openOnClick: false,
  }),
  Underline,
];

export function BlogEditorModal({ isOpen, onClose, onSave, editingBlog }: { isOpen: boolean; onClose: () => void; onSave: (blog: any) => void; editingBlog?: any }) {
  const [formData, setFormData] = useState({
    title: "", author: "Admin", content: "", description: "", image: "", seoTitle: "", seoDescription: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate mx-auto focus:outline-none p-4 max-w-none min-h-[300px]',
      },
    },
  });

  useEffect(() => {
    if (editingBlog) {
      const newFormData = {
        title: editingBlog.title || "",
        author: editingBlog.author || "Admin",
        content: editingBlog.content || "",
        description: editingBlog.description || editingBlog.excerpt || editingBlog.summary || "",
        image: editingBlog.image || "",
        seoTitle: editingBlog.seoTitle || "",
        seoDescription: editingBlog.seoDescription || ""
      };
      setFormData(newFormData);
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(newFormData.content);
      }
    } else {
      const newFormData = { 
        title: "", author: "Admin", content: "", description: "", image: "", seoTitle: "", seoDescription: ""
      };
      setFormData(newFormData);
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent("");
      }
    }
  }, [editingBlog, isOpen, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Max size is 5MB");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setIsUploading(true);
      const res = await authFetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setFormData({ ...formData, image: data.data.url });
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image. Check server configuration.");
    } finally {
      setIsUploading(false);
    }
  };


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
                    if (!isUploading && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-sm font-medium text-slate-600">Uploading...</span>
                    </div>
                  ) : formData.image ? (
                    <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Click to upload image</span>
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
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-primary outline-none resize-y min-h-[100px]" 
                  placeholder="Brief overview..."
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Main Content</label>
                <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white">
                  <MenuBar editor={editor} />
                  <div className="flex-1 overflow-y-auto cursor-text text-base" onClick={() => editor?.commands.focus()}>
                    <EditorContent editor={editor} className="min-h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50">
          <Button variant="outline" className="h-11 px-6 shadow-none" onClick={onClose}>Cancel</Button>
          <Button className="h-11 px-8 shadow-sm" disabled={isUploading} onClick={() => {
             if (!formData.title.trim() || !formData.content.trim()) {
               toast.error("Title and content are mandatory fields.");
               return;
             }
             onSave(formData);
          }}>Save Article</Button>
        </div>
      </Card>
    </div>
  );
}
