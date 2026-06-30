import { SEO } from "@/src/components/SEO";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { useSettings } from "@/src/contexts/SettingsContext";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import React from "react";

export function Contact() {
  const { settings } = useSettings();
  const hospitalName = settings?.hospitalName || "Lake City Hospital";

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Contact Us" description={`Get in touch with ${hospitalName} for appointments and emergencies.`} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">
            We're here to help. Reach out to us for any inquiries, feedback, or emergency assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-none shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
              <p className="text-slate-600 mb-4">We are available 24/7 for your needs.</p>
              <div className="space-y-2 font-medium">
                {settings?.contactNumbers?.filter(Boolean).map((number, idx) => (
                  <p key={idx} className="text-slate-900">{idx === 0 ? 'Emergency: ' : 'Helpline: '}<span className={idx === 0 ? "text-danger" : ""}>{number}</span></p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600 mb-4">Send us an email anytime.</p>
              <div className="space-y-2 font-medium break-all">
                {settings?.emails?.filter(Boolean).map((email, idx) => (
                  <p key={idx} className="text-slate-900"><a href={`mailto:${email}`}>{email}</a></p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Location</h3>
              <p className="text-slate-600 mb-4">Visit our main campus.</p>
              <p className="text-slate-900 font-medium">
                {settings?.address ? (
                  settings.address.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)
                ) : null}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Working Hours</h3>
              <p className="text-slate-600 mb-4">Our facilities are always open.</p>
              <div className="space-y-2 font-medium">
                <p className="text-slate-900">Emergency: <span className="text-success">24/7</span></p>
                <p className="text-slate-900">OPD: Mon-Sat, 9AM - 8PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-1">Visit Our Centre</h2>
                   <p className="text-slate-500 text-sm">Accessible location in the heart of the city.</p>
                 </div>
               </div>
               {settings?.googleMapsLink && (
                 <Button className="rounded-full gap-2 shrink-0" onClick={() => window.open(settings.googleMapsLink, '_blank')}>
                   <Send className="w-4 h-4" />
                   Get Directions
                 </Button>
               )}
            </div>
            
            <div className="h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm">
              <iframe 
                src={(settings?.googleMapsLink && settings.googleMapsLink.includes('embed')) ? settings.googleMapsLink : `https://maps.google.com/maps?q=${encodeURIComponent(hospitalName + (settings?.address ? ', ' + settings.address : ''))}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                className="absolute inset-0 w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 max-w-[calc(100%-2rem)] sm:max-w-xs pointer-events-none">
                <div className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto">
                  <h3 className="text-lg font-bold text-primary mb-2">{hospitalName}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {settings?.address ? (
                      settings.address.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
