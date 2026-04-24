import DashboardLayout from "../layouts/DashboardLayout";
import { useActiveLeaves, useUpdateLeave } from "../hooks/useLeaves";
import { useState } from "react";
import Button from "../components/ui/Button";

import DecisionModal from "../components/DecisionModal";
import LeaveDetailsModal from "../components/LeaveDetailsModal";

export default function AdminLeaves() {
  const { data = [], isLoading } = useActiveLeaves();
  const update = useUpdateLeave();

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decision, setDecision] = useState(null); // { id, type }

  const badgeClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-350 mx-auto space-y-6">

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-semibold">Leave Management</h1>
          <p className="text-sm text-gray-500">
            Active & pending leave requests
          </p>
        </div>

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
              ) : data.map((leave) => (
                <tr
                  key={leave._id}
                  onClick={() => setSelectedLeave(leave)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    <div>{leave.userId?.name}</div>
                    <div className="text-xs text-gray-400">
                      {leave.userId?.email}
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
                          onClick={() => setDecision({ id: leave._id, type: "approved" })}
                        >
                          Approve
                        </Button>

                        <Button
                        variant="danger"
                          onClick={() => setDecision({ id: leave._id, type: "rejected" })}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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