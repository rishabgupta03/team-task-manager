import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProjectDashboard() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [userId, setUserId] = useState("");

  // ================= FETCH =================
  const fetchProject = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/projects/${id}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    setProject(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/tasks/${id}`,
      { headers: { Authorization: "Bearer " + token } }
    );
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUsers();
  }, []);

  // ================= ACTIONS =================
  const createTask = async () => {
    if (!title || !assignedTo) return alert("Fill all fields");

    await axios.post(
      "http://localhost:5000/api/tasks",
      {
        title,
        dueDate,
        projectId: id,
        assignedTo
      },
      { headers: { Authorization: "Bearer " + token } }
    );

    setTitle("");
    setDueDate("");
    setAssignedTo("");
    fetchTasks();
  };

  const markComplete = async (taskId) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      { status: "completed" },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
  };

  const addMember = async () => {
    await axios.post(
      `http://localhost:5000/api/projects/${id}/add-member`,
      { userId },
      { headers: { Authorization: "Bearer " + token } }
    );
    setUserId("");
    fetchProject();
  };

  if (!project) return <p className="p-6">Loading...</p>;

  // ================= STATS =================
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status !== "completed").length;
  const overdue = tasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex min-h-screen">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Project</h2>
        <p className="text-lg font-semibold">{project.name}</p>

        <div className="mt-6">
          <p className="text-gray-400 mb-2">Members</p>
          {project.members?.map((m) => (
            <p key={m._id} className="text-sm">{m.name}</p>
          ))}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-6 bg-gray-100">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Total" value={total} />
          <StatCard title="Completed" value={completed} />
          <StatCard title="Pending" value={pending} />
          <StatCard title="Overdue" value={overdue} />
        </div>

        {/* ================= PROGRESS BAR ================= */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <p className="mb-2 font-semibold">Progress</p>
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-green-500 h-4 rounded text-xs text-white text-center"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        </div>

        {/* ================= ADD MEMBER ================= */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-2">Add Member</h2>

          <select
            className="border p-2 mr-2"
            onChange={(e) => setUserId(e.target.value)}
          >
            <option>Select user</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>

          <button
            onClick={addMember}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* ================= CREATE TASK ================= */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-2">Create Task</h2>

          <input
            className="border p-2 mr-2"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 mr-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            className="border p-2 mr-2"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option>Select user</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            onClick={createTask}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        {/* ================= TASK LIST ================= */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Tasks</h2>

          {tasks.map((task) => {
            const isOverdue =
              new Date(task.dueDate) < new Date() &&
              task.status !== "completed";

            return (
              <div
                key={task._id}
                className={`p-3 mb-2 rounded-lg shadow flex justify-between items-center 
                ${isOverdue ? "bg-red-100" : "bg-gray-50"}`}
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    Assigned: {task.assignedTo?.name}
                  </p>
                  <p className="text-xs">
                    Due: {new Date(task.dueDate).toDateString()}
                  </p>
                </div>

                <div>
                  {task.status === "completed" ? (
                    <span className="text-green-600 font-semibold">
                      Done
                    </span>
                  ) : (
                    <button
                      onClick={() => markComplete(task._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ================= STAT CARD =================
function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow text-center">
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}