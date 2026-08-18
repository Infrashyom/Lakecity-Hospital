import { SEO } from "@/src/components/SEO";
import { Card, CardContent } from "@/src/components/ui/Card";
import {
  Activity,
  ArrowRight,
  Baby,
  BadgePlus,
  Bone,
  Brain,
  Ear,
  HeartPulse,
  Image as ImageIcon,
  Microscope,
  ShieldAlert,
  Stethoscope,
  Syringe
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

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

export function Departments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      .catch(err => console.error("Error fetching departments:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 bg-slate-50">
      <SEO title="Departments" description="Explore our Centers of Excellence offering world-class care." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <span>Our Specialities</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">Centers of Excellence</h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            At Lake City Hospital, we are committed to delivering advanced medical and surgical care through a wide range of super speciality healthcare services. Our team of experienced specialists combines clinical expertise, modern technology, and a patient-first approach to provide accurate diagnosis, effective treatment, and compassionate care. From routine consultations to complex surgeries and rehabilitation, we offer comprehensive healthcare under one roof.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-slate-500 py-10">Loading departments...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.length > 0 ? departments.map((dept, i) => {
              return (
                <motion.div
                  key={dept._id || dept.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 bg-[#f8f9fc]"
                >
                  {/* Department Image */}
                  <div className="w-full h-56 bg-slate-200 relative shrink-0">
                    {dept.bannerImage ? (
                      <img src={dept.bannerImage} alt={dept.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Department Content */}
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-[#1e5aa0] mb-4">{dept.name}</h3>
                    <p className="text-slate-900 flex-grow leading-relaxed font-medium">{dept.shortDescription || "Specialized care and treatment."}</p>
                  </div>
                </motion.div>
              );
            }) : (
              <p className="col-span-full text-center text-slate-500 py-10">No departments found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
