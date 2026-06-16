import { useEffect } from "react";
import { useSettings } from "@/src/contexts/SettingsContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({ title, description, keywords }: SEOProps) {
  const { settings } = useSettings();

  useEffect(() => {
    const siteName = settings?.hospitalName || "Lake City Hospital";
    const defaultMetaTitle = settings?.seoDefaults?.metaTitle || siteName;
    const defaultMetaDescription = settings?.seoDefaults?.description || "A world-class multi-specialty hospital providing comprehensive healthcare services.";

    const finalTitle = title ? `${title} | ${siteName}` : defaultMetaTitle;
    const finalDescription = description || defaultMetaDescription;

    document.title = finalTitle;
    
    // Update or create Description Meta Tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", finalDescription);

    // Update or create Keywords Meta Tag
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }
  }, [title, description, keywords, settings]);

  return null;
}
