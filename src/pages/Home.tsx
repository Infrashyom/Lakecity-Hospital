import { FAQSection } from "@/src/components/sections/FAQSection";
import { MediaGallerySection } from "@/src/components/sections/MediaGallerySection";
import { PatientJourney } from "@/src/components/sections/PatientJourney";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { useSettings } from "@/src/contexts/SettingsContext";
import {
  Activity,
  ArrowRight,
  Baby,
  BadgePlus,
  Bone,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Ear,
  HeartPulse,
  Microscope,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getDepartmentIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('plastic') || n.includes('reconstructive')) return { icon: BadgePlus, color: "text-pink-500", bg: "bg-pink-50" };
  if (n.includes('paediatric') || n.includes('pediatric')) return { icon: Baby, color: "text-rose-500", bg: "bg-rose-50" };
  if (n.includes('anaesthesia') || n.includes('anesthesia')) return { icon: Syringe, color: "text-teal-500", bg: "bg-teal-50" };
  if (n.includes('onco') || n.includes('cancer')) return { icon: Microscope, color: "text-purple-500", bg: "bg-purple-50" };
  if (n.includes('burn')) return { icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50" };
  if (n.includes('surg')) return { icon: Activity, color: "text-blue-500", bg: "bg-blue-50" };
  if (n.includes('ortho') || n.includes('bone')) return { icon: Bone, color: "text-amber-500", bg: "bg-amber-50" };
  if (n.includes('heart') || n.includes('cardio')) return { icon: HeartPulse, color: "text-red-500", bg: "bg-red-50" };
  if (n.includes('neuro') || n.includes('brain')) return { icon: Brain, color: "text-indigo-500", bg: "bg-indigo-50" };
  if (n.includes('ear') || n.includes('ent')) return { icon: Ear, color: "text-yellow-600", bg: "bg-yellow-50" };
  return { icon: Stethoscope, color: "text-primary", bg: "bg-primary/10" };
};

export function Home() {
  const { settings } = useSettings();
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDepartments(data.filter((d: any) => d.status === "ACTIVE"));
        } else if (data && data.data && Array.isArray(data.data)) {
          setDepartments(data.data.filter((d: any) => d.status === "ACTIVE"));
        }
      })
      .catch(err => console.error("Error fetching departments:", err));
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <SEO title="Home" description="Welcome to Lake City Caring Partners" />
      {/* Emergency Banner */}
      <div className="hidden">
        <span className="animate-pulse">â ï¸</span>
        24/7 Emergency Services Available. Call 1066 immediately for medical emergencies.
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=2000&auto=format&fit=crop" 
            alt="Modern hospital building interior" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary-dark text-sm font-semibold mb-6">
                  Welcome to Lake City Caring Partners
                </span>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                  Advanced Care.<br />
                  <span className="text-secondary">Trusted Healing.</span>
                </h1>
                <p className="text-lg text-slate-700 mb-10 max-w-2xl leading-relaxed font-medium">
                  Experience world-class healthcare with state-of-the-art technology and compassionate experts in Bhopal. We partner with Ayushman Bharat and Smile Train to deliver accessible, high-quality care.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/book" aria-label="Book an appointment" className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md">
                    <Button size="lg" className="gap-2 h-14 px-8 text-base shadow-xl shadow-primary/20">
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                      Book Appointment
                    </Button>
                  </Link>
                  <a href="tel:1066" className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-danger rounded-md">
                    <Button size="lg" variant="danger" className="gap-2 h-14 px-8 text-base shadow-xl shadow-danger/20" aria-label="Call Emergency at 1066">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      Emergency (1066)
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
            
            {settings?.homeVideoUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full relative"
              >
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white">
                  <iframe 
                    className="w-full aspect-video"
                    src={(() => {
                      try {
                        const url = new URL(settings.homeVideoUrl);
                        const v = url.searchParams.get("v");
                        if (v) return `https://www.youtube.com/embed/${v}`;
                        return settings.homeVideoUrl;
                      } catch {
                        return settings.homeVideoUrl;
                      }
                    })()}
                    title="Lake City Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Key Services */}
      {departments.length > 0 && (
        <section className="py-16 lg:py-24 bg-slate-50" aria-labelledby="centers-of-excellence">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-3xl">
                <h2 id="centers-of-excellence" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Centers of Excellence</h2>
                <p className="text-slate-700 text-lg">Comprehensive care across specialized departments, equipped with the latest medical technology.</p>
              </div>
              <Link to="/departments" className="group inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors shrink-0">
                Explore All Departments 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.slice(0, 4).map((dept, i) => {
                const { icon: Icon, color, bg } = getDepartmentIcon(dept.name);
                return (
                  <motion.div
                    key={dept._id || dept.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link to={`/departments`} className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
                      <Card className="h-full border border-slate-200 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8 flex flex-col items-center text-center h-full text-slate-900 relative overflow-hidden">
                          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 transition-transform duration-500 group-hover:scale-150 ${bg}`} aria-hidden="true" />
                          <div className={`relative z-10 w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/50 shadow-sm`} aria-hidden="true">
                            <Icon className={`w-8 h-8 ${color}`} />
                          </div>
                          <h3 className="relative z-10 text-xl font-semibold mb-3">{dept.name}</h3>
                          <p className="relative z-10 text-slate-600 text-sm mb-6 flex-grow">{dept.shortDescription || "Specialized care and treatment."}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 relative overflow-hidden bg-[#0a3138]" aria-labelledby="why-choose-us">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 id="why-choose-us" className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose Lake City?</h2>
              <p className="text-blue-100/90 text-lg mb-10 leading-relaxed">
                We combine world-class medical expertise with compassionate care. Our commitment to excellence ensures you receive the best possible treatment in a safe, healing environment.
              </p>
              
              <div className="space-y-6 mb-12">
                {[
                  "Premier Multispeciality Hospital in Bhopal",
                  "Advanced Cancer & Burn Care Super Specialty",
                  "Partners with Smile Train & Ayushman Bharat",
                  "24/7 Emergency & ICU near Chetak Bridge"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="rounded-full flex items-center justify-center" aria-hidden="true">
                      <CheckCircle2 className="w-6 h-6 text-[#10b981]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[17px] text-white font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[
                  { icon: Users, stat: "10,000+", label: "Happy Patients" },
                  { icon: Stethoscope, stat: "15+", label: "Expert Doctors" },
                  { icon: Clock, stat: "24/7", label: "Emergency Care" },
                  { icon: ShieldCheck, stat: "15+", label: "Years Experience" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#18464d] border border-[#2b585f] rounded-2xl text-white shadow-lg overflow-hidden group hover:border-[#386c73] transition-colors">
                    <div className="p-6 text-center flex flex-col items-center justify-center h-full relative">
                      <stat.icon className="w-9 h-9 text-[#f97316] mb-4 relative z-10" aria-hidden="true" strokeWidth={2} />
                      <h4 className="text-[28px] leading-tight font-bold mb-1.5 relative z-10">{stat.stat}</h4>
                      <p className="text-white/90 font-medium text-sm md:text-[15px] relative z-10">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-full min-h-[300px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-[#2b585f] flex flex-col gap-4">
              <div className="relative flex-grow min-h-[300px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" 
                  alt="Lake City Hospital Facilities" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Journey Section */}
      <PatientJourney />

      {/* Virtual Tour Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden" aria-labelledby="virtual-tour-heading">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" 
            alt="Hospital Interior" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/20">
              Interactive Experience
            </span>
            <h2 id="virtual-tour-heading" className="text-3xl md:text-5xl font-bold mb-6">
              Take a 360° Virtual Tour
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities, patient rooms, and advanced operating theaters from the comfort of your home.
            </p>
            
            <Link to="/tour" className="inline-block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-primary rounded-md">
              <Button size="lg" className="h-16 px-10 text-lg gap-3 bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10">
                <Activity className="h-6 w-6 text-primary" aria-hidden="true" />
                Start Virtual Tour
                <ArrowRight className="h-5 w-5 ml-2 text-slate-400" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <MediaGallerySection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQs */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-20 bg-primary/5" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Ready to prioritize your health?</h2>
          <p className="text-lg text-slate-700 mb-10 max-w-2xl mx-auto font-medium">
            Book an appointment online or call our helpline. Our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" aria-label="Book an appointment now" className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base">Book Appointment Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
