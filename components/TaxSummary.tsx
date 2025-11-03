"use client";

import { FileText, Receipt, Percent } from "lucide-react";

type Invoice = {
  id: string;
  date: string;
  amount: string;
  gst: string;
  status: "Paid" | "Pending";
};

export default function TaxSummary({ invoices }: { invoices?: Invoice[] }) {
  const list =
    invoices || [
      { id: "INV-001", date: "2024-04-10", amount: "₹8,00,000", gst: "₹96,000", status: "Paid" },
      { id: "INV-002", date: "2024-05-05", amount: "₹5,50,000", gst: "₹66,000", status: "Pending" },
      { id: "INV-003", date: "2024-06-12", amount: "₹6,20,000", gst: "₹74,400", status: "Paid" },
    ];

  const total = list.reduce((acc, i) => acc + parseInt(i.amount.replace(/[^0-9]/g, "")), 0);
  const gst = list.reduce((acc, i) => acc + parseInt(i.gst.replace(/[^0-9]/g, "")), 0);

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Invoice / Tax Summary</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-1 text-green-700 font-semibold">
          <Receipt className="w-4 h-4" /> Total Invoiced: ₹{(total / 100000).toFixed(2)} L
        </div>
        <div className="flex items-center gap-1 text-blue-700 font-semibold">
          <Percent className="w-4 h-4" /> GST Collected: ₹{(gst / 1000).toFixed(1)} K
        </div>
        <div className="text-gray-600 font-medium hidden sm:block">
          Paid Invoices: {list.filter(i => i.status === "Paid").length}/{list.length}
        </div>
      </div>

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
            {list.map((i) => (
              <tr key={i.id} className="border-b last:border-0 hover:bg-gray-50 transition">
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