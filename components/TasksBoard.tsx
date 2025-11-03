"use client";

import { ClipboardList, FileCheck2, Clock } from "lucide-react";

export default function TasksBoard({ project }: { project: any }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Project Tasks & Approvals
        </h2>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Overall Task Progress
          </h4>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {project.progress}% of project tasks completed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Approvals */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Approvals
            </h4>
            <ul className="text-sm text-gray-600 space-y-1.5">
              {project.approvals.map((a: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-green-600" /> {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Pending Tasks */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Pending Tasks
            </h4>
            <ul className="text-sm text-gray-600 space-y-1.5">
              {project.pendingTasks.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-orange-500 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}