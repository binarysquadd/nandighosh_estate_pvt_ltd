"use client";

import { useMemo } from "react";
import { Upload, PlusCircle } from "lucide-react";
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

function normBool(v: any) {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "y" || s === "1";
}

function normalizeRow(row: any): Doc | null {
  if (!row) return null;

  const id =
    (row.id ?? row.ID ?? row.docId ?? row.DocId ?? "").toString().trim();
  const projectId =
    (
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

export default function DocumentsSection({ projectId }: { projectId: string }) {
  const { data: allDocs, isLoading, error } = useSheetsData("Documents");

  const docs: Doc[] = useMemo(() => {
    if (!allDocs) return [];
    const pid = projectId?.toString().trim();
    return (allDocs as any[])
      .map(normalizeRow)
      .filter((d): d is Doc => !!d && (!pid || d.projectId === pid));
  }, [allDocs, projectId]);

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const today = new Date();
    const exp = new Date(date);
    const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays < 60;
  };

  if (isLoading)
    return (
      <section className="bg-white rounded-xl border p-5 shadow-sm">
        <div className="text-sm text-gray-500">Loading documents…</div>
      </section>
    );

  if (error)
    return (
      <section className="bg-white rounded-xl border p-5 shadow-sm">
        <div className="text-sm text-red-500">Failed to load documents.</div>
      </section>
    );

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Documents &amp; Compliance</h2>
        </div>
        <button
          type="button"
          onClick={() => window.alert("MVP: add custom document modal here")}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="text-sm text-gray-500">No documents for this project.</div>
      ) : (
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
                <tr key={doc.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-3 py-2 font-medium">{doc.name}</td>
                  <td className="px-3 py-2">{doc.category}</td>
                  <td className="px-3 py-2">{doc.expiry || "—"}</td>
                  <td className="px-3 py-2">
                    {doc.expiry ? (
                      isExpiringSoon(doc.expiry) ? (
                        <span className="text-orange-600 text-xs font-medium">Renew Soon</span>
                      ) : (
                        <span className="text-green-600 text-xs font-medium">Active</span>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {doc.uploaded ? (
                      <span className="text-green-700 text-xs font-medium">Uploaded</span>
                    ) : (
                      <span className="text-gray-500 text-xs font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}