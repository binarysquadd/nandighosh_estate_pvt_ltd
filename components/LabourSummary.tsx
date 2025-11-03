"use client";

import { HardHat, IndianRupee, CalendarDays } from "lucide-react";

export default function LabourSummary() {
  const summary = {
    totalWorkers: 42,
    skilled: 15,
    unskilled: 27,
    dailyWage: "₹650",
    monthlySpend: "₹8.2 L",
    lastUpdated: "2024-06-30",
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <HardHat className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Labour Summary</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Total Workers</p>
          <p className="text-lg font-semibold text-gray-900">{summary.totalWorkers}</p>
        </div>
        <div>
          <p className="text-gray-500">Skilled / Unskilled</p>
          <p className="text-lg font-semibold text-gray-900">
            {summary.skilled}/{summary.unskilled}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Daily Wage (avg)</p>
          <p className="text-lg font-semibold text-gray-900">{summary.dailyWage}</p>
        </div>
        <div>
          <p className="text-gray-500">Monthly Spend</p>
          <p className="text-lg font-semibold text-gray-900">{summary.monthlySpend}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center gap-1 text-gray-500 mt-2">
          <CalendarDays className="w-4 h-4" />
          Last updated {summary.lastUpdated}
        </div>
      </div>
    </section>
  );
}