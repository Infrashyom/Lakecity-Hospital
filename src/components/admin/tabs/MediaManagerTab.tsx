import React, { useState } from "react";
import { MediaGalleryTab } from "./MediaGalleryTab";
import { BannersTab } from "./BannersTab";

export function MediaManagerTab() {
  const [activeSubTab, setActiveSubTab] = useState<"gallery" | "banners">("gallery");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Media Manager</h2>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveSubTab("gallery")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSubTab === "gallery" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveSubTab("banners")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSubTab === "banners" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Banners
          </button>
        </div>
      </div>

      {activeSubTab === "gallery" && <MediaGalleryTab />}
      {activeSubTab === "banners" && <BannersTab />}
    </div>
  );
}
