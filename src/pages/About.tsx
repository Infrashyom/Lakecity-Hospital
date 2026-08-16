import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { useSettings } from "@/src/contexts/SettingsContext";
import { Award, CheckCircle2, HeartPulse, ShieldCheck, Clock, Users, Activity, Heart } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function About() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen pt-32 pb-12 bg-white">
      <SEO title="About Us" description="Learn about Lake City Hospital's history, mission, and vision." />

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              A Legacy of Care and <span className="text-primary">Excellence</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              <strong>Lake City Hospital</strong> is a leading <strong>Super Speciality Surgical Center</strong> located at Kasturba Nagar, Near Chetak Bridge, Bhopal, committed to delivering advanced surgical and medical care with compassion, expertise, and a patient-first approach.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our multidisciplinary team provides comprehensive care across <strong>Cancer Surgery, Medical Oncology, Hemato-Oncology, Pediatric Surgery, Plastic & Reconstructive Surgery, Maxillofacial Surgery, Gynecology, Burn Care, Pain & Palliative Care, Physiotherapy, and Pediatrics & Neonatal Care</strong>. By bringing multiple super specialities under one roof, we ensure seamless, high-quality treatment for patients of all ages.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              As an <strong>Ayushman Bharat Empanelled Hospital</strong>, we offer cashless treatment for eligible patients, including comprehensive cancer care under the Ayushman Yojana. In partnership with <strong>Smile Train</strong>, we also provide free <strong>cleft lip and cleft palate surgeries</strong>, helping children receive life-changing treatment regardless of their financial background.
            </p>
            <div className="flex gap-4">
              <Link to="/doctors">
                <Button size="lg" className="h-14 px-8 text-base">Meet Our Experts</Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={settings?.aboutUsImageUrl || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop"} 
                alt="Hospital Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">15+ Years</h4>
                  <p className="text-slate-500 font-medium">Of Trusted Community Care</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Highlights Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">15+ Years</h3>
                <p className="text-slate-600 text-sm">Trusted healthcare since 2011</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Team</h3>
                <p className="text-slate-600 text-sm">Experienced multidisciplinary specialists</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Super Speciality Care</h3>
                <p className="text-slate-600 text-sm">Advanced surgical & medical services</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Patient First</h3>
                <p className="text-slate-600 text-sm">Compassionate, personalised care</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop" 
            alt="Hospital background" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary-dark/95" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white/10 backdrop-blur-md text-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-blue-100 leading-relaxed">
                  To be Central India's trusted super speciality healthcare institution, delivering world-class surgical excellence, compassionate patient care, and accessible treatment for every individual.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-white/10 backdrop-blur-md text-white">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <HeartPulse className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed">
                  To provide compassionate, accessible, high-quality, and cost-effective healthcare to the community. We strive to improve the health and well-being of those we serve through innovation, education, and clinical excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600">
              The principles that guide our actions and shape our culture of care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Patient First", desc: "Every decision we make is centered around the well-being and comfort of our patients." },
              { title: "Integrity", desc: "We uphold the highest ethical standards, ensuring transparency and honesty in all our interactions." },
              { title: "Excellence", desc: "We continuously strive for clinical and operational excellence through innovation and continuous learning." },
              { title: "Compassion", desc: "We treat every patient with empathy, dignity, and respect, understanding their unique needs." },
              { title: "Teamwork", desc: "We collaborate across disciplines to deliver comprehensive and coordinated care." },
              { title: "Safety", desc: "We maintain a safe environment for our patients, visitors, and staff at all times." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{value.title}</h4>
                    <p className="text-slate-600 text-sm">{value.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
