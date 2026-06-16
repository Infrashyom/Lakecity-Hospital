import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  HeartPulse, Brain, Bone, Activity, Stethoscope, 
  Microscope, Baby, ShieldAlert, BadgePlus, Syringe, Ear, ArrowRight
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { SEO } from "@/src/components/SEO";

const departments = [
  {
    id: "cancer-care",
    name: "Cancer Care Center",
    icon: Microscope,
    color: "text-purple-500",
    bg: "bg-purple-50",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop",
    description: "Advanced pediatric and adult oncology. Treating solid and liquid tumors with expert chemotherapy and surgical oncology, including breast, lung, and oral cancers.",
    features: ["Pediatric Oncology", "Surgical Oncology", "Palliative Care"]
  },
  {
    id: "plastic-surgery",
    name: "Plastic & Reconstructive Surgery",
    icon: BadgePlus,
    color: "text-pink-500",
    bg: "bg-pink-50",
    image: "https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=800&auto=format&fit=crop",
    description: "Expert cleft lip and palate surgery, burn reconstruction, and trauma reconstruction. Proud partners with Smile Train and Ayushman Bharat.",
    features: ["Cleft Lip & Palate", "Post Burn Reconstruction", "Pediatric Plastic Surgery"]
  },
  {
    id: "burn-care",
    name: "Burn Care Super Specialty",
    icon: ShieldAlert,
    color: "text-orange-600",
    bg: "bg-orange-50",
    image: "https://images.unsplash.com/photo-1587559070757-f72a388edbba?q=80&w=800&auto=format&fit=crop",
    description: "State-of-the-art Burn ICU providing immediate emergency burn care, skin grafting, and comprehensive rehabilitation for adults and children.",
    features: ["Burn ICU", "Skin Grafting", "Burn Rehabilitation"]
  },
  {
    id: "general-surgery",
    name: "General & Advanced Surgery",
    icon: Syringe,
    color: "text-blue-500",
    bg: "bg-blue-50",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
    description: "State-of-the-art laparoscopic and emergency surgeries for hernia, gallbladder, appendix, and acute trauma.",
    features: ["Laparoscopic Surgery", "Emergency Surgery", "Trauma Surgery"]
  },
  {
    id: "gynecology",
    name: "Gynecology & Women Care",
    icon: Baby,
    color: "text-rose-500",
    bg: "bg-rose-50",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop",
    description: "Comprehensive women's health from pregnancy and delivery to infertility, PCOS, and menopause clinics.",
    features: ["Pregnancy & Delivery", "Infertility Treatment", "Menopause Clinic"]
  },
  {
    id: "gastro-surgery",
    name: "Gastro & GI Surgery",
    icon: Activity,
    color: "text-teal-500",
    bg: "bg-teal-50",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
    description: "Advanced endoscopic treatments for liver, pancreatic, and gallbladder disorders with cutting-edge GI surgical procedures.",
    features: ["Endoscopy", "Liver Disorders", "Gallbladder Surgery"]
  },
  {
    id: "orthopedics",
    name: "Orthopedic Care",
    icon: Bone,
    color: "text-amber-500",
    bg: "bg-amber-50",
    image: "https://images.unsplash.com/photo-1583912265924-73feda9c458c?q=80&w=800&auto=format&fit=crop",
    description: "Specialized care for fractures, joint pain, spine care, trauma orthopedics, and complete joint replacements.",
    features: ["Joint Replacement", "Spine Care", "Trauma Orthopedics"]
  },
  {
    id: "diabetic-foot",
    name: "Diabetic Foot Care",
    icon: HeartPulse,
    color: "text-red-500",
    bg: "bg-red-50",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=800&auto=format&fit=crop",
    description: "Dedicated wound care, infection treatments, and limb salvage programs for complex diabetic foot ulcers.",
    features: ["Foot Ulcers", "Wound Care", "Limb Salvage"]
  }
];

export function Departments() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col border-none shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={dept.image} 
                    alt={dept.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl ${dept.bg} flex items-center justify-center shadow-lg`}>
                    <dept.icon className={`w-6 h-6 ${dept.color}`} />
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col h-full pt-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{dept.name}</h3>
                  <p className="text-slate-600 mb-6 flex-grow">{dept.description}</p>
                  
                  <div className="space-y-2 mb-8">
                    {dept.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-4">
                    <Link to="/doctors" className="flex-1">
                      <Button variant="outline" className="w-full">Find Doctor</Button>
                    </Link>
                    <Link to="/book" className="flex-1">
                      <Button className="w-full">Book Visit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
