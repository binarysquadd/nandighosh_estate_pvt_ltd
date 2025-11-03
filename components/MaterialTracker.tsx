"use client";

import { Hammer } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = {
  projectId?: string;
};

export default function MaterialTracker({ projectId }: Props) {
  // ✅ Fetch material data from Sheets
  const { data: materials, isLoading, error } = useSheetsData("Materials");

  // ✅ Filter materials by project ID
  const filtered = materials?.filter((m: any) => m.projectId === projectId) || [];

  // ✅ Compute status color & label
  const getStatus = (m: any) =>
    Number(m.received) >= Number(m.ordered)
      ? { color: "text-green-600", label: "Complete" }
      : { color: "text-orange-600", label: "Pending" };

  // ✅ Loading / error states
  if (isLoading)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Loading material data...
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
        Failed to fetch material data.
      </div>
    );

  // ✅ Render
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Hammer className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Material Procurement
        </h2>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No materials found for this project.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
              <tr>
                <th className="py-2 px-3 text-left">Material</th>
                <th className="py-2 px-3 text-left">Ordered</th>
                <th className="py-2 px-3 text-left">Received</th>
                <th className="py-2 px-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any, i: number) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3 font-medium">{m.name}</td>
                  <td className="py-2 px-3">
                    {m.ordered} {m.unit}
                  </td>
                  <td className="py-2 px-3">
                    {m.received} {m.unit}
                  </td>
                  <td className={`py-2 px-3 font-semibold ${getStatus(m).color}`}>
                    {getStatus(m).label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}