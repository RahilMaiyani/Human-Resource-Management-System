import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

export default function DepartmentLeaveChart({ leaves = [] }) {
  const grouped = {};

  leaves.forEach((l) => {
    const dept = l.userId?.department || "Unknown";
    grouped[dept] = (grouped[dept] || 0) + 1;
  });

  const data = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: "Leaves",
        data: Object.values(grouped),
        backgroundColor: "#6366f1"
      }
    ]
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border h-full">
      <h2 className="text-sm font-semibold mb-4">
        Department Leaves
      </h2>

      {leaves.length === 0 ? (
        <p className="text-gray-400 text-sm">No data</p>
      ) : (
        <div className="h-64">
          <Bar data={data} />
        </div>
      )}
    </div>
  );
}