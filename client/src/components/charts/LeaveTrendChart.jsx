import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function toDateKey(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function isWeekend(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  return day === 0 || day === 6;
}

export default function LeaveTrendChart({ leaves = [] }) {
  const approvedLeaves = leaves.filter((leave) => leave.status === "approved");

  const today = new Date();
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const grouped = {};

  approvedLeaves.forEach((leave) => {
    const key = toDateKey(leave.fromDate);
    if (!key) return;
    grouped[key] = (grouped[key] || 0) + 1;
  });

  const chartData = {
    labels: last7Days.map((date) =>
      new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short"
      })
    ),
    datasets: [
      {
        label: "Approved Leaves",
        data: last7Days.map((date) => grouped[date] || 0),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "line"
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
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#6b7280"
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6"
        },
        ticks: {
          stepSize: 1,
          color: "#6b7280"
        }
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Approved Leave Trend
        </h2>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="flex-1 min-h-0">
        {approvedLeaves.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">
              No approved leave data available
            </p>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}