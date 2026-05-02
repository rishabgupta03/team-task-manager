import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: "Bearer " + token },
    });
    setTasks(res.data);
  };

  const createTask = async () => {
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, dueDate },
      { headers: { Authorization: "Bearer " + token } }
    );
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  const markComplete = async (id) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { status: "completed" },
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 📊 Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status !== "completed").length;
  const overdue = tasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 📊 STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total" value={total} />
        <Card title="Completed" value={completed} />
        <Card title="Pending" value={pending} />
        <Card title="Overdue" value={overdue} />
      </div>

      {/* ➕ CREATE TASK */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-3">Create Task</h2>

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

        <button
          onClick={createTask}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 📋 TASK LIST */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-3">Your Tasks</h2>

        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toDateString()}
              </p>
            </div>

            <div>
              {task.status === "completed" ? (
                <span className="text-green-600 font-semibold">
                  Completed
                </span>
              ) : (
                <button
                  onClick={() => markComplete(task._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Mark Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 📦 Card Component
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}



