import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useMyLeaves } from "../hooks/useLeaves";
import LeaveModal from "../components/LeaveModal";
import LeaveDetailsModal from "../components/LeaveDetailsModal";
import PageLoader from "../components/PageLoader";

export default function MyLeaves() {
  const { data = [], isLoading } = useMyLeaves();

  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const LEAVES_PER_PAGE = 6;

  // reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / LEAVES_PER_PAGE);

  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * LEAVES_PER_PAGE;
    return data.slice(start, start + LEAVES_PER_PAGE);
  }, [data, currentPage]);

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

        {/* APPLY MODAL */}
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
              {paginatedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-gray-500">
                    No leaves applied yet.
                  </td>
                </tr>
              ) : (
                paginatedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    onClick={() => setSelectedLeave(leave)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    {/* TYPE */}
                    <td className="p-4">
                      <div className="font-medium capitalize">
                        {leave.type}
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">
                        {leave.reason}
                      </div>

                      {leave.adminComment && (
                        <div className="text-xs text-indigo-500 mt-1 line-clamp-1">
                          Note: {leave.adminComment}
                        </div>
                      )}
                    </td>

                    {/* DATES */}
                    <td className="p-4 text-sm">
                      {leave.fromDate.slice(0, 10)} →{" "}
                      {leave.toDate.slice(0, 10)}
                    </td>

                    {/* STATUS */}
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

        {/* DETAILS MODAL */}
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />

      </div>
    </DashboardLayout>
  );
}