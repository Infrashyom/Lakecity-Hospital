import { SEO } from "@/src/components/SEO";
import { Card, CardContent } from "@/src/components/ui/Card";
import {
  Activity,
  Baby,
  BadgePlus,
  Bone,
  Brain,
  Ear,
  HeartPulse,
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
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Departments" description="Explore our Centers of Excellence offering world-class care." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Centers of Excellence</h1>
          <p className="text-lg text-slate-600">
            Our specialized departments are equipped with cutting-edge technology and staffed by renowned medical experts to provide you with world-class care.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-slate-500 py-10">Loading departments...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.length > 0 ? departments.map((dept, i) => {
              const { icon: Icon, color, bg } = getDepartmentIcon(dept.name);
              return (
                <motion.div
                  key={dept._id || dept.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group overflow-hidden bg-white">
                    <CardContent className="p-8 flex flex-col h-full relative">
                      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-50 transition-transform duration-500 group-hover:scale-[2] ${bg}`} aria-hidden="true" />
                      
                      <div className={`relative z-10 w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-6 shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                      </div>
                      
                      <h3 className="relative z-10 text-2xl font-bold text-slate-900 mb-3">{dept.name}</h3>
                      <p className="relative z-10 text-slate-600 mb-8 grow leading-relaxed">{dept.shortDescription || "Specialized care and treatment."}</p>
                    </CardContent>
                  </Card>
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
