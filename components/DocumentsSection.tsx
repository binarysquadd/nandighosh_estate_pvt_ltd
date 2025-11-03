"use client";

import { useState } from "react";
import { Upload, PlusCircle } from "lucide-react";

type Doc = {
  id: string;
  name: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  note?: string;
  url?: string;
  expiry?: string;
};

export default function DocumentsSection() {
  const [docs, setDocs] = useState<Doc[]>([
    {
      id: "reraCert",
      name: "RERA Registration Certificate",
      category: "Approvals",
      required: true,
      uploaded: false,
      expiry: "2026-08-15",
    },
    {
      id: "fireNoc",
      name: "Fire Safety NOC",
      category: "Approvals",
      required: false,
      uploaded: false,
      expiry: "2025-03-15",
    },
    {
      id: "blueprint",
      name: "Building Blueprint",
      category: "Design",
      required: true,
      uploaded: true,
    },
  ]);

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const today = new Date();
    const exp = new Date(date);
    const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays < 60;
  };

  const addCustomDoc = () => {
    const name = window.prompt("Document name:");
    if (!name) return;
    const dateStr = window.prompt("Expiry date (YYYY-MM-DD)? Optional:");
    setDocs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        category: "Custom",
        required: false,
        uploaded: false,
        expiry: dateStr || undefined,
      },
    ]);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Documents & Compliance
          </h2>
        </div>
        <button
          onClick={addCustomDoc}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          Add Document
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Expiry</th>
              <th className="px-3 py-2 text-left">Compliance</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr
                key={doc.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2 font-medium">{doc.name}</td>
                <td className="px-3 py-2">{doc.category}</td>
                <td className="px-3 py-2">{doc.expiry || "—"}</td>
                <td className="px-3 py-2">
                  {doc.expiry ? (
                    isExpiringSoon(doc.expiry) ? (
                      <span className="text-orange-600 text-xs font-medium">
                        Renew Soon
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs font-medium">
                        Active
                      </span>
                    )
                  ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {doc.uploaded ? (
                    <span className="text-green-700 text-xs font-medium">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs font-medium">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}