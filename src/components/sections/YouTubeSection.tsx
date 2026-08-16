import { Button } from "@/src/components/ui/Button";
import { ArrowRight, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { useSettings } from "@/src/contexts/SettingsContext";

export function YouTubeSection() {
  const { settings } = useSettings();
  
  if (!settings) return null;

  const videos = settings.featuredVideos?.filter(v => v.trim() !== "") || [];
  
  if (videos.length === 0) return null;

  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname.includes("youtu.be")) {
        return urlObj.pathname.slice(1);
      }
    } catch {
      return null;
    }
    return null;
  };

  const channelUrl = settings.socialHandles?.youtube || "#";

  return (
    <section className="py-16 bg-white border-t border-slate-100" aria-labelledby="youtube-videos">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold text-sm mb-4">
              <Youtube className="w-4 h-4" />
              <span>Watch & Learn</span>
            </div>
            <h2 id="youtube-videos" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Health Education Videos</h2>
            <p className="text-slate-700 text-lg">Learn from our experts about various health topics, procedures, and wellness tips.</p>
          </div>
          <a href={channelUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              Watch all videos <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((videoUrl, idx) => {
            const videoId = extractVideoId(videoUrl);
            if (!videoId) return null;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50 aspect-video relative"
              >
                <iframe
                  className="w-full h-full absolute inset-0"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${idx + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
