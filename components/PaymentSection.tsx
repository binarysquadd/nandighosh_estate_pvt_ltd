"use client";

import {
  Mail,
  MessageSquare,
  PhoneCall,
  Smartphone,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = {
  projectId: string;
};

export default function PaymentSection({ projectId }: Props) {
  // ✅ Fetch all payments from Google Sheets
  const { data: allPayments, isLoading, error } = useSheetsData("Payments");

  // ✅ Filter only payments for this project
  const payments = allPayments?.filter(
    (p: any) => p.projectId === projectId
  ) || [];

  // ✅ Identify next scheduled payment
  const next = payments.find((p: any) => p.status === "Scheduled");

  // ✅ Calculate budget summary (auto if totals not in sheet)
  const totalPaid = payments
    .filter((p: any) => p.status === "Paid")
    .reduce((sum: number, p: any) => sum + Number(p.amount.replace(/[₹,]/g, "")), 0);
  const totalBudget =
    payments.reduce((sum: number, p: any) => sum + Number(p.amount.replace(/[₹,]/g, "")), 0) || 0;
  const pending = totalBudget - totalPaid;
  const utilizedPercent = totalBudget ? (totalPaid / totalBudget) * 100 : 0;

  // ✅ Loading & Error
  if (isLoading)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Loading payment details...
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
        Failed to load payment data.
      </div>
    );

  // ✅ Fallback for empty projects
  if (payments.length === 0)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        No payment records found for this project.
      </div>
    );

  // ✅ Helper for icons
  const modeIcon = (mode: string) => {
    switch (mode) {
      case "UPI":
        return <Smartphone className="w-4 h-4 text-blue-500 mr-1" />;
      case "Card":
        return <CreditCard className="w-4 h-4 text-blue-500 mr-1" />;
      default:
        return <Banknote className="w-4 h-4 text-blue-500 mr-1" />;
    }
  };

  return (
    <section className="mt-4">
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            💰 Project Financials
          </h2>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Export CSV
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">Total Budget</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              ₹{totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="text-xl font-semibold text-green-600 mt-1">
              ₹{totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-semibold text-red-500 mt-1">
              ₹{pending.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
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

        {/* Payments Table */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Recent Payments
          </h3>
          <div className="overflow-hidden border border-gray-100 rounded-md">
            <table className="min-w-full text-xs text-gray-700">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Mode</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any, i: number) => (
                  <tr
                    key={i}
                    className={`border-b last:border-0 ${
                      p.status === "Scheduled"
                        ? "bg-yellow-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">{p.date}</td>
                    <td className="px-3 py-2">{p.amount}</td>
                    <td className="px-3 py-2 flex items-center">
                      {modeIcon(p.mode)} {p.mode}
                    </td>
                    <td
                      className={`px-3 py-2 font-medium ${
                        p.status === "Paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next payment + reminders */}
        {next && (
          <div className="bg-blue-50 border-t border-blue-100 px-4 py-5 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-sm font-semibold text-gray-900">
                Next Payment
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                {next.amount} scheduled for{" "}
                <b>{next.date}</b> via {next.mode}
              </p>
              <p className="text-xs text-gray-500">{next.note}</p>
            </div>

            {/* Reminder buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center bg-white text-gray-800 text-xs font-medium px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Email
              </button>
              <button className="flex items-center bg-white text-gray-800 text-xs font-medium px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition">
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-green-600" /> SMS
              </button>
              <button className="flex items-center bg-green-500 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-green-600 transition">
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}