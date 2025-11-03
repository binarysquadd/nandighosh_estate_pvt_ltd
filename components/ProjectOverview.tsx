"use client";

import { CalendarDays, Building2, Wrench } from "lucide-react";

export default function ProjectOverview({ project }: { project: any }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Project Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Project Metrics
          </h4>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>
              <strong className="text-gray-900">{project.totalUnits}</strong>{" "}
              Total Units
            </li>
            <li>
              <strong className="text-gray-900">{project.soldUnits}</strong>{" "}
              Sold
            </li>
            <li>
              <strong className="text-gray-900">{project.totalArea}</strong>{" "}
              Total Area
            </li>
            <li>
              <strong className="text-gray-900">{project.floors}</strong>{" "}
              Floors
            </li>
          </ul>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-blue-500" /> Timeline
          </h4>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>
              Start: <strong>{project.startDate}</strong>
            </li>
            <li>
              Completion: <strong>{project.expectedCompletion}</strong>
            </li>
            <li>
              Next Milestone:{" "}
              <span className="text-blue-600">{project.nextMilestone}</span>
            </li>
          </ul>
        </div>

        {/* Progress */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Wrench className="w-4 h-4 text-blue-500" /> Progress
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Completion</span>
              <span className="font-medium text-gray-900">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}