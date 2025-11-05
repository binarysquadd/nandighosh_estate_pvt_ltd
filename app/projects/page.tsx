"use client";

import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import LoadingScreen from "@/components/LoadingScreen";
import { useSheetsData } from "@/hooks/useSheetsData";

export default function ProjectsPage() {
  const {
    data: projectsRaw,
    isLoading,
    error,
  } = useSheetsData("Projects");

  // Use a safe, normalized list
  const projects = Array.isArray(projectsRaw) ? projectsRaw : [];

  // Show your full-screen loader (no more text)
  if (isLoading) return <LoadingScreen />;

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
            ← Back to home
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your construction projects</p>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
          Failed to fetch data from database. Please retry in a moment.
        </div>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
            ← Back to home
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your construction projects</p>
        </div>

        <div className="text-gray-400 text-sm italic">No projects found.</div>
      </div>
    );
  }

  // Loaded state
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Back to home
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all your construction projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}