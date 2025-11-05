"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Receipt,
  Percent,
  ChevronDown,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Invoice = {
  id: string;
  projectId: string;
  date: string;
  amount: string;
  gst: string;
  status: "Paid" | "Pending";
};

export default function TaxDashboard({ projectId }: { projectId: string }) {
  const { data: allInvoices, isLoading, error } = useSheetsData("Invoices");
  const [collapsed, setCollapsed] = useState(true);

  const invoices: Invoice[] = useMemo(() => {
    if (!allInvoices || !projectId) return [];
    const pid = projectId.toString().trim();
    return (allInvoices as any[]).filter(
      (inv) => inv.projectId?.toString().trim() === pid
    );
  }, [allInvoices, projectId]);

  const total = invoices.reduce((acc, i) => {
    const amt = parseFloat(i.amount?.replace(/[^0-9.]/g, "") || "0");
    return acc + amt;
  }, 0);

  const gst = invoices.reduce((acc, i) => {
    const val = parseFloat(i.gst?.replace(/[^0-9.]/g, "") || "0");
    return acc + val;
  }, 0);

  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const pendingCount = invoices.length - paidCount;

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading invoices...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load invoice data.
      </div>
    );

  if (!invoices.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Invoice / Tax Summary
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            No invoices found for this project
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
          <FileText className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Invoice / Tax Summary
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-green-500" />
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(total)}{" "}
          Total
        </span>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="tax-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-gray-700 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-green-600" />
                <span>
                  Total:{" "}
                  <strong className="text-gray-900">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(total)}
                  </strong>
                </span>
              </div>
              <div className="text-blue-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span>
                  GST:{" "}
                  <strong>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(gst)}
                  </strong>
                </span>
              </div>
              <div className="text-gray-600">
                Paid:{" "}
                <span className="font-semibold text-green-600">
                  {paidCount}
                </span>{" "}
                / {invoices.length}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Invoice ID
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Date
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Amount
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      GST
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr
                      key={i.id}
                      className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-2 font-medium text-gray-900 truncate">
                        {i.id}
                      </td>
                      <td className="py-2 text-gray-700">{i.date}</td>
                      <td className="py-2 text-gray-700">{i.amount}</td>
                      <td className="py-2 text-gray-700">{i.gst}</td>
                      <td className="py-2">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-[11px] font-medium ${
                            i.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Footer */}
            <div className="flex justify-end text-xs mt-3 text-gray-600">
              <span>
                Pending Invoices:{" "}
                <strong className="text-amber-600">{pendingCount}</strong>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
