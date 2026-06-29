import { Button } from "@/src/components/ui/Button";
import { useSettings } from "@/src/contexts/SettingsContext";
import { cn } from "@/src/lib/utils";
import { Calendar, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={hospitalName} className="h-10 object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
            ) : (
              <>
                <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center">
                  <span className="text-lg font-bold leading-none">{hospitalName.charAt(0)}</span>
                  <span className="text-lg font-bold leading-none text-secondary">H</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary leading-tight">{hospitalName.split(" ")[0]} {hospitalName.split(" ")[1]}</span>
                  <span className="text-xs font-semibold text-secondary tracking-wider uppercase">{hospitalName.split(" ").slice(2).join(" ")}</span>
                </div>
              </>
            )}
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
            <Link to="/book">
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Book Appointment</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-main focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md"
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
              <Link to="/book" className="w-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md">
                <Button className="w-full gap-2 justify-center">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Book Appointment</span>
                </Button>
              </Link>
              <a href="tel:1066" className="w-full">
                <Button variant="danger" className="w-full gap-2 justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-danger">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Emergency: 1066</span>
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
