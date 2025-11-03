"use client";

import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

type Props = {
  data?: {
    received: string;
    pending: string;
    overdue: string;
    avgDelay: string;
  };
};

export default function FinancialHealth({ data }: Props) {
  const financials =
    data || {
      received: "₹7.8 Cr",
      pending: "₹2.5 Cr",
      overdue: "₹50 L",
      avgDelay: "14 days",
    };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Financial Health
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Received</p>
          <p className="font-semibold text-green-700 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> {financials.received}
          </p>
        </div>
        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Pending</p>
          <p className="font-semibold text-orange-600 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" /> {financials.pending}
          </p>
        </div>
        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Overdue</p>
          <p className="font-semibold text-red-600">{financials.overdue}</p>
        </div>
        <div className="hover:bg-gray-50 p-2 rounded-lg transition">
          <p className="text-gray-500">Avg Delay</p>
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" /> {financials.avgDelay}
          </p>
        </div>
      </div>
    </section>
  );
}