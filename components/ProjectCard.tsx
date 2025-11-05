"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, MapPin, Calendar } from "lucide-react";
import { Project } from "@/lib/dummy-data";

function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 ring-1 ring-green-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    case "Planning":
      return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-100";
  }
}

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number; // optional; pass in when mapping to stagger
}) {
  return (
    <Link href={`/projects/${project.id}`} passHref>
      <motion.div
        // simple fade/slide in with per-card delay
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={{ y: -2, scale: 1.012, transition: { duration: 0.18 } }}
        className={`
          group
          bg-white
          border border-gray-200/80
          hover:border-blue-300
          hover:bg-blue-50/30
          focus-visible:ring-1 focus-visible:ring-blue-400
          shadow-sm hover:shadow-md
          transition-all
          p-5 cursor-pointer select-none
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {project.location}
            </p>
          </div>
          <span className={`px-2 py-0.5 text-[11px] font-medium ${getStatusStyle(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="flex items-center gap-1">
              <LineChart className="w-3.5 h-3.5 text-blue-500" />
              Progress
            </span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div>
            <p className="text-gray-500">Units Sold</p>
            <p className="font-semibold text-gray-900 mt-0.5">
              {project.soldUnits}/{project.totalUnits}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-semibold text-gray-900 mt-0.5">{project.budget}</p>
          </div>

          <div>
            <p className="text-gray-500">Spent</p>
            <p className="font-semibold text-gray-900 mt-0.5">{project.spent}</p>
          </div>

          <div>
            <p className="text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              Completion
            </p>
            <p className="font-semibold text-gray-900 mt-0.5">{project.expectedCompletion}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}