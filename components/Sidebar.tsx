"use client";

import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: <BarChart3 className="w-4 h-4" />,
      active: pathname === "/" || pathname.startsWith("/dashboard"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderKanban className="w-4 h-4" />,
      active: pathname.startsWith("/projects"),
    },
  ];

  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 select-none text-[13px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
          Nandighosh
        </h1>
        <p className="text-[11px] text-gray-500">Estate Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
            className={`
              group flex items-center gap-2 px-3 py-1.5 transition-colors
              ${
                link.active
                  ? "text-gray-900 bg-gray-100 border-l-2 border-blue-500 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <span
              className={`transition-colors ${
                link.active
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-700"
              }`}
            >
              {link.icon}
            </span>
            <span className="truncate">{link.name}</span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center text-white text-[11px] font-semibold uppercase">
            A
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              admin@nandighosh.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}