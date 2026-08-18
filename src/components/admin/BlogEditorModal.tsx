import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { X, Loader2, ImageIcon, Bold, Italic, List, Link as LinkIcon, Undo, Redo, Type, ChevronDown, Plus, Trash2 } from "lucide-react";
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

      if (file.size > 20 * 1024 * 1024) {
        toast.error("Image is too large. Max size is 20MB");
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

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Upload failed");
        }

        const data = await res.json();
        const url = data.data.url;

        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image uploaded successfully", { id: toastId });
      } catch (err: any) {
        console.error("Image upload failed", err);
        toast.error(err.message || "Failed to upload image.", { id: toastId });
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
    title: "", author: "Admin", content: "", description: "", image: "", seoTitle: "", seoDescription: "", category: "", faqs: [] as {question: string, answer: string}[]
  });
  const [isUploading, setIsUploading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDepartments(data.filter((d: any) => d.status === "ACTIVE"));
        } else if (data && data.data && Array.isArray(data.data)) {
          setDepartments(data.data.filter((d: any) => d.status === "ACTIVE"));
        }
      })
      .catch(err => console.error("Error fetching departments:", err));
  }, []);

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
        seoDescription: editingBlog.seoDescription || "",
        category: editingBlog.category || "",
        faqs: editingBlog.faqs || []
      };
      setFormData(newFormData);
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(newFormData.content);
      }
    } else {
      const newFormData = { 
        title: "", author: "Admin", content: "", description: "", image: "", seoTitle: "", seoDescription: "", category: "", faqs: [] as {question: string, answer: string}[]
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

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image is too large. Max size is 20MB");
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
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await res.json();
      setFormData({ ...formData, image: data.data.url });
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
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
                    accept="image/*, image/heic, image/heif, .heic, .heif" 
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
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Department / Category (Optional)</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 focus:ring-1 focus:ring-primary outline-none appearance-none"
                  >
                    <option value="">None / General</option>
                    {departments.map((dept: any) => (
                      <option key={dept._id || dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">SEO Title (Optional)</label>
                <Input 
                  value={formData.seoTitle} 
                  onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} 
                  placeholder="Override default title"
                  className="h-10 bg-slate-50/50 border-slate-200 shadow-none text-slate-700 text-sm mb-4"
                />
                
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">SEO Description (Optional)</label>
                <textarea 
                  value={formData.seoDescription} 
                  onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} 
                  placeholder="Override default summary"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-primary outline-none resize-y min-h-[80px]"
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
                <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white min-h-[300px]">
                  <MenuBar editor={editor} />
                  <div className="flex-1 overflow-y-auto cursor-text text-base" onClick={() => editor?.commands.focus()}>
                    <EditorContent editor={editor} className="min-h-full" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">FAQs (Optional)</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs flex items-center gap-1"
                    onClick={() => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }))}
                  >
                    <Plus className="w-3 h-3" /> Add FAQ
                  </Button>
                </div>
                {formData.faqs.length === 0 ? (
                  <div className="text-sm text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
                    No FAQs added. Click 'Add FAQ' to create one.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {formData.faqs.map((faq, index) => (
                      <div key={index} className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -top-3 -right-3 h-7 w-7 bg-white border border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          onClick={() => {
                            const newFaqs = [...formData.faqs];
                            newFaqs.splice(index, 1);
                            setFormData(prev => ({ ...prev, faqs: newFaqs }));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Input 
                          placeholder="Question..." 
                          value={faq.question}
                          onChange={(e) => {
                            const newFaqs = [...formData.faqs];
                            newFaqs[index].question = e.target.value;
                            setFormData(prev => ({ ...prev, faqs: newFaqs }));
                          }}
                          className="h-10 bg-white border-slate-200 text-sm font-medium"
                        />
                        <textarea 
                          placeholder="Answer..."
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...formData.faqs];
                            newFaqs[index].answer = e.target.value;
                            setFormData(prev => ({ ...prev, faqs: newFaqs }));
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-1 focus:ring-primary outline-none resize-y min-h-[60px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
