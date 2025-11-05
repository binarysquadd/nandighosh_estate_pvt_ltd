"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ChevronDown,
  ChevronRight,
  FileCheck,
  FileX,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Doc = {
  id: string;
  projectId: string;
  name: string;
  category: string;
  required: boolean;
  uploaded: boolean;
  note?: string;
  url?: string;
  expiry?: string;
};

// helpers
function normBool(v: any) {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "y" || s === "1";
}

function normalizeRow(row: any): Doc | null {
  if (!row) return null;
  const id = (row.id ?? row.ID ?? row.docId ?? row.DocId ?? "").toString().trim();
  const projectId = (
    row.projectId ??
    row.ProjectId ??
    row.projectID ??
    row["project id"] ??
    row.projectid ??
    ""
  )
    .toString()
    .trim();

  const name = (row.name ?? row.Name ?? row.document ?? "").toString().trim();
  const category = (row.category ?? row.Category ?? "General").toString().trim();
  const required = normBool(row.required ?? row.Required);
  const uploaded = normBool(row.uploaded ?? row.Uploaded ?? row.status);
  const url = (row.url ?? row.URL ?? row.link ?? "").toString().trim() || undefined;
  const expiry = (row.expiry ?? row.Expiry ?? row.expires ?? "").toString().trim() || undefined;
  const note = (row.note ?? row.Note ?? "").toString().trim() || undefined;

  if (!id || !projectId) return null;
  return { id, projectId, name, category, required, uploaded, url, expiry, note };
}

function isExpiringSoon(date?: string) {
  if (!date) return false;
  const today = new Date();
  const exp = new Date(date);
  const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays < 60;
}

export default function DocumentsDashboard({ projectId }: { projectId: string }) {
  const { data: allDocs, isLoading, error } = useSheetsData("Documents");
  const [collapsed, setCollapsed] = useState(true);

  const docs: Doc[] = useMemo(() => {
    if (!allDocs) return [];
    const pid = projectId?.toString().trim();
    return (allDocs as any[])
      .map(normalizeRow)
      .filter((d): d is Doc => !!d && (!pid || d.projectId === pid));
  }, [allDocs, projectId]);

  const totalDocs = docs.length;
  const uploadedDocs = docs.filter((d) => d.uploaded).length;
  const pendingDocs = totalDocs - uploadedDocs;

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading documents…
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load documents.
      </div>
    );

  if (!docs.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Documents & Compliance</h2>
          </div>
          <span className="text-xs text-gray-500">No documents for this project</span>
        </div>
      </section>
    );

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
          <Upload className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Documents & Compliance
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FileCheck className="w-3.5 h-3.5 text-green-500" />
          {uploadedDocs} Uploaded / {totalDocs} Total
        </span>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="docs-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-gray-600">
                Total: <span className="text-gray-900">{totalDocs}</span>
              </div>
              <div className="text-green-600">
                Uploaded: <span className="font-semibold">{uploadedDocs}</span>
              </div>
              <div className="text-red-600">
                Pending: <span className="font-semibold">{pendingDocs}</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-gray-500" />
                        Name
                      </div>
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      <div className="flex items-center gap-1">
                        <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                        Category
                      </div>
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-600" />
                        Expiry
                      </div>
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Compliance
                      </div>
                    </th>
                    <th className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]">
                      <div className="flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-green-600" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {docs.map((doc) => {
                    const expSoon = isExpiringSoon(doc.expiry);
                    return (
                      <tr
                        key={doc.id}
                        className={`border-b last:border-0 border-gray-100 hover:bg-gray-50 transition ${expSoon ? "bg-yellow-50" : ""
                          }`}
                      >
                        <td className="py-2 font-medium text-gray-900 truncate">
                          {doc.name}
                        </td>
                        <td className="py-2 text-gray-700">{doc.category}</td>
                        <td className="py-2 text-gray-700">{doc.expiry || "—"}</td>
                        <td className="py-2">
                          {doc.expiry ? (
                            expSoon ? (
                              <span className="text-orange-600 text-[11px] font-medium">
                                Renew Soon
                              </span>
                            ) : (
                              <span className="text-green-600 text-[11px] font-medium">
                                Active
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="py-2">
                          {doc.uploaded ? (
                            <span className="inline-flex items-center gap-1 text-green-700 text-[11px] font-medium">
                              <FileCheck className="w-3 h-3" />
                              Uploaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500 text-[11px] font-medium">
                              <FileX className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add Document Button */}
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => window.alert('MVP: Add custom document modal here')}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
