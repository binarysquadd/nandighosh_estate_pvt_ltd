"use client";

import { CalendarDays, Building2, Wrench, Home, Layers, Ruler } from "lucide-react";

export default function ProjectOverview({ project }: { project: any }) {
  const metrics = [
    { label: "Total Units", value: project.totalUnits, icon: Home },
    { label: "Sold Units", value: project.soldUnits, icon: Wrench },
    { label: "Total Area", value: project.totalArea, icon: Ruler },
    { label: "Floors", value: project.floors, icon: Layers },
  ];

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-semibold text-gray-900">Project Overview</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {/* Metrics */}
        <div className="p-3">
          <h4 className="text-[13px] font-medium text-gray-700 mb-2 uppercase tracking-wide">
            Metrics
          </h4>
          <ul className="space-y-2 text-sm">
            {metrics.map(({ label, value, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-gray-700">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{label}</span>
                <strong className="text-gray-900">{value || "—"}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="p-3">
          <h4 className="text-[13px] font-medium text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-blue-500" /> Timeline
          </h4>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li className="flex justify-between">
              <span>Start</span>
              <strong className="text-gray-900">{project.startDate || "—"}</strong>
            </li>
            <li className="flex justify-between">
              <span>Completion</span>
              <strong className="text-gray-900">{project.expectedCompletion || "—"}</strong>
            </li>
            <li className="flex justify-between">
              <span>Next Milestone</span>
              <span className="text-blue-600 font-medium">{project.nextMilestone || "—"}</span>
            </li>
          </ul>
        </div>

        {/* Progress */}
        <div className="p-3">
          <h4 className="text-[13px] font-medium text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-1">
            <Wrench className="w-4 h-4 text-blue-500" /> Progress
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Overall</span>
              <strong className="text-gray-900">{project.progress || 0}%</strong>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Status:{" "}
              <span className="font-medium text-gray-800">
                {project.status || "In Progress"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}