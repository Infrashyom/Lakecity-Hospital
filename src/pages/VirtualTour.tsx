import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Maximize, MapPin, Info, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

const rooms = [
  {
    id: "lobby",
    name: "Main Reception & Lobby",
    description: "Our spacious, welcoming lobby is designed to provide a calming environment from the moment you step in. Features comfortable seating, a dedicated help desk, and a cafe.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
    hotspots: [
      { x: 30, y: 60, label: "Help Desk" },
      { x: 70, y: 50, label: "Cafeteria" }
    ]
  },
  {
    id: "patient-room",
    name: "Premium Patient Suite",
    description: "Our private suites offer a hotel-like experience with advanced medical monitoring, a companion bed, smart TV, and panoramic city views for a stress-free recovery.",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2072&auto=format&fit=crop",
    hotspots: [
      { x: 45, y: 55, label: "Smart Bed" },
      { x: 80, y: 40, label: "Companion Area" }
    ]
  },
  {
    id: "icu",
    name: "Intensive Care Unit (ICU)",
    description: "Equipped with state-of-the-art life support systems and 1:1 nursing care. Designed for maximum visibility and rapid response.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
    hotspots: [
      { x: 50, y: 45, label: "Central Monitoring" },
      { x: 20, y: 60, label: "Ventilator Support" }
    ]
  },
  {
    id: "ot",
    name: "Operation Theater",
    description: "Ultra-modern, modular operation theaters with laminar airflow, advanced robotic surgical systems, and high-definition imaging.",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2047&auto=format&fit=crop",
    hotspots: [
      { x: 50, y: 50, label: "Surgical Table" },
      { x: 75, y: 30, label: "Anesthesia Station" }
    ]
  }
];

export function VirtualTour() {
  const [roomsState, setRoomsState] = useState<any[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/content?type=tour");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setRoomsState(data);
          } else {
            setRoomsState(rooms);
          }
        }
      } catch (error) {
        console.error("Fetch errors:", error);
        setRoomsState(rooms);
      }
    };
    fetchRooms();
  }, []);

  const currentRoom = roomsState[currentRoomIndex];

  const handleNext = () => {
    setCurrentRoomIndex((prev) => (prev + 1) % roomsState.length);
  };

  const handlePrev = () => {
    setCurrentRoomIndex((prev) => (prev - 1 + roomsState.length) % roomsState.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (roomsState.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden" role="dialog" aria-label="Virtual Tour Viewer" aria-modal="true">
      <SEO title="Virtual Tour" description="Take a 360-degree virtual tour of our facilities at Lake City Hospital." />
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <Link to="/" aria-label="Back to Home" className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white rounded-full">
            <Button variant="outline" size="icon" className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-md rounded-full" tabIndex={-1}>
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
          <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-white">
            <h1 className="font-bold text-lg md:text-xl" aria-live="polite">{currentRoom.name}</h1>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span>Lakecity Hospital, Bhopal</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowInfo(!showInfo)}
            aria-pressed={showInfo}
            aria-label={showInfo ? "Hide room information" : "Show room information"}
            className={cn(
              "border-white/20 text-white backdrop-blur-md rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white",
              showInfo ? "bg-primary hover:bg-primary-dark" : "bg-black/50 hover:bg-black/70"
            )}
          >
            <Info className="w-5 h-5" aria-hidden="true" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-md rounded-full hidden md:flex focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
          >
            <Maximize className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Main Viewer */}
      <div 
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        role="region"
        aria-label={`360 view of ${currentRoom.name}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={currentRoom.image} 
              alt={`Panoramic view of ${currentRoom.name}`}
              className="w-full h-full object-cover animate-pan-image"
              style={{ objectFit: "cover", width: "120%", height: "100%", maxWidth: "none" }}
              referrerPolicy="no-referrer"
            />
            
            {/* Simulated Hotspots */}
            {showInfo && currentRoom.hotspots.map((spot, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (idx * 0.2) }}
                className="absolute z-10 hidden md:flex flex-col items-center"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <button 
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center animate-pulse cursor-pointer hover:bg-white/40 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
                  aria-label={`Hotspot: ${spot.label}`}
                >
                  <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true" />
                </button>
                <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full whitespace-nowrap border border-white/10" aria-hidden="true">
                  {spot.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Info Panel Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-32 left-4 md:left-6 max-w-sm bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white z-20 pointer-events-auto"
              role="complementary"
              aria-label="Room Information"
            >
              <h3 className="font-bold text-lg mb-2">{currentRoom.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentRoom.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center z-20 pointer-events-none">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrev}
            aria-label="Previous room"
            className="pointer-events-auto bg-black/30 border-white/20 text-white hover:bg-black/60 backdrop-blur-md rounded-full w-12 h-12 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center z-20 pointer-events-none">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext}
            aria-label="Next room"
            className="pointer-events-auto bg-black/30 border-white/20 text-white hover:bg-black/60 backdrop-blur-md rounded-full w-12 h-12 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Bottom Thumbnail Bar */}
      <div 
        className="h-28 bg-black/80 backdrop-blur-xl border-t border-white/10 z-20 flex items-center px-4 overflow-x-auto hide-scrollbar"
        role="region"
        aria-label="Room Thumbnails"
      >
        <div className="flex gap-4 mx-auto" role="tablist" aria-label="Select a room to view">
          {roomsState.map((room, idx) => (
            <button
              key={room.id}
              role="tab"
              aria-selected={currentRoomIndex === idx}
              aria-controls={`room-panel-${room.id}`}
              id={`room-tab-${room.id}`}
              onClick={() => setCurrentRoomIndex(idx)}
              className={cn(
                "relative h-20 w-32 rounded-xl overflow-hidden shrink-0 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white",
                currentRoomIndex === idx ? "ring-2 ring-primary scale-105" : "opacity-50 hover:opacity-100"
              )}
            >
              <img 
                src={room.image} 
                alt={`Thumbnail of ${room.name}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2" aria-hidden="true">
                <span className="text-white text-xs font-medium truncate w-full text-left">
                  {room.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
