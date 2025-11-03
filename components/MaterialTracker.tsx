"use client";

import { Hammer } from "lucide-react";

export default function MaterialTracker({ materials }: { materials?: any[] }) {
  const list =
    materials || [
      { name: "Cement", ordered: 1000, received: 800, unit: "bags" },
      { name: "Steel", ordered: 50, received: 50, unit: "tons" },
      { name: "Tiles", ordered: 5000, received: 3000, unit: "pcs" },
    ];

  const getStatus = (m: any) =>
    m.received === m.ordered
      ? { color: "text-green-600", label: "Complete" }
      : { color: "text-orange-600", label: "Pending" };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Hammer className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Material Procurement
        </h2>
      </div>

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
            {list.map((m, i) => (
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
    </section>
  );
}