"use client";

import React from "react";

type Props = { project: any };

export default function ClientBoard({ project }: Props) {
  if (!project)
    return (
      <section className="bg-white rounded-xl border p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
        <p className="text-gray-500 text-sm">No project data available.</p>
      </section>
    );

  // Normalize contractors into a clean list
  const contractors =
    typeof project.contractors === "string"
      ? project.contractors
          .split(/[,;\n]/)
          .map((c: string) => c.trim())
          .filter(Boolean)
      : Array.isArray(project.contractors)
      ? project.contractors
      : [];

  const clientName = project.client || "—";
  const clientContact = project.clientContact || project.contact || "—";
  const clientEmail = project.clientEmail || project.email || "—";

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{clientName}</p>
        </div>
        <div>
          <p className="text-gray-500">Contact</p>
          <p className="font-medium text-gray-900">{clientContact}</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{clientEmail}</p>
        </div>
      </div>

      <h4 className="font-medium text-gray-900 mb-2">Contractors</h4>
      {contractors.length > 0 ? (
        <ul className="space-y-1.5 text-gray-700">
          {contractors.map((c: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic text-sm">
          No contractors listed for this project.
        </p>
      )}
    </section>
  );
}