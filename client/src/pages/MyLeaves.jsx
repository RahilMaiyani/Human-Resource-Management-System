import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useMyLeaves } from "../hooks/useLeaves";
import LeaveModal from "../components/LeaveModal";
import PageLoader from "../components/PageLoader";

export default function MyLeaves() {
  const { data = [], isLoading } = useMyLeaves();
  const [open, setOpen] = useState(false);

  if (isLoading) return <PageLoader />;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-xl border p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">My Leaves</h1>
            <p className="text-sm text-gray-500">
              View and manage your leave requests
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            + Apply Leave
          </button>
        </div>

        {/* MODAL */}
        <LeaveModal isOpen={open} onClose={() => setOpen(false)} />

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-gray-500">
                    No leaves applied yet.
                  </td>
                </tr>
              ) : (
                data.map((leave) => (
                  <tr key={leave._id} className="border-t">
                    <td className="p-4">
                      <div className="font-medium capitalize">
                        {leave.type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {leave.reason}
                      </div>
                    </td>

                    <td className="p-4 text-sm">
                      {leave.fromDate.slice(0, 10)} →{" "}
                      {leave.toDate.slice(0, 10)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}