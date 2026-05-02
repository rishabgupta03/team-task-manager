import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
        <Search size={16} />
        <input placeholder="Search..." className="bg-transparent outline-none"/>
      </div>

      <div className="flex items-center gap-4">
        <Bell />
        <div className="w-8 h-8 rounded-full bg-blue-500"></div>
      </div>
    </div>
  );
}