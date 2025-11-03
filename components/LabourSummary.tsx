"use client";

import { Users, Clock, IndianRupee, CalendarDays } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = {
  projectId?: string;
};

export default function LabourSummary({ projectId }: Props) {
  // ✅ Fetch live data from Google Sheets “Labour” tab
  const { data: labourData, isLoading, error } = useSheetsData("Labour");

  // ✅ Find the specific project’s labour entry
  const projectLabour = labourData?.find(
    (l: any) => l.projectId === projectId
  ) || {
    totalWorkers: "0",
    activeShifts: "—",
    totalWages: "—",
    lastUpdated: "—",
  };

  // ✅ Handle loading / error states
  if (isLoading)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Loading labour summary...
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
        Failed to load labour summary.
      </div>
    );

  // ✅ Render the summary
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Labour Summary</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <p className="text-gray-500">Total Workers</p>
          <p className="text-gray-900 font-semibold flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-600" />{" "}
            {projectLabour.totalWorkers}
          </p>
        </div>

        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <p className="text-gray-500">Active Shifts</p>
          <p className="text-gray-900 font-semibold flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" />{" "}
            {projectLabour.activeShifts}
          </p>
        </div>

        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <p className="text-gray-500">Total Wages</p>
          <p className="text-gray-900 font-semibold flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green-600" />{" "}
            {projectLabour.totalWages}
          </p>
        </div>

        <div className="hover:bg-gray-50 p-3 rounded-lg transition">
          <p className="text-gray-500">Last Updated</p>
          <p className="text-gray-900 font-semibold flex items-center gap-1">
            <CalendarDays className="w-4 h-4 text-gray-400" />{" "}
            {projectLabour.lastUpdated}
          </p>
        </div>
      </div>
    </section>
  );
}