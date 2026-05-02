export default function Card({ title, value }) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-5 rounded-xl shadow-lg hover:scale-105 transition">
        <p>{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    );
  }