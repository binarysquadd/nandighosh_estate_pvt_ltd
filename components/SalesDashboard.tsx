"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Unit = {
  id: string;
  projectId: string;
  type: string;
  buyer?: string;
  price: string;
  status: "Available" | "Sold" | "Reserved";
};

// Normalize and clean rows from Sheets
function normalizeRow(row: any): Unit | null {
  if (!row) return null;

  const _id = (row.id ?? row.ID ?? row.unitId ?? row.Unit ?? "").toString().trim();
  const _projectId = (
    row.projectId ??
    row.ProjectId ??
    row.projectID ??
    row["project id"] ??
    row.projectid ??
    ""
  )
    .toString()
    .trim()
    .toLowerCase(); // normalize for safe match

  const _type = (row.type ?? row.Type ?? "").toString().trim();
  const _buyer = (row.buyer ?? row.Buyer ?? "").toString().trim() || undefined;
  const _price = (row.price ?? row.Price ?? "").toString().trim();

  const rawStatus = (row.status ?? row.Status ?? "Available").toString().trim();
  const _status: Unit["status"] =
    rawStatus === "Sold" || rawStatus === "Reserved" || rawStatus === "Available"
      ? rawStatus
      : "Available";

  if (!_id || !_projectId) return null;

  return { id: _id, projectId: _projectId, type: _type, buyer: _buyer, price: _price, status: _status };
}

export default function SalesDashboard({ projectId }: { projectId: string }) {
  const { data: allSales, isLoading, error } = useSheetsData("Sales");
  const [collapsed, setCollapsed] = useState(true); // closed by default

  const units = useMemo(() => {
    if (!allSales || !projectId) return [] as Unit[];

    const pid = projectId.toString().trim().toLowerCase(); // match normalized projectId
    return (allSales as any[])
      .map(normalizeRow)
      .filter((u): u is Unit => !!u && u.projectId === pid);
  }, [allSales, projectId]);

  const sold = units.filter((u) => u.status === "Sold").length;
  const reserved = units.filter((u) => u.status === "Reserved").length;
  const available = units.filter((u) => u.status === "Available").length;

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading sales data...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load sales data.
      </div>
    );

  if (!units.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Sales Dashboard
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            No sales found for this project
          </span>
        </div>
      </section>
    );

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
          <Users2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Sales Details
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          {sold} Sold / {units.length} Total
        </span>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="sales-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-green-600">Sold: {sold}</div>
              <div className="text-amber-600">Reserved: {reserved}</div>
              <div className="text-gray-600">Available: {available}</div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>

                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Unit
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Type
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Buyer
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Price
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {units.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-2 font-medium text-gray-900 truncate">
                        {u.id}
                      </td>
                      <td className="py-2 text-gray-700">{u.type || "—"}</td>
                      <td className="py-2 text-gray-700">{u.buyer || "—"}</td>
                      <td className="py-2 text-gray-700">{u.price || "—"}</td>
                      <td className="py-2">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-[11px] font-medium ${
                            u.status === "Sold"
                              ? "bg-green-100 text-green-700"
                              : u.status === "Reserved"
                              ? "bg-amber-100 text-amber-700"
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}