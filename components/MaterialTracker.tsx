"use client";

import { Package } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId?: string };

export default function MaterialTracker({ projectId }: Props) {
  const { data: materials, isLoading, error } = useSheetsData("Materials");
  const filtered = materials?.filter((m: any) => m.projectId === projectId) || [];

  const getStatus = (m: any) =>
    Number(m.received) >= Number(m.ordered)
      ? { color: "text-green-600", label: "Done" }
      : { color: "text-amber-600", label: "In Progress" };

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading material data...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to fetch material data.
      </div>
    );

  if (filtered.length === 0)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500 italic">
        No materials found for this project.
      </div>
    );

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Material Procurement
          </h2>
        </div>
        <span className="text-xs text-gray-500">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-700 align-middle table-fixed">
          {/* prettier-ignore */}
          <colgroup><col style={{ width: "38%" }} /><col style={{ width: "46%" }} /><col style={{ width: "16%" }} /></colgroup>

          <thead>
            <tr className="text-gray-500 font-medium border-b border-gray-100">
              <th className="py-2 text-left font-medium">Material</th>
              <th className="py-2 text-left font-medium pr-3">Received</th>
              <th className="py-2 text-right font-medium pr-1">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m: any, i: number) => {
              const ordered = Number(m.ordered) || 0;
              const received = Number(m.received) || 0;
              const pct = ordered > 0 ? Math.min(100, Math.round((received / ordered) * 100)) : 0;
              const status = getStatus(m);

              return (
                <tr
                  key={i}
                  className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Material Name */}
                  <td className="py-2 font-medium text-gray-900 truncate">{m.name}</td>

                  {/* Received / Progress */}
                  <td className="py-2 text-gray-600 pr-3">
                    <div className="flex items-center gap-3">
                      {/* Fixed width number section */}
                      <div className="min-w-[110px] text-gray-600">
                        {received}/{ordered}{" "}
                        <span className="text-gray-400">{m.unit}</span>
                      </div>

                      {/* Flexing progress bar */}
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-sm overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${pct >= 100 ? "bg-green-500" : "bg-amber-500"
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2 pr-1 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 ${status.color} font-medium`}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}