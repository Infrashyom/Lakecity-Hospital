import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/Card";

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        const featured = data.filter((r: any) => r.isFeatured);
        if (featured.length > 0) {
          setReviews(featured);
        } else {
          setReviews([]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const baseItems = reviews.length > 0 ? reviews : [
    {
      patientName: "Sarah Jenkins",
      departmentOrDoctor: "Cancer Care Patient",
      rating: 5,
      comment: "The oncology care I received at Lake City Hospital was exceptional. The doctors were patient, explained everything clearly, and the staff was incredibly supportive during my chemotherapy."
    },
    {
      patientName: "Michael Chen",
      departmentOrDoctor: "Reconstructive Surgery Patient",
      rating: 5,
      comment: "After a severe burn, they not only provided advanced Burn ICU care but Dr. Kale's reconstructive surgery gave me my life back. Truly grateful for their expertise."
    },
    {
      patientName: "Emily Rodriguez",
      departmentOrDoctor: "Maternity & Gynecology",
      rating: 5,
      comment: "Bringing my first child into the world was daunting, but the maternity staff made it a beautiful experience. The women’s care facilities are top-notch in Bhopal."
    }
  ];

  let solidBase = [...baseItems];
  while (solidBase.length < 5) {
    solidBase = [...solidBase, ...baseItems];
  }

  // Duplicate exactly once for seamless 50% scroll
  const marqueeItems = [...solidBase, ...solidBase];

  return (
    <section className="py-24 bg-white overflow-hidden" aria-labelledby="patient-stories">
      <div className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 id="patient-stories" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Patient Stories</h2>
          <p className="text-slate-700 text-lg">Hear from those who have experienced our care firsthand.</p>
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
                      <p className="text-sm text-slate-600 line-clamp-1">{testimonial.departmentOrDoctor || 'Patient'}</p>
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
                      <p className="text-sm text-slate-600 line-clamp-1">{testimonial.departmentOrDoctor || 'Patient'}</p>
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
      `}</style>
    </section>
  );
}
