import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Calendar, Clock, Loader2, MapPin, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (response.ok) {
          const data = await response.ok ? await response.json() : [];
          if (data && data.length > 0) {
            // Map MongoDB _id to id if necessary, but current frontend uses id
            setDoctors(data.map((d: any) => ({ ...d, id: d._id || d.id })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctors from API, using static data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    return doc.status !== "BANNED";
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Find a Doctor" description="Locate and book appointments with Lake City Hospital's top doctors and specialists." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Doctor</h1>
          <p className="text-lg text-slate-600">
            View profiles of our highly qualified and experienced medical professionals.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading specialist doctors...</p>
          </div>
        ) : (
          <>
            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border-none shadow-md">
                    <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                        <img src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e2e8f0&color=64748b&size=400`} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                        <p className="text-primary font-medium text-sm mb-2">{doc.specialty}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>{doc.experience} Years Experience</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 mt-auto">
                      <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">Available:</span> {doc.availability}
                        </div>
                        {doc.opdTiming && (
                          <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">Timing:</span> {doc.opdTiming}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Lake City Hospital, Main Block</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link to={`/doctors/${doc._id || doc.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No doctors found</h3>
                <p className="text-slate-600">There are currently no active doctors available.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

