import { Link } from "react-router-dom";
import { HeartPulse, MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useSettings } from "@/src/contexts/SettingsContext";

export function Footer() {
  const { settings } = useSettings();

  const hospitalName = settings?.hospitalName || "Lake City Caring Partners";
  const address = settings?.address || "B-27, Near Chetak Bridge, Sector B, Kasturba Nagar, Bhopal, MP";
  const primaryPhone = settings?.contactNumbers?.[0] || "1800-123-4567 (Toll Free)";
  const primaryEmail = settings?.emails?.[0] || "info@lakecitycaringpartners.com";

  const youtubeLink = settings?.socialHandles?.youtube || "https://www.youtube.com/@lakecityhospitalbhopal";
  const instagramLink = settings?.socialHandles?.instagram || "https://www.instagram.com/lakecity.hospital/";

  return (
    <footer className="bg-slate-900 text-slate-300 pt-8 pb-16 md:pb-6 text-xs">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.logoUrl ? (
                 <img src={settings.logoUrl} alt={hospitalName} className="h-10 object-contain group-hover:scale-105 transition-transform brightness-0 invert" />
              ) : (
                <>
                  <div className="bg-primary text-white p-2 rounded-xl">
                    <span className="text-lg font-bold leading-none">{hospitalName.charAt(0)}</span>
                    <span className="text-lg font-bold leading-none text-secondary">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white leading-tight">{hospitalName.split(" ")[0]} {hospitalName.split(" ")[1]}</span>
                    <span className="text-xs font-semibold text-secondary tracking-wider uppercase">{hospitalName.split(" ").slice(2).join(" ")}</span>
                  </div>
                </>
              )}
            </Link>
            <p className="leading-relaxed">
              Providing advanced care and trusted healing to the community of Bhopal and beyond. Your health is our priority.
            </p>
            <div className="flex gap-4">
              <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/departments" className="hover:text-primary transition-colors">Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-primary transition-colors">Find a Doctor</Link></li>
              <li><Link to="/book" className="hover:text-primary transition-colors">Book Appointment</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href={`tel:${primaryPhone?.replace(/\D/g, "")}`} className="hover:text-primary transition-colors">{primaryPhone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href={`mailto:${primaryEmail}`} className="hover:text-primary transition-colors">{primaryEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} {hospitalName}. All rights reserved.</p>
          <div className="flex gap-6 md:pr-20">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
