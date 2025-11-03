"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, Trash2 } from "lucide-react";
import { useSheetsData } from "@/hooks/useSheetsData";

type Member = {
  id: string;
  projectId: string;
  name: string;
  role: "Admin" | "Engineer" | "Accountant" | "Viewer";
  email: string;
};

export default function AccessControl({ projectId }: { projectId: string }) {
  // ✅ Fetch from the real Access sheet
  const { data: allMembers, isLoading, error } = useSheetsData("Access");
  const [localMembers, setLocalMembers] = useState<Member[]>([]);

  // ✅ Filter only for this project
  const sheetMembers =
    allMembers?.filter((m: any) => m.projectId === projectId) || [];

  // ✅ Merge Sheet + locally added members
  const members = [...sheetMembers, ...localMembers];

  const addMember = () => {
    const name = window.prompt("Enter name:");
    const email = window.prompt("Enter email:");
    const role = (window.prompt(
      "Role (Admin/Engineer/Accountant/Viewer):"
    ) as Member["role"]) || "Viewer";

    if (!name || !email) return;
    setLocalMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), projectId, name, email, role },
    ]);
  };

  const removeMember = (id: string) =>
    setLocalMembers((prev) => prev.filter((m) => m.id !== id));

  if (isLoading)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Loading access list...
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-red-500">
        Failed to load access data.
      </div>
    );

  if (members.length === 0)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        No access entries found for this project.
      </div>
    );

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Stakeholder Access Control
          </h2>
        </div>
        <button
          onClick={addMember}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2 font-medium">{m.name}</td>
                <td className="px-3 py-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      m.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : m.role === "Engineer"
                        ? "bg-green-100 text-green-700"
                        : m.role === "Accountant"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="px-3 py-2">{m.email}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}