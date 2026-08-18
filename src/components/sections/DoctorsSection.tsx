import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const activeDocs = data.filter((doc: any) => doc.status !== "BANNED" && doc.showOnHome === true);
          setDoctors(activeDocs);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (doctors.length === 0) {
    return null;
  }

  let solidBase = [...doctors];
  while (solidBase.length < 5) {
    solidBase = [...solidBase, ...doctors];
  }

  return (
    <section className="pt-24 pb-12 bg-slate-50 overflow-hidden" aria-labelledby="meet-our-doctors">
      <div className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 id="meet-our-doctors" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Our Experts</h2>
            <p className="text-slate-700 text-lg">Meet our highly qualified and experienced medical professionals.</p>
          </div>
          <Link to="/doctors" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors gap-2">
            View All Doctors
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex py-4 group">
        <div 
          className="flex animate-marquee-doctors"
          style={{ width: 'max-content' }}
        >
          {/* First Group */}
          <div className="flex gap-6 pr-6">
            {solidBase.map((doc, i) => (
              <Card key={`doc-g1-${i}`} className="bg-white border-none shadow-md hover:shadow-xl transition-shadow duration-300 w-[350px] md:w-[400px] shrink-0 whitespace-normal flex flex-col overflow-hidden">
                <div className="p-6 flex flex-row gap-6 items-start">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e2e8f0&color=64748b&size=400`} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider mb-2">Director</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{doc.specialty}</p>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{doc.experience} Years Exp.</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 mt-auto">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1"><span className="font-medium">Available:</span> {doc.availability}</span>
                    </div>
                    {doc.opdTiming && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1"><span className="font-medium">Timing:</span> {doc.opdTiming}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Second Group (Identical copy) */}
          <div className="flex gap-6 pr-6">
            {solidBase.map((doc, i) => (
              <Card key={`doc-g2-${i}`} className="bg-white border-none shadow-md hover:shadow-xl transition-shadow duration-300 w-[350px] md:w-[400px] shrink-0 whitespace-normal flex flex-col overflow-hidden">
                <div className="p-6 flex flex-row gap-6 items-start">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e2e8f0&color=64748b&size=400`} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider mb-2">Director</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{doc.specialty}</p>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{doc.experience} Years Exp.</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 mt-auto">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1"><span className="font-medium">Available:</span> {doc.availability}</span>
                    </div>
                    {doc.opdTiming && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1"><span className="font-medium">Timing:</span> {doc.opdTiming}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-doctors {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-doctors {
          animation: marquee-doctors 35s linear infinite;
        }
        .group:hover .animate-marquee-doctors {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
