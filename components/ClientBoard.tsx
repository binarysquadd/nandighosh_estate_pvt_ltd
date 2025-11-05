"use client";

import { useMemo } from "react";
import { useSheetsData } from "@/hooks/useSheetsData";
import { Building2, Users, Mail, Phone, Layers, Ruler } from "lucide-react";

export default function ClientBoard({ projectId }: { projectId: string }) {
  const { data: allDetails, isLoading, error } = useSheetsData("ProjectDetails");

  const project = useMemo(() => {
    if (!allDetails || !projectId) return null;

    const stringProjectId = String(projectId); // Convert to string
    const trimmedProjectId = stringProjectId.trim();

    // Normalize projectId before matching
    const pid = trimmedProjectId.toLowerCase();

    const rows = (allDetails as any[]).map((r) => normalizeRow(r));
    const found = rows.find(
      (r) => r.projectId && r.projectId.trim().toLowerCase() === pid
    );

    if (!found && process.env.NODE_ENV === "development") {
      console.warn(
        `[ClientBoard] No match found for projectId: ${pid}`,
        rows.map((r) => r.projectId)
      );
    }

    return found || null;
  }, [allDetails, projectId]);

  if (isLoading)
    return (
      <section className="bg-white border p-4 text-sm text-gray-500">
        Loading client details...
      </section>
    );

  if (error)
    return (
      <section className="bg-white border p-4 text-sm text-red-500">
        Failed to load project details.
      </section>
    );

  if (!project)
    return (
      <section className="bg-white border p-4 text-sm text-gray-500">
        No matching project details found.
      </section>
    );

  // Normalize contractor data
  const contractors =
    typeof project.contractors === "string"
      ? project.contractors
        .split(/[,;\n]/)
        .map((c) => c.trim())
        .filter(Boolean)
      : Array.isArray(project.contractors)
        ? project.contractors
        : [];

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">
          Client & Contractors
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
        <div>
          <p className="text-[13px] uppercase tracking-wide text-gray-500 mb-0.5">
            Client
          </p>
          <p className="font-medium text-gray-900">{project.client || "—"}</p>
        </div>
        <div>
          <p className="text-[13px] uppercase tracking-wide text-gray-500 mb-0.5">
            Contact
          </p>
          {project.clientContact ? (
            <a
              href={`tel:${project.clientContact.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1 text-gray-900 font-medium hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              {project.clientContact}
            </a>
          ) : (
            <p className="font-medium text-gray-900">—</p>
          )}
        </div>
        <div>
          <p className="text-[13px] uppercase tracking-wide text-gray-500 mb-0.5">
            Email
          </p>
          {project.clientEmail ? (
            <a
              href={`mailto:${project.clientEmail}`}
              className="inline-flex items-center gap-1 text-blue-700 font-medium hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              {project.clientEmail}
            </a>
          ) : (
            <p className="font-medium text-gray-900">—</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <span>
            Total Area:{" "}
            <strong className="text-gray-900">
              {project.totalArea || "—"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span>
            Floors:{" "}
            <strong className="text-gray-900">{project.floors || "—"}</strong>
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h4 className="text-[13px] font-medium text-gray-700 uppercase tracking-wide">
            Contractors
          </h4>
          <span className="text-[11px] text-gray-500">
            ({contractors.length})
          </span>
        </div>

        {contractors.length ? (
          <div className="flex flex-wrap gap-2">
            {contractors.map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium bg-gray-100 border border-gray-200 text-gray-800"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">
            No contractors listed for this project.
          </p>
        )}
      </div>
    </section>
  );
}

function normalizeRow(row: any) {
  return {
    projectId: (row.projectId || row.ProjectId || row.projectID || "").toString().trim(),
    client: row.client || row.Client || "",
    clientContact: row.clientContact || row.ClientContact || "",
    clientEmail: row.clientEmail || row.ClientEmail || "",
    totalArea: row.totalArea || row.TotalArea || "",
    floors: row.floors || row.Floors || "",
    contractors: row.contractors || row.Contractors || "",
  };
}
