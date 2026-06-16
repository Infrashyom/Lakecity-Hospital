import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { SEO } from "@/src/components/SEO";

interface Insurance {
  _id: string;
  name: string;
  isActive: boolean;
}

export const Insurances = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insurances")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInsurances(data.filter((ins: Insurance) => ins.isActive));
        } else {
          setInsurances([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load insurances", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <SEO title="Insurances" description="List of empanelled TPAs and Insurances for cashless hospitalization." />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
            Empanelled TPAs & Insurances
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Cashless Hospitalization Features
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Lake City Hospital has tie-ups with major health insurance companies and TPAs to provide a seamless cashless treatment experience for our patients.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Shield className="w-12 h-12 text-slate-300 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insurances.map((ins, i) => (
              <motion.div
                key={ins._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">
                        {ins.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {insurances.length === 0 && (
              <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No active insurances found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
