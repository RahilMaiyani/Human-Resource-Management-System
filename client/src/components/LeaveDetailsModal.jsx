import Button from "./ui/Button";
export default function LeaveDetailsModal({ leave, onClose }) {
  if (!leave) return null;

  const statusStyles = {
    approved: {
      text: "text-green-700",
      bg: "bg-green-50",
      badge: "bg-green-100 text-green-700"
    },
    rejected: {
      text: "text-red-700",
      bg: "bg-red-50",
      badge: "bg-red-100 text-red-700"
    },
    pending: {
      text: "text-amber-700",
      bg: "bg-amber-50",
      badge: "bg-amber-100 text-amber-700"
    }
  };

  const current = statusStyles[leave.status] || statusStyles.pending;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-130 max-w-full rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Leave Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* USER */}
          <div className="flex items-center gap-3">
            <img
              src={
                leave.userId?.profilePic ||
                `https://ui-avatars.com/api/?name=${leave.userId?.name}`
              }
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-medium text-gray-800">
                {leave.userId?.name}
              </p>
              <p className="text-xs text-gray-400">
                {leave.userId?.email}
              </p>
            </div>
          </div>

          {/* STATUS BADGE */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${current.badge}`}
            >
              {leave.status}
            </span>
          </div>

          {/* GRID DETAILS */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="font-medium capitalize text-gray-800">
                {leave.type}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="font-medium text-gray-800">
                {leave.fromDate.slice(0, 10)} → {leave.toDate.slice(0, 10)}
              </p>
            </div>

          </div>

          {/* REASON */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Reason</p>
            <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm whitespace-pre-wrap">
              {leave.reason}
            </div>
          </div>

          {/* ADMIN COMMENT */}
          {leave.adminComment && (
            <div className={`${current.bg} p-4 rounded-lg border`}>
              <p className={`text-sm font-medium mb-1 ${current.text}`}>
                Admin Note
              </p>

              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {leave.adminComment}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}