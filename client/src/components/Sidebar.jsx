import { LayoutDashboard, Folder, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  return (
    <div className="w-64 bg-white shadow-xl p-6 border-r">
      <h1 className="text-xl font-bold mb-8 text-blue-600">TaskFlow</h1>

      <div className="space-y-4">
        <button onClick={() => nav("/projects")} className="flex gap-2 hover:text-blue-600">
          <Folder size={18}/> Projects
        </button>

        <button className="flex gap-2 hover:text-blue-600">
          <LayoutDashboard size={18}/> Dashboard
        </button>

        <button className="flex gap-2 hover:text-blue-600">
          <Users size={18}/> Team
        </button>
      </div>
    </div>
  );
}