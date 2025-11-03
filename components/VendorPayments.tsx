"use client";

import { Wallet2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId: string };

function parsePercent(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function VendorPayments({ projectId }: Props) {
  const { data: allVendors, isLoading, error } = useSheetsData("Vendors");

  if (isLoading) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="text-sm text-gray-500">Loading vendor payments…</div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="text-sm text-red-600">Failed to load vendor payments.</div>
      </section>
    );
  }

  const rows = (allVendors || []).filter((v: any) => v.projectId === projectId);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Wallet2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Vendor Payments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Vendor</th>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Progress</th>
              <th className="px-3 py-2 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v: any, i: number) => {
              const pct = parsePercent(v.paidPercent);
              return (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{v.vendor}</td>
                  <td className="px-3 py-2">{v.service}</td>
                  <td className="px-3 py-2">{v.amount}</td>
                  <td className="px-3 py-2">
                    <div className="w-32 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${pct === 100 ? "bg-green-600" : "bg-blue-600"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600 flex items-center gap-1">
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
    </section>
  );
}