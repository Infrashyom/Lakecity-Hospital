import { motion } from "motion/react";
import { 
  PhoneCall, 
  Ambulance, 
  Stethoscope, 
  ClipboardList, 
  BedDouble, 
  HeartPulse, 
  Home,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/Card";

const journeySteps = [
  {
    id: 1,
    title: "Initial Contact",
    description: "Call our 24/7 helpline or book an appointment online. For emergencies, our ambulance is dispatched immediately.",
    icon: PhoneCall,
    color: "bg-blue-500",
    delay: 0.1
  },
  {
    id: 2,
    title: "Arrival & Triage",
    description: "Upon arrival, our dedicated staff ensures quick registration. Emergency cases bypass the queue for immediate assessment.",
    icon: Ambulance,
    color: "bg-red-500",
    delay: 0.2
  },
  {
    id: 3,
    title: "Expert Consultation",
    description: "Meet with our specialists who will carefully listen to your concerns, review history, and recommend necessary diagnostics.",
    icon: Stethoscope,
    color: "bg-teal-500",
    delay: 0.3
  },
  {
    id: 4,
    title: "Diagnostics & Testing",
    description: "Undergo required tests in our state-of-the-art labs and imaging centers, ensuring accurate and swift results.",
    icon: ClipboardList,
    color: "bg-purple-500",
    delay: 0.4
  },
  {
    id: 5,
    title: "Treatment & Care",
    description: "Receive personalized treatment, whether it's outpatient medication, day-care procedures, or inpatient surgery.",
    icon: HeartPulse,
    color: "bg-orange-500",
    delay: 0.5
  },
  {
    id: 6,
    title: "Recovery & Discharge",
    description: "Recover in our comfortable suites. We provide detailed discharge summaries, medication plans, and follow-up schedules.",
    icon: Home,
    color: "bg-green-500",
    delay: 0.6
  }
];

export function PatientJourney() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Your Care Pathway
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              The Patient Journey
            </h2>
            <p className="text-slate-600 text-lg">
              We've streamlined our processes to ensure your experience is as smooth, transparent, and stress-free as possible from start to finish.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          
          {/* Connecting Line (Mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-slate-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative flex md:flex-col items-start md:items-center gap-6 md:gap-8"
              >
                {/* Step Number & Icon */}
                <div className="relative shrink-0">
                  <div className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center shadow-lg shadow-${step.color}/30 z-10 relative`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center shadow-sm border border-slate-100">
                    {step.id}
                  </div>
                </div>

                {/* Content Card */}
                <Card className="w-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardContent className="p-6 md:text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow indicator (Desktop) */}
                {index < journeySteps.length - 1 && index % 3 !== 2 && (
                  <div className="hidden md:block absolute top-8 -right-8 text-slate-300 z-0">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
