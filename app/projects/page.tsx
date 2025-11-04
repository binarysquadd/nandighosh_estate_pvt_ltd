"use client";

export const runtime = "edge";

import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { useSheetsData } from "@/hooks/useSheetsData";

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useSheetsData("Projects");

  // 🔎 quick sanity check while we debug
  if (!isLoading && !error) {
    // This will show "true" when things are correct
    console.log("Projects is array:", Array.isArray(projects), projects?.length);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to home
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all your construction projects</p>
      </div>

      {isLoading && <div className="text-gray-500 text-sm">Loading projects from Google Sheets...</div>}
      {error && <div className="text-red-600 text-sm">Failed to fetch data from Sheets.</div>}

      {!isLoading && !error && projects?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {!isLoading && !error && projects?.length === 0 && (
        <div className="text-gray-400 text-sm italic">No projects found.</div>
      )}
    </div>
  );
}