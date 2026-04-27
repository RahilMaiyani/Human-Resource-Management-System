import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LeaveStatusChart({ leaves = [] }) {
  const counts = {
    approved: 0,
    pending: 0,
    rejected: 0
  };

  leaves.forEach((leave) => {
    if (counts[leave.status] !== undefined) {
      counts[leave.status] += 1;
    }
  });

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [counts.approved, counts.pending, counts.rejected],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };
//   console.log(counts);
//   console.log(chartData)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#e5e7eb",
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border h-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Leave Status</h2>
        <span className="text-xs text-gray-400">All requests</span>
      </div>

      <div className="flex-1 min-h-0">
        {leaves.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">No leave data available</p>
          </div>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}