import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ImageIcon, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { SEO } from "@/src/components/SEO";

export function Gallery() {
  const [folders, setFolders] = useState(['All', 'Doctor Photos', 'Hospital Facility / Infra', 'Awards & Credentials']);
  const [activeFolder, setActiveFolder] = useState('All');
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/content?type=media");
        if (response.ok) {
          const data = await response.json();
          setMedia(data);
          
          // dynamic folders
          const dynamicFolders = Array.from(new Set(data.map((m: any) => m.category))).filter(Boolean) as string[];
          const allFolders = ['All', ...dynamicFolders];
          if (dynamicFolders.length > 0) {
            setFolders(allFolders);
          }
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, []);

  const activeMedia = activeFolder === 'All' ? media : media.filter(m => m.category === activeFolder);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO title="Gallery" description="Browse through our state-of-the-art facilities, doctors, and achievements." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
           <Link to="/">
             <Button variant="ghost" className="gap-2 mb-6 text-slate-500 hover:text-slate-800 -ml-4">
               <ArrowLeft className="w-4 h-4" /> Back to Home
             </Button>
           </Link>
           <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Media Gallery</h1>
           <p className="text-lg text-slate-600 max-w-2xl">Explore our clinical infrastructure, success stories, awards, and our clinical team at Lake City Caring Partners.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar">
           {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  activeFolder === folder 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {folder}
              </button>
           ))}
        </div>

        {/* Masonry or Grid Layout */}
        {activeMedia.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-800 mb-2">No media found</h3>
              <p className="text-slate-500">There are no images in this category yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
             {activeMedia.map((item, i) => (
                <motion.div
                  key={item._id || item.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
                  onClick={() => window.open(item.image, '_blank')}
                >
                  <img 
                    src={item.image} 
                    alt={item.title || "Gallery Item"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-primary-light text-xs font-bold uppercase tracking-wider mb-2 block">{item.category}</span>
                    <h4 className="text-white font-medium text-lg leading-tight w-full truncate">{item.title}</h4>
                  </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
