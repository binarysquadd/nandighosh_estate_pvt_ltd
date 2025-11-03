"use client";

import { Building2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = {
  projectId?: string;
};

export default function MilestoneBoard({ projectId }: Props) {
  // ✅ Fetch milestone data from Google Sheets
  const { data: milestones, isLoading, error } = useSheetsData("Milestones");

  // ✅ Filter for current project
  const filtered =
    milestones?.filter((m: any) => m.projectId === projectId) || [];

  // ✅ Loading / error / empty states
  if (isLoading)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Loading milestones...
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
        Failed to load milestones.
      </div>
    );

  if (filtered.length === 0)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400" />
          No milestones found for this project.
        </div>
      </div>
    );

  // ✅ Main Render
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Construction Milestones
        </h2>
      </div>

      <div className="space-y-4">
        {filtered.map((m: any, i: number) => (
          <div key={i} className="flex flex-col gap-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm">
                {m.stage}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {m.due || "N/A"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  Number(m.completion) === 100
                    ? "bg-green-600"
                    : "bg-blue-500"
                }`}
                style={{ width: `${m.completion}%` }}
              />
            </div>

            {/* Footer Info */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{m.completion}% complete</span>
              {Number(m.completion) === 100 ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              ) : (
                m.remarks && (
                  <span className="text-gray-400 italic">{m.remarks}</span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}