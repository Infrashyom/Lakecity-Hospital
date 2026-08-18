import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { ArrowLeft, Calendar, Loader2, User, Tag, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null);
  const [openIndexRight, setOpenIndexRight] = useState<number | null>(null);

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

  const faqs = post.faqs || [];
  const midPoint = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, midPoint);
  const rightColumnFaqs = faqs.slice(midPoint);

  const FAQItem = ({ faq, isOpen, onToggle }: { faq: any, isOpen: boolean, onToggle: () => void }) => (
    <div 
      className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md border-[#004b5f]/30 ring-1 ring-[#004b5f]/10' : 'hover:border-slate-300 bg-[#fbfdfd]'}`}
    >
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`font-semibold pr-8 ${isOpen ? 'text-[#004b5f]' : 'text-slate-900'}`}>{faq.question}</span>
        {isOpen ? (
          <div className="w-8 h-8 rounded-full bg-[#004b5f] text-white flex flex-shrink-0 items-center justify-center transition-colors">
            <ChevronUp className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-500 flex flex-shrink-0 items-center justify-center hover:bg-slate-300/60 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </div>
        )}
      </button>
      
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  );

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

            <div className="prose prose-lg prose-slate max-w-none hover:prose-a:text-primary-dark focus:prose-a:text-primary-dark mb-16">
              {/* For simplicity we will assume content is either markdown or plain text, or html. Just render it for now */}
              <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>

            {faqs.length > 0 && (
              <div className="mt-16 border-t border-slate-100 pt-16">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
                  <p className="text-slate-600">Answers to common questions related to this article.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 lg:gap-8 max-w-5xl mx-auto">
                  {/* Left Column */}
                  <div className="flex flex-col gap-4">
                    {leftColumnFaqs.map((faq: any, idx: number) => (
                      <FAQItem 
                        key={`left-${idx}`} 
                        faq={faq} 
                        isOpen={openIndexLeft === idx}
                        onToggle={() => setOpenIndexLeft(openIndexLeft === idx ? null : idx)}
                      />
                    ))}
                  </div>
                  
                  {/* Right Column */}
                  <div className="flex flex-col gap-4">
                    {rightColumnFaqs.map((faq: any, idx: number) => (
                      <FAQItem 
                        key={`right-${idx}`} 
                        faq={faq} 
                        isOpen={openIndexRight === idx}
                        onToggle={() => setOpenIndexRight(openIndexRight === idx ? null : idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
