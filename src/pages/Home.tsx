import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  HeartPulse, Activity, Brain, Bone, Stethoscope, 
  Microscope, Phone, Calendar, ArrowRight, Star, 
  ShieldCheck, Clock, Users, CheckCircle2, Baby
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { PatientJourney } from "@/src/components/sections/PatientJourney";
import { MediaGallerySection } from "@/src/components/sections/MediaGallerySection";
import { TestimonialsSection } from "@/src/components/sections/TestimonialsSection";
import { FAQSection } from "@/src/components/sections/FAQSection";
import { SEO } from "@/src/components/SEO";
import { useSettings } from "@/src/contexts/SettingsContext";

export function Home() {
  const { settings } = useSettings();
  
  return (
    <div className="flex flex-col min-h-screen">
      <SEO title="Home" description="Welcome to Lake City Caring Partners" />
      {/* Emergency Banner */}
      <div className="hidden">
        <span className="animate-pulse">â ï¸</span>
        24/7 Emergency Services Available. Call 1066 immediately for medical emergencies.
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" aria-label="Hero">
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
                <Button size="lg" variant="danger" className="gap-2 h-14 px-8 text-base shadow-xl shadow-danger/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-danger" aria-label="Call Emergency at 1066">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Emergency (1066)
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Services */}
      <section className="py-20 bg-slate-50" aria-labelledby="centers-of-excellence">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="centers-of-excellence" className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Centers of Excellence</h2>
            <p className="text-slate-700 text-lg">Comprehensive care across specialized departments, equipped with the latest medical technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Microscope, title: "Cancer Care", desc: "Advanced pediatric and adult oncology", color: "text-purple-600", bg: "bg-purple-100" },
              { icon: HeartPulse, title: "Cardiology", desc: "Advanced heart care and surgery", color: "text-red-600", bg: "bg-red-100" },
              { icon: Activity, title: "Burn Care & ICU", desc: "Specialized burn treatments", color: "text-orange-600", bg: "bg-orange-100" },
              { icon: Bone, title: "Orthopedics", desc: "Joint replacement and trauma care", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: Baby, title: "Women & Child Care", desc: "Comprehensive maternity and pediatrics", color: "text-pink-600", bg: "bg-pink-100" },
              { icon: Activity, title: "Emergency", desc: "24/7 critical care support", color: "text-danger", bg: "bg-red-100" },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/departments`} className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
                  <Card className="h-full border border-slate-200 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 flex flex-col items-center text-center h-full text-slate-900">
                      <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                        <service.icon className={`w-8 h-8 ${service.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-slate-600 text-sm mb-6 flex-grow">{service.desc}</p>
                      <div className="mt-auto flex items-center justify-center text-primary-dark font-medium text-sm group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              {settings?.homeVideoUrl ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
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
              ) : null}
              <div className="relative flex-grow min-h-[300px] rounded-2xl overflow-hidden">
                <img 
                  src={settings?.aboutUsImageUrl || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop"} 
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
