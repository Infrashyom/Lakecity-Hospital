import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { SEO } from "@/src/components/SEO";

export function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/content?type=blog`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const found = data.find((p: any) => p._id === id || p.id === id);
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
      <SEO title={post.title} description={post.seoDescription || post.excerpt || "Read this article on Lake City Hospital"} />
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
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-slate-900">{post.author || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>

            {post.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg mb-12 aspect-[21/9]">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="prose prose-lg prose-slate max-w-none hover:prose-a:text-primary-dark focus:prose-a:text-primary-dark">
              {/* For simplicity we will assume content is either markdown or plain text, or html. Just render it for now */}
              <div dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
