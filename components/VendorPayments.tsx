"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Wrench,
  IndianRupee,
  CalendarDays,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId: string };

function parsePercent(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function VendorPaymentsDashboard({ projectId }: Props) {
  const { data: allVendors, isLoading, error } = useSheetsData("Vendors");
  const [collapsed, setCollapsed] = useState(true);

  const rows = useMemo(() => {
    if (!allVendors || !projectId) return [];
    return (allVendors as any[]).filter(
      (v) => v.projectId?.toString().trim() === projectId.toString().trim()
    );
  }, [allVendors, projectId]);

  // summary
  const totalVendors = rows.length;
  const totalAmount = rows.reduce((sum, v) => {
    const amt = parseFloat(String(v.amount || "").replace(/[^0-9.]/g, ""));
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);
  const avgProgress =
    rows.length > 0
      ? rows.reduce((sum, v) => sum + parsePercent(v.paidPercent), 0) /
        rows.length
      : 0;
  const completedCount = rows.filter((v) => parsePercent(v.paidPercent) === 100)
    .length;

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading vendor payments…
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load vendor payments.
      </div>
    );

  if (!rows.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Vendor Payments
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            No vendors found for this project
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
          <Wallet2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Vendor Payments
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          {completedCount}/{totalVendors} Completed
        </span>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="vendor-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-gray-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-gray-600" />
                Total Vendors:{" "}
                <span className="text-gray-900 font-semibold">
                  {totalVendors}
                </span>
              </div>
              <div className="text-green-700 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                Total:{" "}
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(totalAmount)}
                </span>
              </div>
              <div className="text-blue-700 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                Avg Progress:{" "}
                <span className="font-semibold">
                  {avgProgress.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Vendor
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Service
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Amount
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Progress
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((v: any, i: number) => {
                    const pct = parsePercent(v.paidPercent);
                    return (
                      <tr
                        key={i}
                        className={`border-b last:border-0 border-gray-100 hover:bg-gray-50 transition ${
                          pct === 100 ? "bg-green-50" : ""
                        }`}
                      >
                        <td className="py-2 font-medium text-gray-900 truncate">
                          {v.vendor}
                        </td>
                        <td className="py-2 text-gray-700">{v.service}</td>
                        <td className="py-2 text-gray-700">{v.amount}</td>
                        <td className="py-2">
                          <div className="w-32 bg-gray-100 rounded-full h-2 mb-1">
                            <div
                              className={`h-2 rounded-full ${
                                pct === 100 ? "bg-green-600" : "bg-blue-600"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-gray-500">
                            {pct}%
                          </span>
                        </td>
                        <td className="py-2 text-xs text-gray-600 flex items-center gap-1">
                          {pct === 100 ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                          {v.dueDate || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer summary */}
            <div className="flex justify-end mt-3 text-xs text-gray-600">
              <span>
                {completedCount} vendors fully paid,{" "}
                {totalVendors - completedCount} pending
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
