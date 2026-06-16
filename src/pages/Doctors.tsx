import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Star, MapPin, Clock, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Link } from "react-router-dom";
import { doctors as initialDoctors } from "@/src/data/doctors";
import { SEO } from "@/src/components/SEO";

const specialties = ["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Dermatology"];

export function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [doctors, setDoctors] = useState<any[]>(initialDoctors);
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
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Find a Doctor" description="Locate and book appointments with Lake City Hospital's top doctors and specialists." />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Doctor</h1>
          <p className="text-lg text-slate-600">
            Search and book appointments with our highly qualified and experienced medical professionals.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Search by doctor name or specialty..." 
                className="pl-12 h-14 text-base bg-slate-50 border-transparent focus-visible:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="h-14 rounded-xl border border-gray-200 bg-slate-50 px-4 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all md:w-64"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Button className="h-14 px-8 text-base hidden md:flex">Search</Button>
          </div>
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
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h3>
                        <p className="text-primary font-medium text-sm mb-2">{doc.specialty}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-slate-900">{doc.rating}</span>
                          <span>({doc.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{doc.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 mt-auto">
                      <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">Available:</span> {doc.availability}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Lake City Hospital, Main Block</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link to={`/book?doctor=${doc.id}`} className="flex-1">
                          <Button className="w-full">Book Visit</Button>
                        </Link>
                        <Link to={`/doctors/${doc.id}`} className="flex-1">
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
                <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => { setSearchTerm(""); setSelectedSpecialty("All"); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

