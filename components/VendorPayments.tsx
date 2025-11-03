"use client";

import { Wallet2, CheckCircle2, AlertTriangle } from "lucide-react";

type Vendor = {
  name: string;
  service: string;
  amount: string;
  paid: number; // %
  dueDate: string;
};

export default function VendorPayments({ vendors }: { vendors?: Vendor[] }) {
  const list =
    vendors || [
      { name: "Sai Electricals", service: "Electrical Wiring", amount: "₹80 000", paid: 75, dueDate: "2024-07-25" },
      { name: "Maa Cement Works", service: "Civil Contract", amount: "₹2.4 L", paid: 100, dueDate: "2024-06-12" },
      { name: "Sunshine Paints", service: "Painting", amount: "₹60 000", paid: 30, dueDate: "2024-08-10" },
    ];

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
            {list.map((v, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{v.name}</td>
                <td className="px-3 py-2">{v.service}</td>
                <td className="px-3 py-2">{v.amount}</td>
                <td className="px-3 py-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${v.paid === 100 ? "bg-green-600" : "bg-blue-600"}`}
                      style={{ width: `${v.paid}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{v.paid}%</span>
                </td>
                <td className="px-3 py-2 text-xs text-gray-600 flex items-center gap-1">
                  {v.paid === 100 ? (
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  )}
                  {v.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}