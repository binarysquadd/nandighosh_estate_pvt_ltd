"use client";

import { Users2, TrendingUp } from "lucide-react";

type Unit = {
  id: string;
  type: string;
  buyer?: string;
  price: string;
  status: "Available" | "Sold" | "Reserved";
};

export default function SalesDashboard({ units }: { units?: Unit[] }) {
  const data =
    units || [
      { id: "A101", type: "2 BHK", buyer: "R. Patnaik", price: "₹58 L", status: "Sold" },
      { id: "A102", type: "2 BHK", price: "₹58 L", status: "Available" },
      { id: "B201", type: "3 BHK", buyer: "S. Dash", price: "₹74 L", status: "Reserved" },
      { id: "C301", type: "3 BHK", price: "₹76 L", status: "Available" },
    ];

  const sold = data.filter((u) => u.status === "Sold").length;
  const reserved = data.filter((u) => u.status === "Reserved").length;
  const available = data.filter((u) => u.status === "Available").length;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sales Dashboard</h2>
        </div>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          {sold} Sold / {data.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Buyer</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr
                key={u.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2 font-medium">{u.id}</td>
                <td className="px-3 py-2">{u.type}</td>
                <td className="px-3 py-2">{u.buyer || "—"}</td>
                <td className="px-3 py-2">{u.price}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.status === "Sold"
                        ? "bg-green-100 text-green-700"
                        : u.status === "Reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.status}
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