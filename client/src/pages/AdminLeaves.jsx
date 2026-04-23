import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useActiveLeaves, useUpdateLeave } from "../hooks/useLeaves";
import { useState } from "react";

export default function AdminLeaves() {
  const navigate = useNavigate();
  const { data = [], isLoading } = useActiveLeaves();
  const update = useUpdateLeave();

  const [selectedReason, setSelectedReason] = useState(null);

  const badgeClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-350 mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Leave Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Active & pending leave requests only
            </p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="text-left p-4">Employee</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Dates</th>
                <th className="text-left p-4">Reason</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="p-6 text-gray-500" colSpan="6">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td className="p-6 text-gray-500" colSpan="6">
                    No active leave requests.
                  </td>
                </tr>
              ) : (
                data.map((leave) => (
                  <tr key={leave._id} className="border-t hover:bg-gray-50">

                    {/* USER */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {leave.userId?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {leave.userId?.email}
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="p-4 capitalize">{leave.type}</td>

                    {/* DATES */}
                    <td className="p-4 text-sm">
                      {leave.fromDate.slice(0, 10)} →{" "}
                      {leave.toDate.slice(0, 10)}
                    </td>

                    {/* REASON */}
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedReason(leave.reason)}
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        View
                      </button>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-4">
                      {leave.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              update.mutate({
                                id: leave._id,
                                status: "approved",
                              })
                            }
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              update.mutate({
                                id: leave._id,
                                status: "rejected",
                              })
                            }
                            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* REASON MODAL */}
        {selectedReason && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-100 shadow-lg">
              <h2 className="text-lg font-semibold mb-3">Leave Reason</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {selectedReason}
              </p>

              <button
                onClick={() => setSelectedReason(null)}
                className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}