import Link from 'next/link';
import { Project } from '@/lib/dummy-data';

function getStatusColor(status: string) {
  switch(status) {
    case 'Completed': return 'bg-green-100 text-green-700';
    case 'In Progress': return 'bg-blue-100 text-blue-700';
    case 'Planning': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/projects/${project.id}`}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition p-5 block"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{project.location}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 gap-3 text-xs">
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
          <p className="text-gray-500">Completion</p>
          <p className="font-semibold text-gray-900 mt-0.5">{project.expectedCompletion}</p>
        </div>
      </div>
    </Link>
  );
}