import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import { useCheckIn, useCheckOut } from "../hooks/useAttendance";
import { useMyLeaves } from "../hooks/useLeaves";
import { useAuth } from "../context/AuthContext"; 
import EmployeeProfileModal from "../components/EmployeeProfileModal";
import toast from "react-hot-toast";

export default function Employee() {
  const { user } = useAuth();
  const { data: leaves = [] } = useMyLeaves();
  const [openProfile, setOpenProfile] = useState(false);

  const [status, setStatus] = useState({
    message: "",
    type: ""
  });

  const getTimeString = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const checkInMutation = useCheckIn(
    () =>{
      toast.success("Cheked in Successfully");
      setStatus({
        message: `Checked in at ${getTimeString()}`,
        type: "success"
    })},
    (err) =>{
      toast.error(err.response?.data?.msg)
      setStatus({
        message: err.response?.data?.msg || "Error",
        type: "error"
      })}
  );

  const checkOutMutation = useCheckOut(
    () =>{
      toast.success("Cheked out Successfully");
      setStatus({
        message: `Checked out at ${getTimeString()}`,
        type: "success"
      })},
    (err) =>{
      toast.error(err.response?.data?.msg)
      setStatus({
        message: err.response?.data?.msg || "Error",
        type: "error"
      })}
  );

  const approvedLeaves = leaves.filter(l => l.status === "approved").length;
  const pendingLeaves = leaves.filter(l => l.status === "pending").length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Employee Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* PROFILE + ATTENDANCE */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* PROFILE CARD */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              
              <div className="w-14 h-14 rounded-full overflow-hidden border bg-white flex items-center justify-center">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=6366f1&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Department:</span> {user?.department}</p>
              <p><span className="font-medium">Role:</span> {user?.role}</p>
            </div>

            <button
              onClick={() => setOpenProfile(true)}
              className="mt-4 w-full h-10 rounded-lg border hover:bg-gray-50"
            >
              Edit Profile
            </button>
          </div>

          {/* ATTENDANCE CARD */}
          <div className="bg-white border rounded-xl p-5 shadow-sm col-span-2">
            <h2 className="text-lg font-semibold mb-4">Attendance</h2>

            <div className="flex gap-4">
              <button
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
                className={`px-5 h-11 rounded-lg text-white font-medium transition ${
                  checkInMutation.isPending
                    ? "bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {checkInMutation.isPending ? "Checking..." : "Check In"}
              </button>

              <button
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
                className={`px-5 h-11 rounded-lg text-white font-medium transition ${
                  checkOutMutation.isPending
                    ? "bg-red-300"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {checkOutMutation.isPending ? "Checking..." : "Check Out"}
              </button>
            </div>

            {status.message && (
              <p
                className={`mt-4 text-sm ${
                  status.type === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Approved Leaves</p>
            <h2 className="text-2xl font-bold mt-1">
              {approvedLeaves}
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending Leaves</p>
            <h2 className="text-2xl font-bold mt-1">
              {pendingLeaves}
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Leaves</p>
            <h2 className="text-2xl font-bold mt-1">
              {leaves.length}
            </h2>
          </div>
        </div>
        <EmployeeProfileModal
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
          user={user}
        />

      </div>
    </DashboardLayout>
  );
}