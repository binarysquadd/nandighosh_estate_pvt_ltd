"use client";

import { Users, HardHat } from "lucide-react";

export default function ClientBoard({ project }: { project: any }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Client & Contractors
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Client Details</h4>
          <ul className="space-y-1.5 text-gray-600">
            <li>
              <span className="font-medium text-gray-900">
                {project.client}
              </span>
            </li>
            <li>{project.clientContact}</li>
            <li>{project.clientEmail}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
            <HardHat className="w-4 h-4 text-blue-500" /> Contractors
          </h4>
          <ul className="space-y-1.5 text-gray-600">
            {project.contractors.map((c: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}