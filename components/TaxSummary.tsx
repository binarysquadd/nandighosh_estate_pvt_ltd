"use client";

import { FileText, Receipt, Percent } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Invoice = {
  id: string;
  projectId: string;
  date: string;
  amount: string;
  gst: string;
  status: "Paid" | "Pending";
};

export default function TaxSummary({ projectId }: { projectId: string }) {
  // ✅ Fetch invoices from Sheets
  const { data: allInvoices, isLoading, error } = useSheetsData("Invoices");

  // ✅ Filter invoices for the current project
  const invoices: Invoice[] =
    allInvoices?.filter((inv: any) => inv.projectId === projectId) || [];

  // ✅ Compute totals
  const total = invoices.reduce((acc, i) => {
    const amt = parseFloat(i.amount?.replace(/[^0-9.]/g, "") || "0");
    return acc + amt;
  }, 0);

  const gst = invoices.reduce((acc, i) => {
    const val = parseFloat(i.gst?.replace(/[^0-9.]/g, "") || "0");
    return acc + val;
  }, 0);

  const paidCount = invoices.filter((i) => i.status === "Paid").length;

  if (isLoading)
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-gray-500">
        Loading invoices...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-red-500">
        Failed to load invoice data.
      </div>
    );

  if (!invoices.length)
    return (
      <div className="bg-white border rounded-xl p-5 text-sm text-gray-500">
        No invoice records found for this project.
      </div>
    );

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Invoice / Tax Summary
        </h2>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-1 text-green-700 font-semibold">
          <Receipt className="w-4 h-4" /> Total Invoiced: ₹
          {(total / 100000).toFixed(2)} L
        </div>
        <div className="flex items-center gap-1 text-blue-700 font-semibold">
          <Percent className="w-4 h-4" /> GST Collected: ₹
          {(gst / 1000).toFixed(1)} K
        </div>
        <div className="text-gray-600 font-medium hidden sm:block">
          Paid Invoices: {paidCount}/{invoices.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Invoice ID</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">GST</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr
                key={i.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2 font-medium">{i.id}</td>
                <td className="px-3 py-2">{i.date}</td>
                <td className="px-3 py-2">{i.amount}</td>
                <td className="px-3 py-2">{i.gst}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      i.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
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
    </section>
  );
}