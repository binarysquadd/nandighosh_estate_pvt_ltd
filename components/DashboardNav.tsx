"use client";

import { useEffect, useState } from "react";
import {
  Users2,
  Wrench,
  CreditCard,
  FileText,
  Wallet2,
  ScrollText,
  ChevronUp,
  Home,
} from "lucide-react";

const sections = [
  { id: "sales", label: "Sales", icon: <Users2 className="w-4 h-4" /> },
  { id: "labour", label: "Labour", icon: <Wrench className="w-4 h-4" /> },
  { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
  { id: "tax", label: "Tax", icon: <ScrollText className="w-4 h-4" /> },
  { id: "vendors", label: "Vendors", icon: <Wallet2 className="w-4 h-4" /> },
];

type Props = {
  projectName: string;
  projectLocation?: string;
};

export default function DashboardNav({ projectName, projectLocation }: Props) {
  const [active, setActive] = useState<string>("");

  // track section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { threshold: 0.25 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Sticky Navbar */}
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          bg-white/90 backdrop-blur-xl
          border-b border-gray-200
          shadow-sm
        "
      >
        <div className="flex items-center justify-between max-w-[1600px] mx-auto px-6 py-3">
          {/* Breadcrumb */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="cursor-pointer hover:text-blue-700">
                Projects
              </span>
              <span className="text-gray-400">/</span>
              <span className="font-semibold text-gray-900">
                {projectName || "Unnamed Project"}
              </span>
            </div>
            {projectLocation && (
              <span className="text-xs text-gray-500 ml-6 mt-0.5">
                {projectLocation}
              </span>
            )}
          </div>

          {/* Nav Buttons */}
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                  ${
                    active === s.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                  }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}

            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              title="Back to Top"
            >
              <ChevronUp className="w-4 h-4" />
              Top
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer to prevent overlap */}
      <div className="h-[68px]" />
    </>
  );
}
