import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/projects", {
      headers: { Authorization: "Bearer " + token }
    });
    setProjects(res.data);
  };

  const createProject = async () => {
    await axios.post(
      "http://localhost:5000/api/projects",
      { name },
      { headers: { Authorization: "Bearer " + token } }
    );
    setName("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <div className="w-60 h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Projects</h2>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 bg-gray-100">
        
        {/* Create Project */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <input
            className="border p-2 mr-2"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={createProject}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/project/${p._id}`)}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg"
            >
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-500">
                Members: {p.members.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}