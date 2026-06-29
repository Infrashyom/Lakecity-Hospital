import React from "react";
import { 
  LayoutDashboard, Calendar, Users, Building2, 
  MessageSquare, FileText, Star, ImageIcon, Activity,
  Settings, LogOut, X, Shield
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSettings } from "@/src/contexts/SettingsContext";

export type AdminTab = 
  | "dashboard" | "appointments" | "doctors" | "departments" 
  | "content" | "reviews" | "media" | "tour" | "insurances" | "settings";

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "doctors", label: "Doctors", icon: Users },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "insurances", label: "Insurances", icon: Shield },
  { id: "content", label: "Blog Manager", icon: FileText },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "media", label: "Media Gallery", icon: ImageIcon },
  { id: "tour", label: "Virtual Tour", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export function AdminSidebar({ activeTab, setActiveTab, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { settings } = useSettings();
  const hospitalName = settings?.hospitalName || "LCH";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={cn(
        "w-64 bg-primary-dark text-white flex flex-col fixed h-full z-30 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {settings?.logoUrl ? (
                 <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain bg-white rounded-lg p-1" />
              ) : (
                <div className="bg-white p-2 text-primary-dark rounded-lg flex items-center justify-center font-bold text-xl leading-none">
                  {hospitalName.charAt(0)}
                </div>
              )}
              <span className="font-bold tracking-tight uppercase text-sm">Sanchalak</span>
            </div>
            <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id); 
                    setIsMobileMenuOpen(false); 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-white/60 hover:text-red-400 px-3 py-2 transition-colors w-full text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
