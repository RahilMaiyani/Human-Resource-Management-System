import { X, Calendar, FileText, MessageSquare, Info, ArrowRight } from "lucide-react";

export default function LeaveDetailsModal({ leave, onClose }) {
  if (!leave) return null;

  const statusStyles = {
    approved: {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
    },
    rejected: {
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-100",
      badge: "bg-rose-100 text-rose-700 border-rose-200"
    },
    pending: {
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-100",
      badge: "bg-amber-100 text-amber-700 border-amber-200"
    }
  };

  const current = statusStyles[leave.status] || statusStyles.pending;

  // Simple date formatter to keep code clean
  const formatDate = (dateStr) => {
    return dateStr ? dateStr.slice(0, 10) : "";
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Leave Application Detail
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6">
          
          {/* USER PROFILE SECTION */}
          <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <img
              src={
                leave.userId?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.userId?.name)}&background=random`
              }
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              alt="Applicant"
              draggable="false"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">
                {leave.userId?.name}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {leave.userId?.email}
              </p>
            </div>
            <div className="ml-auto">
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${current.badge}`}>
                {leave.status}
              </span>
            </div>
          </div>

          {/* GRID DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* LEAVE TYPE */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Info className="w-3 h-3" /> Leave Type
              </p>
              <div className="h-11 flex items-center px-4 bg-slate-50/30 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 capitalize">
                {leave.type}
              </div>
            </div>

            {/* TOTAL DURATION - FIXED FOR ALIGNMENT */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Calendar className="w-3 h-3" /> Total Duration
              </p>
              <div className="h-11 flex items-center justify-between px-4 bg-slate-50/30 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 tabular-nums">
                <span>{formatDate(leave.fromDate)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <span>{formatDate(leave.toDate)}</span>
              </div>
            </div>
          </div>

          {/* REASON SECTION */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Leave</p>
            <div className="bg-slate-50/50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100 italic">
              "{leave.reason}"
            </div>
          </div>

          {/* ADMIN COMMENT */}
          {leave.adminComment && (
            <div className={`${current.bg} ${current.border} p-4 rounded-xl border shadow-sm`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2 ${current.text}`}>
                <MessageSquare className="w-3.5 h-3.5" />
                Administrative Feedback
              </p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {leave.adminComment}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 h-10 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}