"use client";

import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = {
  projectId: string; // compute per project
};

function parseRupees(v: string | number | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  let s = v.toString().trim();
  // normalize: remove ₹, commas, spaces
  s = s.replace(/₹|\s|,/g, "");
  // handle "Cr" (crore) and "L" (lakh)
  if (/cr$/i.test(s)) return parseFloat(s.replace(/cr/i, "")) * 1e7;   // 1 Cr = 10,000,000
  if (/l$/i.test(s))  return parseFloat(s.replace(/l/i, ""))  * 1e5;   // 1 L = 100,000
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export default function FinancialHealth({ projectId }: Props) {
  const { data: allPayments, isLoading, error } = useSheetsData("Payments");

  if (isLoading) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="text-sm text-gray-500">Loading financials…</div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="text-sm text-red-600">Failed to load financials.</div>
      </section>
    );
  }

  const payments = (allPayments || []).filter((p: any) => p.projectId === projectId);

  // Map dataset statuses -> our buckets
  const isPaid      = (s: string) => /received|paid/i.test(s);
  const isPending   = (s: string) => /pending|scheduled/i.test(s);
  const isOverdue   = (s: string) => /overdue/i.test(s);

  const received = payments
    .filter((p: any) => isPaid(p.status))
    .reduce((sum: number, p: any) => sum + parseRupees(p.amount), 0);

  const pending = payments
    .filter((p: any) => isPending(p.status))
    .reduce((sum: number, p: any) => sum + parseRupees(p.amount), 0);

  const overdue = payments
    .filter((p: any) => isOverdue(p.status))
    .reduce((sum: number, p: any) => sum + parseRupees(p.amount), 0);

  // naive “avg delay”: days past due for Overdue rows (if your CSV has due dates in Invoices, we can refine later)
  const overdueRows = payments.filter((p: any) => isOverdue(p.status) && p.dueDate);
  const avgDelay =
    overdueRows.length > 0
      ? Math.round(
          overdueRows.reduce((acc: number, p: any) => {
            const due = new Date(p.dueDate);
            const today = new Date();
            return acc + Math.max(0, (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / overdueRows.length
        )
      : 0;

  const fmt = (n: number) => n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Financial Health</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Received</p>
          <p className="font-semibold text-green-700 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> {fmt(received)}
          </p>
        </div>

        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Pending</p>
          <p className="font-semibold text-orange-600 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" /> {fmt(pending)}
          </p>
        </div>

        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Overdue</p>
          <p className="font-semibold text-red-600">{fmt(overdue)}</p>
        </div>

        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Avg Delay</p>
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" /> {avgDelay} days
          </p>
        </div>
      </div>
    </section>
  );
}