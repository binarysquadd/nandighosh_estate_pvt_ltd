"use client";

import { useState } from "react";
import { ImagePlus, CalendarDays } from "lucide-react";

type Update = { id: string; date: string; caption: string; img: string };

export default function SiteUpdates() {
  const [updates] = useState<Update[]>([
    {
      id: "1",
      date: "2024-07-10",
      caption: "Foundation work completed for Block A",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "2",
      date: "2024-07-18",
      caption: "First floor slab concrete poured",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
  ]);

  return (
    <section id="updates" className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Site Updates</h2>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">+ Add Photo</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {updates.map((u) => (
          <div
            key={u.id}
            className="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-all"
          >
            <img
              src={u.img}
              alt={u.caption}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 mb-1">{u.caption}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {u.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}