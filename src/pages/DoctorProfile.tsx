import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, MapPin, Clock, Calendar, GraduationCap, Award, BookOpen, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { doctors as initialDoctors } from "@/src/data/doctors";

export function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
        } else {
          // Fallback for static IDs if API fails
          const staticDoc = initialDoctors.find((d) => d.id === Number(id));
          if (staticDoc) {
            setDoctor(staticDoc);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        const staticDoc = initialDoctors.find((d) => d.id === Number(id));
        if (staticDoc) {
          setDoctor(staticDoc);
        } else {
          setError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return <Navigate to="/doctors" replace />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <Link to="/doctors" className="inline-flex items-center text-primary font-medium mb-8 hover:text-primary-dark transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-none shadow-md sticky top-32">
                <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="px-6 pb-6 relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-100 absolute -top-16 left-6 shadow-lg">
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="pt-20">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{doctor.name}</h1>
                    <p className="text-primary font-medium mb-4">{doctor.specialty}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900">{doctor.rating}</span>
                      <span>({doctor.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{doctor.experience} Experience</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Lake City Hospital, Main Block</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">Available:</span> {doctor.availability}
                      </div>
                    </div>

                    <Link to={`/book?doctor=${doctor._id || doctor.id}`} className="block w-full">
                      <Button className="w-full h-12 text-base shadow-md shadow-primary/20">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-none shadow-md">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">About {doctor.name}</h2>
                  <p className="text-slate-700 leading-relaxed">
                    {doctor.bio || doctor.about}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {doctor.education && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      Education & Qualifications
                    </h2>
                    <div className="space-y-4">
                      {Array.isArray(doctor.education) ? (
                        doctor.education.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                            <p className="text-slate-700">{item}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <p className="text-slate-700">{doctor.education}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {doctor.expertise && doctor.expertise.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Star className="w-6 h-6 text-primary" />
                      Areas of Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {doctor.expertise.map((item: string, idx: number) => (
                        <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {doctor.affiliations && doctor.affiliations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Award className="w-6 h-6 text-primary" />
                      Professional Affiliations
                    </h2>
                    <ul className="space-y-4">
                      {doctor.affiliations.map((affiliation: string, index: number) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                          <span className="text-slate-700">{affiliation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {doctor.awards && doctor.awards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Award className="w-6 h-6 text-yellow-500" />
                      Awards & Recognition
                    </h2>
                    <ul className="space-y-4">
                      {doctor.awards.map((award: string, index: number) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" />
                          <span className="text-slate-700">{award}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {doctor.publications && doctor.publications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-primary" />
                      Research & Publications
                    </h2>
                    <ul className="space-y-4">
                      {doctor.publications.map((publication: string, index: number) => (
                        <li key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                          <span className="text-slate-700 italic">{publication}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {doctor.testimonials && doctor.testimonials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-primary" />
                      Patient Testimonials
                    </h2>
                    <div className="grid gap-6">
                      {doctor.testimonials.map((testimonial: any, index: number) => (
                        <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                          <div className="flex gap-1 text-yellow-400 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <p className="text-slate-700 italic mb-4">"{testimonial.comment}"</p>
                          <p className="text-sm font-semibold text-slate-900">- {testimonial.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

