import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AttendanceChart({ data }) {
  const chartData = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        weekday: "short"
      })
    ),
    datasets: [
      {
        label: "Check-ins",
        data: data.map((d) => d.count),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border h-full">
      <h2 className="text-sm font-semibold mb-3">
        Last 7 Days Attendance
      </h2>

      <div className="h-64">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No attendance data available
          </p>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}