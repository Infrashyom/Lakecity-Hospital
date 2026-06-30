import { Card, CardContent } from "@/src/components/ui/Card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  let solidBase = [...reviews];
  while (solidBase.length < 5) {
    solidBase = [...solidBase, ...reviews];
  }

  // Duplicate exactly once for seamless 50% scroll
  const marqueeItems = [...solidBase, ...solidBase];

  return (
    <section className="py-24 bg-white overflow-hidden" aria-labelledby="patient-stories">
      <div className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 id="patient-stories" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Patient Stories</h2>
            <p className="text-slate-700 text-lg">Hear from those who have experienced our care firsthand.</p>
          </div>
          <a href="https://www.google.com/search?sca_esv=9e14c540528a302f&cs=0&output=search&kgmid=/g/125_xcsyw&q=Lake+City+Hospital+in+Bhopal&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=252346a2246dff97&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/uni/m1/1#lrd=0x397c4269de5329b5:0x99157f1479a85a84,1,,,," target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors gap-2">
            Rate us on Google
          </a>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex py-4 group">
        <div 
          className="flex animate-marquee"
          style={{ width: 'max-content' }}
        >
          {/* First Group */}
          <div className="flex gap-6 pr-6">
            {solidBase.map((testimonial, i) => (
              <Card key={`g1-${i}`} className="bg-slate-50 border-none shadow-md hover:shadow-lg transition-shadow w-[350px] md:w-[400px] shrink-0 whitespace-normal">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex gap-1 text-accent mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, s) => <Star key={s} className="w-5 h-5 fill-current" aria-hidden="true" />)}
                  </div>
                  <p className="text-slate-800 italic mb-8 leading-relaxed font-medium flex-1">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 overflow-hidden shadow-sm text-primary font-bold text-xl">
                      {testimonial.patientName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 line-clamp-1">{testimonial.patientName}</h5>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Second Group (Identical copy) */}
          <div className="flex gap-6 pr-6">
            {solidBase.map((testimonial, i) => (
              <Card key={`g2-${i}`} className="bg-slate-50 border-none shadow-md hover:shadow-lg transition-shadow w-[350px] md:w-[400px] shrink-0 whitespace-normal">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex gap-1 text-accent mb-6">
                    {[...Array(testimonial.rating || 5)].map((_, s) => <Star key={s} className="w-5 h-5 fill-current" aria-hidden="true" />)}
                  </div>
                  <p className="text-slate-800 italic mb-8 leading-relaxed font-medium flex-1">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 overflow-hidden shadow-sm text-primary font-bold text-xl">
                      {testimonial.patientName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-900 line-clamp-1">{testimonial.patientName}</h5>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
