import { useEffect } from "react";

export function useAnalyticsTracker() {
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let type: "whatsapp" | "phone" | null = null;

      if (href.startsWith("tel:")) {
        type = "phone";
      } else if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        type = "whatsapp";
      }

      if (type) {
        try {
          await fetch("/api/analytics/click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type,
              sourcePage: window.location.pathname
            })
          });
        } catch (error) {
          console.error("Failed to track click", error);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
