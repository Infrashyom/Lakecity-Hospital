import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/content?type=blog");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const publishedBlogs = data.filter((b: any) => b.isPublished);
            setBlogs(publishedBlogs);
          } else {
            setBlogs([]);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Blog" description="Read our latest articles on health, wellness, and medical advancements." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Health & Wellness Blog</h1>
          <p className="text-lg text-slate-600">
            Stay informed with the latest health tips, medical news, and expert advice from our specialists.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-500">
               No articles found. Try adjusting your search.
             </div>
          )}
          {currentPosts.map((post, i) => (
            <motion.div
              key={post._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={post.image || "https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=2070&auto=format&fit=crop"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <User className="w-3.5 h-3.5" />
                       <span>{post.author || 'Admin'}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                    {post.description || post.seoDescription || (post.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...')}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/blog/${post.slug || post._id || post.id}`}>
                      <Button variant="ghost" className="p-0 h-auto font-semibold hover:bg-transparent hover:text-primary-dark group/btn">
                        Read Article 
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 ${currentPage !== i + 1 ? "bg-white" : ""}`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
