"use client";

import { useMemo } from "react";
import { ImagePlus, CalendarDays } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Update = { id: string; projectId: string; date: string; caption: string; img?: string };

export default function SiteUpdates({ projectId }: { projectId: string }) {
  const { data: allUpdates, isLoading, error } = useSheetsData("Updates");

  const updates = useMemo<Update[]>(() => {
    const pid = projectId?.toString().trim();
    if (!allUpdates || !pid) return [];

    const normalized = (allUpdates as any[]).map((r) => {
      const id = (r.id ?? r.ID ?? r.updateId ?? r.UpdateId ?? r.updateID ?? "").toString().trim();
      const proj =
        (r.projectId ??
          r.ProjectId ??
          r.projectID ??
          r["project id"] ??
          r.projectid ??
          "").toString().trim();
      const date = (r.date ?? r.Date ?? "").toString().trim();
      const caption = (r.caption ?? r.Caption ?? "").toString().trim();
      const img = (r.img ?? r.image ?? r.Image ?? "").toString().trim() || undefined;
      return { id, projectId: proj, date, caption, img } as Update;
    });

    return normalized.filter((u) => u.id && u.projectId === pid);
  }, [allUpdates, projectId]);

  // Append one nice dummy photo for MVP if none present
  const displayUpdates =
    updates.length > 0
      ? updates
      : [
          {
            id: "demo-1",
            projectId,
            date: new Date().toISOString().slice(0, 10),
            caption: "On-site progress snapshot (MVP demo)",
            img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
          },
        ];

  if (isLoading) {
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-gray-500">
        Loading site updates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-red-500">
        Failed to load site updates.
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Site Updates</h2>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">+ Add Photo</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayUpdates.map((u) => (
          <div
            key={u.id}
            className="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-all"
          >
            {/* only render <img> when we have a URL */}
            {u.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.img} alt={u.caption} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                No Image
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 mb-1">{u.caption || "—"}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {u.date || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}