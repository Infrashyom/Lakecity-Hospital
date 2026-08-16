import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/content?type=blog")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setBlogs(data.slice(0, 3)); // Display only the latest 3
        }
      })
      .catch(err => console.error("Error fetching blogs:", err));
  }, []);

  if (blogs.length === 0) {
    return null; // Do not render section if no blogs exist
  }

  return (
    <section className="py-12 bg-white" aria-labelledby="latest-blogs">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <h2 id="latest-blogs" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Latest Insights & News</h2>
            <p className="text-slate-700 text-lg">Stay informed with medical updates, health tips, and news from our experts.</p>
          </div>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors group">
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const formattedDate = new Date(blog.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <Card key={blog._id || blog.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-100">
                  <img src={blog.image || "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  {blog.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                      {blog.category}
                    </div>
                  )}
                </div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formattedDate}</div>
                    {blog.author && <div className="flex items-center gap-1"><User className="w-4 h-4" /> {blog.author}</div>}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">
                    <Link to={`/blogs`} className="hover:text-primary transition-colors">
                      {blog.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <p className="text-slate-600 line-clamp-3 mb-4">
                    {blog.description || blog.content?.replace(/<[^>]+>/g, '') || "Read more about this topic..."}
                  </p>
                  <Link to={`/blogs`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group">
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
