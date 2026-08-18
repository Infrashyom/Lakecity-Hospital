import { Button } from "@/src/components/ui/Button";
import { useSettings } from "@/src/contexts/SettingsContext";
import { cn } from "@/src/lib/utils";
import { Calendar, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "@/src/contexts/BookingContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Departments", path: "/departments" },
  { name: "Doctors", path: "/doctors" },
  { name: "Insurances", path: "/insurances" },
  { name: "Virtual Tour", path: "/tour" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const navigate = useNavigate();
    const { openBooking } = useBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const hospitalName = settings?.hospitalName || "Lake City Caring Partners";
  const primaryPhone = settings?.contactNumbers?.[0] || "1800-123-4567";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm py-3 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt={hospitalName} className="h-10 object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
            )}
            <div className="flex flex-col ml-1">
              <span className="text-2xl font-bold leading-none tracking-tight text-primary">Lake City</span>
              <span className="text-sm font-bold tracking-widest uppercase mt-0.5 text-secondary">HOSPITAL</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-sm px-1 py-0.5",
                  location.pathname === link.path ? "text-primary" : "text-text-main"
                )}
                aria-current={location.pathname === link.path ? "page" : undefined}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button type="button" className="gap-2" onClick={() => openBooking()}>
                <Calendar className="h-4 w-4" />
                <span>Book Appointment</span>
              </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-main hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block py-2 text-base font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md px-2",
                    location.pathname === link.path ? "text-primary" : "text-text-main"
                  )}
                  aria-current={location.pathname === link.path ? "page" : undefined}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" aria-hidden="true" />
              <Button type="button" className="w-full gap-2 justify-center" onClick={() => { openBooking(); setTimeout(() => setIsMobileMenuOpen(false), 50); }}>
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Book Appointment</span>
                </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
