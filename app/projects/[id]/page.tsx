import { dummyProjects } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Clock,
  FileText,
  ChevronDown,
} from "lucide-react";

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = dummyProjects.find((p) => p.id === id);
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

          <h1 className="text-2xl font-semibold text-gray-900">
            {project.name}
          </h1>
          <p className="text-sm text-gray-500">{project.location}</p>

          {/* Snapshot KPIs */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <LineChart className="w-4 h-4 text-blue-500" />
              <strong>{project.progress}%</strong> complete
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              Next milestone:{" "}
              <strong className="text-blue-600">
                {project.nextMilestone}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-green-500" />
              Budget: <strong>{project.budget}</strong>
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </header>

      {/* ========== MAIN CONTENT ========== */}

      {/* 1️⃣ Project Overview */}
      <section id="overview" className="scroll-mt-20">
        <ProjectOverview project={project} />
      </section>

      {/* 2️⃣ Financial Health */}
      <section id="financial-health" className="scroll-mt-20">
        <FinancialHealth />
      </section>

      {/* 3️⃣ Client Information */}
      <section id="client" className="scroll-mt-20">
        <ClientBoard project={project} />
      </section>

      {/* 4️⃣ Material Procurement */}
      <section id="materials" className="scroll-mt-20">
        <MaterialTracker />
      </section>

      {/* LabourSummary */}
      <section id="materials" className="scroll-mt-20">
        <LabourSummary />
      </section>

      {/* SiteUpdates */}
      <section id="materials" className="scroll-mt-20">
        <SiteUpdates />
      </section>

      {/* MilestoneBoard */}
      <section id="materials" className="scroll-mt-20">
        <MilestoneBoard />
      </section>

      {/* 💰 Sales */}
      <section id="sales" className="scroll-mt-20">
        <SalesDashboard />
      </section>

      {/* 5️⃣ Tasks / Approvals */}
      <section id="tasks" className="scroll-mt-20">
        <TasksBoard project={project} />
      </section>

      {/* 6️⃣ Payment Summary */}
      <section id="payments" className="scroll-mt-20">
        <PaymentSection />
      </section>

      {/* 7️⃣ Documents & Compliance */}
      <section id="documents" className="scroll-mt-20">
        <DocumentsSection />
      </section>

      {/* 7️⃣ TaxSummary */}
      <section id="documents" className="scroll-mt-20">
        <TaxSummary />
      </section>

      {/* 7️⃣ AccessControl */}
      <section id="documents" className="scroll-mt-20">
        <AccessControl />
      </section>

      {/* Empty state if no data */}
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

      {/* Floating Section Nav */}
      {/* <nav className="hidden md:block fixed bottom-6 right-6 bg-white border border-gray-200 shadow-md rounded-xl p-3 w-44 text-sm">
        <p className="text-gray-500 font-medium mb-2 flex items-center gap-1">
          Jump to <ChevronDown className="w-3 h-3" />
        </p>
        <ul className="space-y-1 text-gray-700">
          <li>
            <a
              href="#overview"
              className="block hover:text-blue-600 transition-colors"
            >
              Overview
            </a>
          </li>
          <li>
            <a
              href="#financial-health"
              className="block hover:text-blue-600 transition-colors"
            >
              Financial Health
            </a>
          </li>
          <li>
            <a
              href="#client"
              className="block hover:text-blue-600 transition-colors"
            >
              Client
            </a>
          </li>
          <li>
            <a
              href="#materials"
              className="block hover:text-blue-600 transition-colors"
            >
              Materials
            </a>
          </li>
          <li>
            <a
              href="#tasks"
              className="block hover:text-blue-600 transition-colors"
            >
              Tasks
            </a>
          </li>
          <li>
            <a
              href="#payments"
              className="block hover:text-blue-600 transition-colors"
            >
              Payments
            </a>
          </li>
          <li>
            <a
              href="#documents"
              className="block hover:text-blue-600 transition-colors"
            >
              Documents
            </a>
          </li>

          <li><a href="#milestones" className="block hover:text-blue-600 transition-colors">Milestones</a></li>
          <li><a href="#sales" className="block hover:text-blue-600 transition-colors">Sales</a></li>
        </ul>
      </nav> */}
    </div>
  );
}