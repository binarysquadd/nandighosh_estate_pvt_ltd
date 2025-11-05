"use client";

import { Building2, CheckCircle2, Clock3, AlertCircle, MinusCircle } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId?: string };

export default function MilestoneBoard({ projectId }: Props) {
  const { data: milestones, isLoading, error } = useSheetsData("Milestones");
  const filtered = milestones?.filter((m: any) => m.projectId === projectId) || [];

  const getStatus = (completion: number) => {
    if (completion >= 100)
      return { icon: CheckCircle2, color: "text-green-600", label: "Done" };
    if (completion === 0)
      return { icon: MinusCircle, color: "text-gray-400", label: "Not Started" };
    return { icon: Clock3, color: "text-blue-600", label: "In Progress" };
  };

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading milestones...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load milestones.
      </div>
    );

  if (filtered.length === 0)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-gray-400" />
        No milestones found for this project.
      </div>
    );

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Construction Milestones
          </h2>
        </div>
        <span className="text-xs text-gray-500">{filtered.length} stages</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-700 align-middle table-fixed">
          {/* prettier-ignore */}
          <colgroup><col style={{width:"38%"}}/><col style={{width:"46%"}}/><col style={{width:"16%"}}/></colgroup>

          <thead>
            <tr className="text-gray-500 font-medium border-b border-gray-100">
              <th className="py-2 text-left font-medium">Stage</th>
              <th className="py-2 text-left font-medium pr-3">Progress</th>
              <th className="py-2 text-right font-medium pr-1">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m: any, i: number) => {
              const completion = Number(m.completion) || 0;
              const status = getStatus(completion);

              return (
                <tr
                  key={i}
                  className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Stage name */}
                  <td className="py-2 font-medium text-gray-900 truncate">
                    {m.stage}
                  </td>

                  {/* Progress bar with fixed numeric width */}
                  <td className="py-2 text-gray-600 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[110px] text-gray-600">
                        {completion}%{" "}
                        <span className="text-gray-400">
                          {m.due ? `(${m.due})` : ""}
                        </span>
                      </div>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-sm overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${
                            completion >= 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2 pr-1 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 ${status.color} font-medium`}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}