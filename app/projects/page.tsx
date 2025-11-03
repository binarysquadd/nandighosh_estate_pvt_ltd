import ProjectCard from '@/components/ProjectCard';
import { dummyProjects } from '@/lib/dummy-data';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <>
      
      <div className="p-6">
        <div className="mb-6">
                      <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 block">
            ← Back to home
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your construction projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}