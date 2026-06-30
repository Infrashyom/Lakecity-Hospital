import { Button } from "@/src/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function MediaGallerySection() {
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/content?type=media");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const homeMedia = data.filter((m: any) => m.showOnHome);
            setMedia(homeMedia.slice(0, 6));
          }
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, []);

  if (media.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50" aria-labelledby="media-gallery">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 id="media-gallery" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Hospital Gallery</h2>
            <p className="text-slate-700 text-lg">Take a glimpse into our state-of-the-art facilities, expert team, and milestones.</p>
          </div>
          <Link to="/gallery">
            <Button variant="outline" className="gap-2 bg-white hidden md:flex">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {media.map((item, i) => (
            <motion.div
              key={item._id || item.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-slate-200 aspect-[4/3] sm:aspect-[3/2]"
            >
              <img 
                src={item.image} 
                alt={item.title || "Hospital Facility"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">{item.category}</span>
                <h4 className="text-white font-medium line-clamp-2">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden">
          <Link to="/gallery" className="block w-full">
            <Button variant="outline" className="w-full bg-white gap-2">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
