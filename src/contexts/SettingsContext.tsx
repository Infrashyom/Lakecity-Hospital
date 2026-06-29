import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SeoDefaults {
  metaTitle: string;
  description: string;
}

export interface SiteSettings {
  hospitalName: string;
  logoUrl?: string;
  contactNumbers: string[];
  emails: string[];
  address: string;
  googleMapsLink?: string;
  whatsappNumber?: string;
  seoDefaults?: SeoDefaults;
  socialHandles?: any;
  homeVideoUrl?: string;
  aboutUsImageUrl?: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  hospitalName: "Lake City Hospital",
  contactNumbers: [],
  emails: [],
  address: "",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update favicon when settings change
  useEffect(() => {
    if (settings?.logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.logoUrl;
    }
  }, [settings?.logoUrl]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
