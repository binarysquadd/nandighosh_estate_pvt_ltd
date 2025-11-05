"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3, FolderKanban, House, ActivitySquare, UserSquare2, ListChecks, Boxes, Flag,
  Users2, Wrench, CreditCard, FileText, ScrollText, Wallet2, ImageIcon, ShieldCheck, ChevronUp,
} from "lucide-react";

/* ---------- Helpers ---------- */
import type { ReactElement } from "react";

type Sec = { id: string; name: string; icon: ReactElement };


const PROJECT_SECTIONS: Sec[] = [
  { id: "overview", name: "Overview", icon: <House className="w-4 h-4" /> },
  { id: "financial-health", name: "Financial Summary", icon: <ActivitySquare className="w-4 h-4" /> },
  { id: "client", name: "Client", icon: <UserSquare2 className="w-4 h-4" /> },
  { id: "tasks", name: "Tasks", icon: <ListChecks className="w-4 h-4" /> },
  { id: "materials", name: "Materials", icon: <Boxes className="w-4 h-4" /> },
  { id: "milestones", name: "Milestones", icon: <Flag className="w-4 h-4" /> },
  { id: "sales", name: "Sales", icon: <Users2 className="w-4 h-4" /> },
  { id: "labour", name: "Labour", icon: <Wrench className="w-4 h-4" /> },
  { id: "payments", name: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { id: "documents", name: "Documents", icon: <FileText className="w-4 h-4" /> },
  { id: "tax", name: "Tax", icon: <ScrollText className="w-4 h-4" /> },
  { id: "vendors", name: "Vendor Payments", icon: <Wallet2 className="w-4 h-4" /> },
  { id: "updates", name: "Site Updates", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "access", name: "Access Control", icon: <ShieldCheck className="w-4 h-4" /> },
];

const GLOBAL_LINKS = (pathname: string) => ([
  { name: "Dashboard", href: "/", icon: <BarChart3 className="w-4 h-4" />, active: pathname === "/" || pathname.startsWith("/dashboard") },
  { name: "Projects", href: "/projects", icon: <FolderKanban className="w-4 h-4" />, active: pathname.startsWith("/projects") },
]);

/* ---------- Component ---------- */

export default function Sidebar() {
  const pathname = usePathname();
  const inProject = pathname.startsWith("/projects/");
  const projectName = useMemo(
    () => (inProject ? decodeURIComponent(pathname.split("/projects/")[1] || "").replace(/-/g, " ") : ""),
    [pathname, inProject]
  );

  const mainLinks = GLOBAL_LINKS(pathname);

  // Refs & state for graph
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [activeId, setActiveId] = useState<string>(PROJECT_SECTIONS[0].id);
  const [progressH, setProgressH] = useState<number>(0);
  const clickLockRef = useRef<number>(0); // until timestamp when we ignore scroll updates

  // Cache DOM for content sections
  const contentElsRef = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    PROJECT_SECTIONS.forEach(s => {
      contentElsRef.current[s.id] = document.getElementById(s.id) as HTMLElement | null;
    });
  }, []);

  // Recompute progress continuously, but with stable section detection
  useEffect(() => {
    let raf = 0;

    const recompute = () => {
      const now = performance.now();

      // If user just clicked, hold the active highlight briefly (prevents jumpiness)
      if (now < clickLockRef.current) {
        updateProgressLine();
        raf = requestAnimationFrame(recompute);
        return;
      }

      // Choose the section whose top is closest to a viewport anchor (≈ 28% from top)
      const anchorY = window.innerHeight * 0.28;
      let bestId = activeId;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const sec of PROJECT_SECTIONS) {
        const el = contentElsRef.current[sec.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - anchorY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = sec.id;
        }
      }

      if (bestId !== activeId) setActiveId(bestId);

      updateProgressLine();
      raf = requestAnimationFrame(recompute);
    };

    const updateProgressLine = () => {
      const cont = containerRef.current;
      if (!cont) return;

      // Build node centers (relative to container top)
      const contTop = cont.getBoundingClientRect().top + window.scrollY;
      const centers: number[] = PROJECT_SECTIONS.map(s => {
        const li = itemRefs.current[s.id];
        if (!li) return 0;
        const r = li.getBoundingClientRect();
        return r.top + window.scrollY - contTop + r.height / 2;
      });

      // Interpolate between current and next section based on content scroll
      const idx = PROJECT_SECTIONS.findIndex(s => s.id === activeId);
      if (idx < 0) return;

      // Clamp progress: 0 .. last center
      const lastCenter = centers[centers.length - 1] ?? 0;

      const currEl = contentElsRef.current[PROJECT_SECTIONS[idx].id];
      const nextEl = contentElsRef.current[PROJECT_SECTIONS[Math.min(idx + 1, PROJECT_SECTIONS.length - 1)].id];

      let frac = 0;
      if (currEl && nextEl) {
        const aTop = currEl.getBoundingClientRect().top;
        const bTop = nextEl.getBoundingClientRect().top;
        const span = Math.max(1, bTop - aTop);
        frac = Math.min(1, Math.max(0, (window.innerHeight * 0.28 - aTop) / span));
      }

      const currCenter = centers[idx] ?? 0;
      const nextCenter = centers[Math.min(idx + 1, centers.length - 1)] ?? currCenter;
      const height = currCenter + (nextCenter - currCenter) * frac;

      setProgressH(Math.min(Math.max(0, height), lastCenter));
    };

    raf = requestAnimationFrame(recompute);
    const onResize = () => updateProgressLine();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
     
  }, [activeId]);

  // Clicking a section: set lock & smooth-scroll
  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveId(id);
      clickLockRef.current = performance.now() + 500; // 0.5s lock to avoid bounce
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 select-none text-[13px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-sm font-semibold text-gray-900 tracking-tight">Nandighosh</h1>
        <p className="text-[11px] text-gray-500">Estate Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {/* Global */}
        <div className="space-y-0.5">
          {mainLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${link.active
                  ? "text-gray-900 bg-gray-100 border-l-2 border-blue-500 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className={link.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-700"}>
                {link.icon}
              </span>
              <span className="truncate">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Project Sections */}
        {inProject && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-800 truncate">{projectName || "Project"}</p>
              <p className="text-[11px] text-gray-500">Project Sections</p>
            </div>

            <div className="relative pl-6" ref={containerRef}>
              {/* Base spine */}
              <div className="absolute left-[10px] top-0 bottom-0 w-px bg-gray-200" />
              {/* Blue progress — smoothly interpolated, never overshoots */}
              <div
                className="absolute left-[10px] top-0 w-px bg-blue-500 transition-[height] duration-120 ease-linear"
                style={{ height: `${progressH}px` }}
              />

              <ul className="space-y-0.5">
                {PROJECT_SECTIONS.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <li
                      key={s.id}
                      ref={(el) => {
                        itemRefs.current[s.id] = el;
                      }}

                      className="relative"
                    >
                      {/* Node */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all
                          ${isActive ? "w-2.5 h-2.5 bg-blue-600 ring-4 ring-blue-100" : "w-2 h-2 bg-gray-300"}
                        `}
                      />
                      <button
                        onClick={() => goTo(s.id)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left transition
                          ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"}
                        `}
                      >
                        <span className={isActive ? "text-blue-600" : "text-gray-400"}>{s.icon}</span>
                        <span>{s.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Pretty Back to Top */}
              <button
                onClick={() => {
                  clickLockRef.current = performance.now() + 400;
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-3 -ml-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 transition shadow-sm"
                title="Back to top"
              >
                <ChevronUp className="w-4 h-4" />
                <span className="text-[12px] font-medium">Top</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center text-white text-[11px] font-semibold uppercase rounded-md">
            A
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-[10px] text-gray-500 truncate">admin@nandighosh.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
