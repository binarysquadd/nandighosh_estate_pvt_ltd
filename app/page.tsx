"use client";

import { useSheetsData } from "@/hooks/useSheetsData";
import LoadingScreen from "@/components/LoadingScreen";

export default function DashboardPage() {
  const { data: projectsRaw, isLoading, error } = useSheetsData("Projects");
  const projects = Array.isArray(projectsRaw) ? projectsRaw : [];

  // 🌀 Show animated loader instead of text
  if (isLoading) return <LoadingScreen />;

  // 🔴 Error state
  if (error)
    return (
      <div className="p-6 text-sm text-red-500">
        Failed to load data from Google Sheets.
      </div>
    );

  // ⚪️ Empty state
  if (!projects.length)
    return (
      <div className="p-6 text-sm text-gray-500">
        No projects found in the sheet.
      </div>
    );

  // ✅ Compute analytics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === "In Progress").length;
  const completedProjects = projects.filter((p: any) => p.status === "Completed").length;

  const totalBudget = projects.reduce((sum: number, p: any) => {
    const val = parseFloat((p.budget || "0").replace(/[₹\s,Cr]/g, "")) || 0;
    return sum + val;
  }, 0);

  const totalSpent = projects.reduce((sum: number, p: any) => {
    const val = parseFloat((p.spent || "0").replace(/[₹\s,Cr]/g, "")) || 0;
    return sum + val;
  }, 0);

  const totalUnits = projects.reduce((sum: number, p: any) => sum + (Number(p.totalUnits) || 0), 0);
  const soldUnits = projects.reduce((sum: number, p: any) => sum + (Number(p.soldUnits) || 0), 0);

  const recentUpdates = projects
    .flatMap((p: any) =>
      (p.recentUpdates || []).map((u: any) => ({
        ...u,
        projectName: p.name,
      }))
    )
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ✅ UI Rendering
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here’s what’s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Active Projects</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            {activeProjects}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {completedProjects}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Units Sold</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {soldUnits}/{totalUnits}
          </p>
        </div>
      </div>

      {/* Budget Overview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Budget Overview</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-xl font-semibold text-gray-900">
                ₹{totalBudget.toFixed(1)} Cr
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-semibold text-gray-900">
                ₹{totalSpent.toFixed(1)} Cr
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-xl font-semibold text-gray-900">
                ₹{(totalBudget - totalSpent).toFixed(1)} Cr
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentUpdates.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No recent updates found.
              </p>
            ) : (
              recentUpdates.map((update: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="text-gray-900 font-medium">{update.projectName}</p>
                  <p className="text-gray-600">{update.update}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{update.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}