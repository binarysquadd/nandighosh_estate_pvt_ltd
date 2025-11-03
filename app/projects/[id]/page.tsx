"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LineChart, Clock, FileText } from "lucide-react";

import { useSheetsData } from "@/hooks/useSheetsData";

// Components
import ProjectOverview from "@/components/ProjectOverview";
import ClientBoard from "@/components/ClientBoard";
import TasksBoard from "@/components/TasksBoard";
import PaymentSection from "@/components/PaymentSection";
import DocumentsSection from "@/components/DocumentsSection";
import FinancialHealth from "@/components/FinancialHealth";
import MaterialTracker from "@/components/MaterialTracker";
import MilestoneBoard from "@/components/MilestoneBoard";
import SalesDashboard from "@/components/SalesDashboard";
import TaxSummary from "@/components/TaxSummary";
import AccessControl from "@/components/AccessControl";
import VendorPayments from "@/components/VendorPayments";
import LabourSummary from "@/components/LabourSummary";
import SiteUpdates from "@/components/SiteUpdates";

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Planning":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [projectId, setProjectId] = React.useState<string | null>(null);

  // ✅ Extract project ID safely
  React.useEffect(() => {
    (async () => {
      const { id } = await params;
      setProjectId(id);
    })();
  }, [params]);

  // ✅ Fetch projects data from Google Sheets
  const { data: projects, isLoading, error } = useSheetsData("Projects");

  if (!projectId)
    return (
      <div className="p-6 text-sm text-gray-500">Preparing project details...</div>
    );

  if (isLoading)
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading project data from Google Sheets...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-sm text-red-600">
        Error fetching project data from Google Sheets.
      </div>
    );

  // ✅ Find the matching project
  const project = projects.find((p: any) => p.id === projectId);
  if (!project) return notFound();

  return (
    <div className="relative p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* ========== HEADER ========== */}
      <header className="flex items-start justify-between border-b pb-4">
        <div>
          <Link
            href="/projects"
            className="text-sm text-blue-600 hover:underline block mb-1"
          >
            ← Back to Projects
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-500">{project.location}</p>

          {/* Snapshot KPIs */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <LineChart className="w-4 h-4 text-blue-500" />
              <strong>{project.progress || 0}%</strong> complete
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              Next milestone:{" "}
              <strong className="text-blue-600">
                {project.nextMilestone || "—"}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-green-500" />
              Budget: <strong>{project.budget || "—"}</strong>
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
            project.status || "Planning"
          )}`}
        >
          {project.status || "Planning"}
        </span>
      </header>

      {/* ========== MAIN CONTENT ========== */}

      {/* Overview */}
      <section id="overview" className="scroll-mt-20">
        <ProjectOverview project={project} />
      </section>

      {/* Financial Summary */}
      <section id="financial-health" className="scroll-mt-20">
        <FinancialHealth projectId={project.id} />
      </section>

      {/* Client Info */}
      <section id="client" className="scroll-mt-20">
        <ClientBoard project={project} />
      </section>

      {/* Material Tracker */}
      <section id="materials" className="scroll-mt-20">
        <MaterialTracker projectId={project.id} />
      </section>

      {/* Labour Summary */}
      <section id="labour" className="scroll-mt-20">
        <LabourSummary projectId={project.id} />
      </section>

      {/* Site Updates */}
      <section id="updates" className="scroll-mt-20">
        <SiteUpdates projectId={project.id} />
      </section>

      {/* Milestones */}
      <section id="milestones" className="scroll-mt-20">
        <MilestoneBoard projectId={project.id} />
      </section>

      {/* Sales */}
      <section id="sales" className="scroll-mt-20">
        <SalesDashboard projectId={project.id} />
      </section>

      {/* Tasks */}
      <section id="tasks" className="scroll-mt-20">
        <TasksBoard project={project} />
      </section>

      {/* Payments */}
      <section id="payments" className="scroll-mt-20">
        <PaymentSection projectId={project.id} />
      </section>

      {/* Documents */}
      <section id="documents" className="scroll-mt-20">
        <DocumentsSection projectId={project.id} />
      </section>

      {/* Tax */}
      <section id="tax" className="scroll-mt-20">
        <TaxSummary projectId={project.id} />
      </section>

      {/* Access Control */}
      <section id="access" className="scroll-mt-20">
        <AccessControl projectId={project.id} />
      </section>

      {/* Vendor Payments */}
      <section id="vendors" className="scroll-mt-20">
        <VendorPayments projectId={project.id} />
      </section>

      {/* Empty state */}
      {!project.pendingTasks?.length && (
        <div className="text-center py-12 text-gray-400 text-sm">
          <img
            src="/empty-state.svg"
            alt="No data"
            className="w-24 mx-auto mb-3 opacity-70"
          />
          Nothing to show yet — project setup in progress.
        </div>
      )}

      {/* Footer */}
      <footer className="text-xs text-gray-400 text-center pt-8 pb-4">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </footer>
    </div>
  );
}