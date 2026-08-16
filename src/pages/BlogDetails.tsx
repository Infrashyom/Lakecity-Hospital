import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { ArrowLeft, Calendar, Loader2, User, Tag, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description || post.seoDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/content?type=blog`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const found = data.find((p: any) => p._id === id || p.id === id || p.slug === id);
            if (found) {
              setPost(found);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 bg-white min-h-screen">
      <SEO exactTitle title={post.seoTitle || post.title} description={post.seoDescription || post.description || "Read this article on Lake City Hospital"} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {post.image && (
              <div className="rounded-3xl overflow-hidden shadow-lg mb-10 aspect-[21/9]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US')}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{post.author || 'Admin'}</span>
                </div>
                {post.category && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <span>{post.category}</span>
                    </div>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.15] tracking-tight">
                {post.title}
              </h1>
            </div>

            <div className="mb-10">
              <Button variant="outline" className="gap-2 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" /> Share Article
              </Button>
            </div>

            {post.description && (
              <div className="border-l-4 border-primary pl-6 py-2 mb-10 text-xl md:text-2xl italic text-slate-600 font-light leading-relaxed">
                {post.description}
              </div>
            )}

            <div className="prose prose-lg prose-slate max-w-none hover:prose-a:text-primary-dark focus:prose-a:text-primary-dark">
              {/* For simplicity we will assume content is either markdown or plain text, or html. Just render it for now */}
              <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
