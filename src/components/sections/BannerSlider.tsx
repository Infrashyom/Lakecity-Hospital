import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Calendar, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useBooking } from "@/src/contexts/BookingContext";

export function BannerSlider() {
  const { openBooking } = useBooking();
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/banners?isActive=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBanners(data);
      })
      .catch(console.error);
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full aspect-[9/16] md:aspect-video 2xl:max-h-[85vh] overflow-hidden bg-black flex items-center">
      <AnimatePresence mode="wait">
        {banners.map((banner, index) => index === currentIndex && (
          <motion.div
            key={banner._id || banner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Images */}
            <picture>
              <source media="(min-width: 768px)" srcSet={banner.desktopImage} />
              <img src={banner.mobileImage} alt={banner.title} className="w-full h-full object-cover object-[center_25%]" />
            </picture>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/60 md:to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-2xl border-l-4 md:border-l-4 border-l-0 border-b-4 md:border-b-0 border-primary pl-0 md:pl-6 pb-6 md:pb-0 py-2 text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-teal-300/50 text-teal-300 text-xs font-bold uppercase tracking-widest mb-6 bg-teal-900/40 backdrop-blur-sm">
                    WELCOME TO LAKE CITY HOSPITAL
                  </div>
                  
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
                  >
                    {banner.title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl"
                  >
                    {banner.description}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto items-center md:items-start"
                  >
                    <Button size="lg" className="gap-2 h-14 px-8 text-base bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg shadow-primary/25 w-full sm:w-auto" onClick={() => openBooking()}>
                      <Calendar className="h-5 w-5" /> Book Appointment
                    </Button>
                    <a href="tel:1066" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 text-base bg-red-600 hover:bg-red-700 text-white border-none rounded-full shadow-lg shadow-red-600/25">
                        <Phone className="h-5 w-5" /> Emergency: 1066
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <div className="hidden md:block">
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-y-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${i === currentIndex ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
