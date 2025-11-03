"use client";

import { Building2, CheckCircle2, Clock } from "lucide-react";

type Milestone = {
  stage: string;
  completion: number; // 0–100
  due: string;
};

export default function MilestoneBoard({ milestones }: { milestones?: Milestone[] }) {
  const list =
    milestones || [
      { stage: "Foundation", completion: 100, due: "2024-03-10" },
      { stage: "Structure", completion: 80, due: "2024-05-30" },
      { stage: "Plastering", completion: 40, due: "2024-07-10" },
      { stage: "Finishing", completion: 10, due: "2024-09-20" },
    ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Construction Milestones</h2>
      </div>

      <div className="space-y-4">
        {list.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm">{m.stage}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {m.due}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  m.completion === 100 ? "bg-green-600" : "bg-blue-500"
                }`}
                style={{ width: `${m.completion}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{m.completion}% complete</span>
              {m.completion === 100 && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}