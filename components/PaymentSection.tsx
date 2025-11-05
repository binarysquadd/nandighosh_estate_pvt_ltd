"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ChevronDown,
  ChevronRight,
  IndianRupee,
  Smartphone,
  CreditCard,
  Banknote,
  CalendarDays,
  ClipboardList,
  FileText,
  UserCheck,
  Building2,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId: string };

export default function PaymentDashboard({ projectId }: Props) {
  const { data: allPayments, isLoading, error } = useSheetsData("Payments");
  const [collapsed, setCollapsed] = useState(true); // closed by default

  // normalize helper
  const normalizeKey = (k: string) =>
    k.trim().toLowerCase().replace(/\s+/g, "").replace(/[_-]/g, "");

  const payments = useMemo(() => {
    if (!allPayments || !projectId) return [] as any[];

    const pid = projectId.toString().trim().toLowerCase();

    return (allPayments as any[])
      .map((row) => {
        const n: any = {};
        Object.keys(row).forEach((k) => (n[normalizeKey(k)] = row[k]));
        n.__raw = row;
        return n;
      })
      .filter(
        (r) =>
          r.projectid?.toString().trim().toLowerCase() === pid
      );
  }, [allPayments, projectId]);

  // summary metrics
  const totalPaid = payments
    .filter((p) => /paid/i.test(p.status))
    .reduce((sum, p) => sum + (Number(p.amount?.toString().replace(/[₹,]/g, "")) || 0), 0);

  const totalBudget = payments.reduce(
    (sum, p) => sum + (Number(p.amount?.toString().replace(/[₹,]/g, "")) || 0),
    0
  );
  const pending = totalBudget - totalPaid;
  const utilizedPercent = totalBudget ? (totalPaid / totalBudget) * 100 : 0;

  // sorting (latest first)
  payments.sort((a, b) => {
    const ad = a.__raw["Date"] || a.__raw["date"];
    const bd = b.__raw["Date"] || b.__raw["date"];
    const at = Date.parse(ad);
    const bt = Date.parse(bd);
    return Number.isFinite(bt) && Number.isFinite(at) ? bt - at : 0;
  });

  // formatters
  const fmtDate = (v: any) => {
    const t = Date.parse(v);
    if (Number.isFinite(t))
      return new Date(t).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    return v || "—";
  };

  const fmtMoney = (v: any) => {
    const num = Number(String(v).replace(/[^0-9.]/g, ""));
    if (!isNaN(num))
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
    return v || "—";
  };

  const modeIcon = (mode: string) => {
    if (/upi/i.test(mode)) return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
    if (/card/i.test(mode)) return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
    if (/bank|neft|transfer/i.test(mode))
      return <Banknote className="w-3.5 h-3.5 text-green-600" />;
    return <Wallet className="w-3.5 h-3.5 text-gray-500" />;
  };

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading payment data...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load payment data.
      </div>
    );

  if (!payments.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Payments
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            No payments found for this project
          </span>
        </div>
      </section>
    );

  // headers from sheet (exclude project id)
  const headers = Object.keys(payments[0].__raw).filter(
    (k) => !/project\s*id/i.test(k)
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
          <Wallet className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Payment Details
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-green-500" />
          {fmtMoney(totalPaid)} Paid / {fmtMoney(totalBudget)} Total
        </span>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="payment-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-gray-600">
                Total Budget: <span className="text-gray-900">{fmtMoney(totalBudget)}</span>
              </div>
              <div className="text-green-600">
                Paid: <span className="font-semibold">{fmtMoney(totalPaid)}</span>
              </div>
              <div className="text-red-600">
                Pending: <span className="font-semibold">{fmtMoney(pending)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                <span>Budget Utilized</span>
                <span>{utilizedPercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${utilizedPercent}%` }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    {headers.map((key) => (
                      <th
                        key={key}
                        className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]"
                      >
                        <div className="flex items-center gap-1">
                          {headerIcon(key)}
                          {key}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr
                      key={i}
                      className={`border-b last:border-0 border-gray-100 hover:bg-gray-50 transition ${/sched/i.test(p.status) ? "bg-yellow-50" : ""
                        }`}
                    >
                      {headers.map((key) => (
                        <td key={key} className="py-2 text-gray-700 whitespace-nowrap">
                          {renderValue(p.__raw[key], key)}
                        </td>
                      ))}
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

// Helper icons for headers
function headerIcon(key: string) {
  if (/date/i.test(key)) return <CalendarDays className="w-3.5 h-3.5 text-gray-500" />;
  if (/amount|total|budget/i.test(key))
    return <IndianRupee className="w-3.5 h-3.5 text-green-600" />;
  if (/mode/i.test(key)) return <Smartphone className="w-3.5 h-3.5 text-blue-500" />;
  if (/status/i.test(key)) return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
  if (/note|remark/i.test(key)) return <ClipboardList className="w-3.5 h-3.5 text-gray-500" />;
  if (/vendor/i.test(key)) return <Building2 className="w-3.5 h-3.5 text-teal-600" />;
  if (/invoice/i.test(key)) return <FileText className="w-3.5 h-3.5 text-gray-600" />;
  if (/stage/i.test(key)) return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
  return <Wallet className="w-3.5 h-3.5 text-gray-400" />;
}

// Helper formatting for cell values
function renderValue(val: any, key: string) {
  if (!val) return "—";
  if (/amount|total|budget/i.test(key)) {
    const num = Number(String(val).replace(/[^0-9.]/g, ""));
    if (!isNaN(num))
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
  }
  if (/date/i.test(key)) {
    const t = Date.parse(val);
    if (Number.isFinite(t))
      return new Date(t).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }
  return val;
}
