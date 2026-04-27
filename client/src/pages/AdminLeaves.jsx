import DashboardLayout from "../layouts/DashboardLayout";
import { useActiveLeaves, useUpdateLeave } from "../hooks/useLeaves";
import { useState, useMemo, useEffect } from "react";
import Button from "../components/ui/Button";
import { Navigate } from "react-router-dom";

import DecisionModal from "../components/DecisionModal";
import LeaveDetailsModal from "../components/LeaveDetailsModal";

export default function AdminLeaves() {
  const { data = [], isLoading } = useActiveLeaves();
  const update = useUpdateLeave();

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decision, setDecision] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const LEAVES_PER_PAGE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / LEAVES_PER_PAGE);

  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * LEAVES_PER_PAGE;
    return data.slice(start, start + LEAVES_PER_PAGE);
  }, [data, currentPage]);

  const badgeClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-350 mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-semibold">Leave Management</h1>
          <p className="text-sm text-gray-500">
            Active & pending leave requests
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6">Loading...</td>
                </tr>
              ) : paginatedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                paginatedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    onClick={() => setSelectedLeave(leave)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {console.log(leave.userId)}
                        <img
                          src={
                            leave.userId?.profilePic ||
                            `https://ui-avatars.com/api/?name=${leave.userId?.name}`
                          }
                          className="w-9 h-9 rounded-full object-cover border"
                        />

                        <div>
                          <div className="font-medium text-gray-900">
                            {leave.userId?.name}
                          </div>

                          <div className="text-xs text-gray-400">
                            {leave.userId?.email}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="p-4 capitalize">{leave.type}</td>

                    <td className="p-4 text-sm">
                      {leave.fromDate.slice(0, 10)} → {leave.toDate.slice(0, 10)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${badgeClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    
                    <td
                      className="p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {leave.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            onClick={() =>
                              setDecision({ id: leave._id, type: "approved" })
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() =>
                              setDecision({ id: leave._id, type: "rejected" })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Prev
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        <DecisionModal
          isOpen={!!decision}
          type={decision?.type}
          onClose={() => setDecision(null)}
          onSubmit={(comment) => {
            update.mutate({
              id: decision.id,
              status: decision.type,
              adminComment: comment
            });
            setDecision(null);
          }}
        />

        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />

      </div>
    </DashboardLayout>
  );
}