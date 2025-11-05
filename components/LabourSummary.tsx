"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users2,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Clock,
  IndianRupee,
  UserCheck,
  HardHat,
  Hammer,
  Building2,
  ClipboardList,
  UserCog,
  Percent,
  Timer,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Props = { projectId: string };

// -------------------------------------------------------------
// helpers
const normalizeKey = (k: string) =>
  k.trim().toLowerCase().replace(/\s+/g, "").replace(/[_-]/g, "");

const iconFor = (key: string) => {
  if (/date/i.test(key)) return <CalendarDays className="w-3.5 h-3.5 text-gray-500" />;
  if (/totalworkers?/i.test(key)) return <Users2 className="w-3.5 h-3.5 text-blue-600" />;
  if (/skilled/i.test(key)) return <Hammer className="w-3.5 h-3.5 text-yellow-600" />;
  if (/unskilled/i.test(key)) return <HardHat className="w-3.5 h-3.5 text-amber-700" />;
  if (/activeshifts?/i.test(key)) return <Clock className="w-3.5 h-3.5 text-orange-500" />;
  if (/supervis/i.test(key)) return <UserCheck className="w-3.5 h-3.5 text-indigo-500" />;
  if (/manager/i.test(key)) return <UserCog className="w-3.5 h-3.5 text-pink-600" />;
  if (/contract/i.test(key)) return <Building2 className="w-3.5 h-3.5 text-teal-600" />;
  if (/wage|cost|amount/i.test(key)) return <IndianRupee className="w-3.5 h-3.5 text-green-600" />;
  if (/attend/i.test(key)) return <Percent className="w-3.5 h-3.5 text-purple-500" />;
  if (/hour/i.test(key)) return <Timer className="w-3.5 h-3.5 text-yellow-600" />;
  if (/safe|violat/i.test(key)) return <ShieldCheck className="w-3.5 h-3.5 text-red-600" />;
  if (/worktype|zone/i.test(key)) return <Briefcase className="w-3.5 h-3.5 text-gray-600" />;
  if (/remark|comment/i.test(key)) return <ClipboardList className="w-3.5 h-3.5 text-gray-500" />;
  return <Users2 className="w-3.5 h-3.5 text-gray-400" />;
};

const formatVal = (v: any, key: string) => {
  if (!v) return "—";
  if (/date/i.test(key)) {
    const t = Date.parse(v);
    if (Number.isFinite(t))
      return new Date(t).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }
  if (/wage|amount|cost/i.test(key)) {
    const num = Number(String(v).replace(/[^0-9.]/g, ""));
    if (!isNaN(num))
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
  }
  return v;
};
// -------------------------------------------------------------

export default function LabourDashboard({ projectId }: Props) {
  const { data: sheetData, isLoading, error } = useSheetsData("Labour");
  const [collapsed, setCollapsed] = useState(true); // closed by default

  const rows = useMemo(() => {
    if (!sheetData || !projectId) return [] as any[];

    const pid = projectId.toString().trim().toLowerCase();

    // Normalize keys & filter by project ID
    return (sheetData as any[])
      .map((row) => {
        const n: any = {};
        for (const k of Object.keys(row)) n[normalizeKey(k)] = row[k];
        n.__raw = row;
        return n;
      })
      .filter(
        (r) =>
          r.projectid?.toString().trim().toLowerCase() === pid
      );
  }, [sheetData, projectId]);

  if (isLoading)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-gray-500">
        Loading labour data...
      </div>
    );

  if (error)
    return (
      <div className="bg-white border border-gray-200 p-4 text-sm text-red-500">
        Failed to load labour data.
      </div>
    );

  if (!rows.length)
    return (
      <section className="bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">
              Labour Details
            </h2>
          </div>
          <span className="text-xs text-gray-500">
            No labour records found for this project
          </span>
        </div>
      </section>
    );

  // Determine headers from sheet (exclude project id)
  const headers = Object.keys(rows[0].__raw).filter(
    (k) => !/project\s*id/i.test(k)
  );

  // Sort newest first
  rows.sort((a, b) => {
    const ad = a.__raw["Date"] || a.__raw["date"];
    const bd = b.__raw["Date"] || b.__raw["date"];
    const at = Date.parse(ad);
    const bt = Date.parse(bd);
    return Number.isFinite(bt) && Number.isFinite(at) ? bt - at : 0;
  });

  // quick metrics
  const totalWorkers = rows.reduce(
    (acc, r) => acc + (parseInt(r.totalworkers) || 0),
    0
  );
  const avgWorkers = Math.round(totalWorkers / rows.length);

  return (
    <section className="bg-white border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
          <Users2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            Labour Summary
          </h2>
        </div>

        <span className="text-xs text-gray-500 flex items-center gap-1">
          Avg: {avgWorkers || "—"} Workers / {rows.length} Records
        </span>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="labour-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3 text-xs font-medium">
              <div className="text-blue-600">
                Records: {rows.length}
              </div>
              <div className="text-green-600">
                Avg Workers: {avgWorkers || "—"}
              </div>
              <div className="text-gray-600">
                Latest:{" "}
                {formatVal(rows[0]?.__raw["Date"] || rows[0]?.__raw["date"], "Date")}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-700 align-middle table-fixed border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    {headers.map((key) => (
                      <th
                        key={key}
                        className="py-2 text-left font-semibold text-gray-700 uppercase tracking-wide text-[11px]"
                      >
                        <div className="flex items-center gap-1">
                          {iconFor(key)}
                          {key}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition"
                    >
                      {headers.map((key) => (
                        <td
                          key={key}
                          className="py-2 text-gray-700 whitespace-nowrap"
                        >
                          {formatVal(r.__raw[key], key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
