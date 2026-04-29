import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useMyLeaves } from "../hooks/useLeaves";
import LeaveModal from "../components/LeaveModal";
import LeaveDetailsModal from "../components/LeaveDetailsModal";
import PageLoader from "../components/PageLoader";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare, 
  FileText,
  Clock
} from "lucide-react";

export default function MyLeaves() {
  const { data = [], isLoading } = useMyLeaves();

  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const LEAVES_PER_PAGE = 8; // Slightly increased for desktop view

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
      <div className="p-10 max-w-350 mx-auto space-y-8 bg-slate-50/30 min-h-screen">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Review history and submit new leave requests.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 h-11 px-5 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Apply Leave
          </button>
        </div>

        {/* APPLY MODAL */}
        <LeaveModal isOpen={open} onClose={() => setOpen(false)} />

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type & Reason</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm font-medium">No leave records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    onClick={() => setSelectedLeave(leave)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* TYPE & REASON */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 capitalize flex items-center gap-2">
                          {leave.type}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs font-medium">
                          {leave.reason}
                        </span>
                        
                        {leave.adminComment && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded">
                            <MessageSquare className="w-3 h-3" />
                            Reviewer Note: {leave.adminComment}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* DATES */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3 text-slate-700">
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">From</p>
                            <p className="text-sm font-semibold tabular-nums">{leave.fromDate.slice(0, 10)}</p>
                         </div>
                         <div className="h-px w-4 bg-slate-200" />
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">To</p>
                            <p className="text-sm font-semibold tabular-nums">{leave.toDate.slice(0, 10)}</p>
                         </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                          leave.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : leave.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {leave.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {leave.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-right">
                       <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => p - 1); }}
                  className="p-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage((p) => p + 1); }}
                  className="p-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
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