"use client";

import { useMemo } from "react";
import { Users2, TrendingUp } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Unit = {
  id: string;
  projectId: string;
  type: string;
  buyer?: string;
  price: string;
  status: "Available" | "Sold" | "Reserved";
};

// Normalize a row coming from Sheets
function normalizeRow(row: any): Unit | null {
  if (!row) return null;

  const _id =
    (row.id ?? row.ID ?? row.unitId ?? row.Unit ?? "").toString().trim();
  const _projectId = (
    row.projectId ??
    row.ProjectId ??
    row.projectID ??
    row["project id"] ??
    row.projectid ??
    ""
  )
    .toString()
    .trim();

  const _type = (row.type ?? row.Type ?? "").toString().trim();
  const _buyer = (row.buyer ?? row.Buyer ?? "").toString().trim() || undefined;
  const _price = (row.price ?? row.Price ?? "").toString().trim();

  const rawStatus = (row.status ?? row.Status ?? "Available")
    .toString()
    .trim();
  const _status: Unit["status"] =
    rawStatus === "Sold" || rawStatus === "Reserved" || rawStatus === "Available"
      ? rawStatus
      : "Available";

  if (!_id || !_projectId) return null;

  return { id: _id, projectId: _projectId, type: _type, buyer: _buyer, price: _price, status: _status };
}

export default function SalesDashboard({ projectId }: { projectId: string }) {
  const { data: allSales, isLoading, error } = useSheetsData("Sales");

  const units = useMemo(() => {
    if (!allSales || !projectId) return [] as Unit[];
    const pid = projectId.toString().trim();
    return (allSales as any[])
      .map(normalizeRow)
      .filter((u): u is Unit => !!u && u.projectId === pid);
  }, [allSales, projectId]);

  const sold = units.filter((u) => u.status === "Sold").length;
  const reserved = units.filter((u) => u.status === "Reserved").length;
  const available = units.filter((u) => u.status === "Available").length;

  if (isLoading) {
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-gray-500">
        Loading sales data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-red-500">
        Failed to load sales data.
      </div>
    );
  }

  if (!units.length) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Sales Dashboard</h2>
          </div>
          <span className="text-sm text-gray-500">No units found for this project</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sales Dashboard</h2>
        </div>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          {sold} Sold / {units.length} Total
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="text-green-600 font-semibold">Sold: {sold}</div>
        <div className="text-yellow-600 font-semibold">Reserved: {reserved}</div>
        <div className="text-gray-600 font-semibold">Available: {available}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Buyer</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="px-3 py-2 font-medium">{u.id}</td>
                <td className="px-3 py-2">{u.type || "—"}</td>
                <td className="px-3 py-2">{u.buyer || "—"}</td>
                <td className="px-3 py-2">{u.price || "—"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.status === "Sold"
                        ? "bg-green-100 text-green-700"
                        : u.status === "Reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}