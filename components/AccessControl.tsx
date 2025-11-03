"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, Trash2 } from "lucide-react";

type Member = { id: string; name: string; role: "Admin" | "Engineer" | "Accountant" | "Viewer"; email: string };

export default function AccessControl() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "A. Mohanty", role: "Admin", email: "admin@nandighosh.com" },
    { id: "2", name: "B. Panda", role: "Engineer", email: "engineer@site.com" },
  ]);

  const addMember = () => {
    const name = window.prompt("Enter name:");
    const email = window.prompt("Enter email:");
    const role = window.prompt("Role (Admin/Engineer/Accountant/Viewer):") as Member["role"];
    if (!name || !email) return;
    setMembers([...members, { id: Date.now().toString(), name, email, role: role || "Viewer" }]);
  };

  const removeMember = (id: string) => setMembers(members.filter((m) => m.id !== id));

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Stakeholder Access Control</h2>
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
              <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50 transition">
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