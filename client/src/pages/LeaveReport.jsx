import DashboardLayout from "../layouts/DashboardLayout";
import { useAllLeaves } from "../hooks/useLeaves";
import { useUsers } from "../hooks/useUsers";
import { useState, useMemo, useEffect } from "react";
import LeaveDetailsModal from "../components/LeaveDetailsModal";
import Button from "../components/ui/Button";

export default function LeaveReports() {
  const { data: leaves = [], isLoading } = useAllLeaves();
  const { data: users = [] } = useUsers();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState("all");
  const [employee, setEmployee] = useState("all");

  const [selectedLeave, setSelectedLeave] = useState(null);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const LEAVES_PER_PAGE = 8;

  // FILTER
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const name = leave.userId?.name?.toLowerCase() || "";
      const email = leave.userId?.email?.toLowerCase() || "";
      const type = leave.type?.toLowerCase() || "";
      const reason = leave.reason?.toLowerCase() || "";
      const comment = leave.adminComment?.toLowerCase() || "";

      const searchMatch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        type.includes(search.toLowerCase()) ||
        reason.includes(search.toLowerCase()) ||
        comment.includes(search.toLowerCase());

      const statusMatch =
        status === "all" || leave.status === status;

      const employeeMatch =
        employee === "all" || leave.userId?._id === employee;

      const leaveMonth = new Date(leave.fromDate).getMonth();

      const monthMatch =
        month === "all" || leaveMonth === parseInt(month);

      return searchMatch && statusMatch && employeeMatch && monthMatch;
    });
  }, [leaves, search, status, month, employee]);

  // ✅ RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, month, employee]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredLeaves.length / LEAVES_PER_PAGE);

  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * LEAVES_PER_PAGE;
    return filteredLeaves.slice(start, start + LEAVES_PER_PAGE);
  }, [filteredLeaves, currentPage]);

  const handleReset = () => {
    setSearch("");
    setMonth("all");
    setStatus("all");
    setEmployee("all");
  };

  return (
    <DashboardLayout>
      <div className="max-w-350 mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Leave Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analyze and explore all leave records
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-5 gap-7">
          <input
            type="text"
            placeholder="Search name, email, type, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-3 border rounded-lg"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 px-3 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 px-3 border rounded-lg"
          >
            <option value="all">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", {
                  month: "long"
                })}
              </option>
            ))}
          </select>

          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="h-10 px-3 border rounded-lg"
          >
            <option value="all">All Employees</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <Button onClick={handleReset} variant="danger">
            Clear
          </Button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="text-left">Type</th>
                <th className="text-left">Dates</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginatedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-gray-500">
                    No data found.
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
                    <td className="capitalize">{leave.type}</td>

                    <td>
                      {leave.fromDate.slice(0, 10)} →{" "}
                      {leave.toDate.slice(0, 10)}
                    </td>

                    <td>
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

          {/* PAGINATION CONTROLS */}
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