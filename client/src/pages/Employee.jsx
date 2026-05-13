import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import {
  useCheckIn,
  useCheckOut,
  useTodayAttendance
} from "../hooks/useAttendance";
import { useMyLeaves } from "../hooks/useLeaves";
import { useAuth } from "../context/AuthContext";
import EmployeeProfileModal from "../components/EmployeeProfileModal";
import ConfirmModal from "../components/ConfirmModal";
import AnnouncementFeed from "../components/AnnouncementFeed";
import toast from "react-hot-toast";
import { useTitle } from "../hooks/useTitle";
import {
  Clock,
  CheckCircle,
  LogOut,
  LogIn,
  Briefcase,
  Mail,
  AlertCircle,
  BriefcaseMedical,
  Coffee,
  Award,
  Scale
} from "lucide-react";

export default function Employee() {
  const { user } = useAuth();
  
  if(user){ useTitle(user?.name) }
  
  const { data: leaves = [] } = useMyLeaves();
  const { data: todayAttendance, isLoading } = useTodayAttendance();

  const [openProfile, setOpenProfile] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const checkInTime = todayAttendance?.checkIn;
  const checkOutTime = todayAttendance?.checkOut;

  const hasCheckedIn = !!checkInTime;
  const hasCheckedOut = !!checkOutTime;

  const today = new Date().toISOString().slice(0, 10);

  const todayLeave = leaves.find((l) => {
    if (l.status !== "approved") return false;
    const from = l.fromDate.slice(0, 10);
    const to = l.toDate.slice(0, 10);
    return today >= from && today <= to;
  });

  const isOnLeaveToday = !!todayLeave;

  const leaveEndDate = todayLeave
    ? new Date(todayLeave.toDate).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : null;

  const formatTime = (value) => {
    if (!value) return "--:--";
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const checkInMutation = useCheckIn(
    () => toast.success("Checked in successfully"),
    (err) => toast.error(err.response?.data?.msg || "Error")
  );

  const checkOutMutation = useCheckOut(
    () => toast.success("Checked out successfully"),
    (err) => toast.error(err.response?.data?.msg || "Error")
  );

  const handleCheckOut = () => {
    setConfirmOpen(true);
  };

  const approvedLeaves = leaves.filter((l) => l.status === "approved").length;
  const pendingLeaves = leaves.filter((l) => l.status === "pending").length;

  const balance = user?.leaveBalance || { sick: 0, casual: 0, earned: 0, unpaid: 0 };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-300 mx-auto space-y-8 bg-slate-50/30 min-h-screen">
        
        <header className="flex items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employee Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Internal Portal | {user?.name}
            </p>
          </div>
        </header>
        
        <div className="mb-8">
          <AnnouncementFeed />
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=f1f5f9&color=475569`}
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-50 shadow-sm"
              alt="Profile"
              draggable="false"
            />
            <h2 className="mt-5 text-xl font-bold text-slate-800">{user?.name}</h2>
            
            <div className="mt-6 w-full space-y-2">
              <div className="flex items-center gap-3 text-sm text-slate-600 px-4 py-2 bg-slate-50 rounded-lg">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 px-4 py-2 bg-slate-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{user?.department}</span>
              </div>
            </div>

            <button
              onClick={() => setOpenProfile(true)}
              className="mt-6 w-full py-2 text-xs font-bold uppercase tracking-widest text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 col-span-2">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Attendance Tracking</h2>
              </div>

              <div>
                {isOnLeaveToday ? (
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded border border-amber-200">
                    On Leave
                  </span>
                ) : hasCheckedIn && !hasCheckedOut ? (
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> On Duty
                  </span>
                ) : null}
              </div>
            </div>

            {isLoading ? (
              <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading attendance data...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check In Time</p>
                    <p className="text-3xl font-light text-slate-800 tabular-nums">{formatTime(checkInTime)}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check Out Time</p>
                    <p className="text-3xl font-light text-slate-800 tabular-nums">{formatTime(checkOutTime)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {isOnLeaveToday && (
                    <div className="w-full flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Currently on approved leave until {leaveEndDate}.</span>
                    </div>
                  )}

                  {!isOnLeaveToday && !hasCheckedIn && (
                    <button
                      onClick={() => checkInMutation.mutate()}
                      disabled={checkInMutation.isPending}
                      className="px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3"
                    >
                      <LogIn className="w-4 h-4" /> {checkInMutation.isPending ? "Recording..." : "Check In"}
                    </button>
                  )}

                  {!isOnLeaveToday && hasCheckedIn && !hasCheckedOut && (
                    <button
                      onClick={handleCheckOut}
                      disabled={checkOutMutation.isPending}
                      className="px-8 h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" /> {checkOutMutation.isPending ? "Recording..." : "Check Out"}
                    </button>
                  )}

                  {!isOnLeaveToday && hasCheckedOut && (
                    <div className="w-full py-3 px-6 flex items-center gap-3 bg-slate-100 text-slate-600 font-bold rounded-lg border border-slate-200">
                      <CheckCircle className="w-5 h-5 text-slate-400" />
                      <span className="text-xs uppercase tracking-widest">Daily Shift Completed</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- LEAVE WALLET SECTION --- */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">My Leave Wallet</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sick Leave</p>
                  <h2 className="text-2xl font-bold mt-1 text-slate-800">{balance.sick}</h2>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                  <BriefcaseMedical className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 font-medium">Days remaining</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Casual Leave</p>
                  <h2 className="text-2xl font-bold mt-1 text-slate-800">{balance.casual}</h2>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Coffee className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 font-medium">Days remaining</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earned</p>
                  <h2 className="text-2xl font-bold mt-1 text-slate-800">{balance.earned}</h2>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 font-medium">Days available</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden opacity-80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unpaid</p>
                  <h2 className="text-2xl font-bold mt-1 text-slate-600">{balance.unpaid}</h2>
                </div>
                <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 font-medium">Days taken (Deducted)</p>
            </div>
          </div>
        </div>

        {/* --- LEAVE REQUEST STATS --- */}
        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Approved Leaves</p>
            <p className="text-2xl font-bold text-slate-800">{approvedLeaves}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-slate-800">{pendingLeaves}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total History</p>
            <p className="text-2xl font-bold text-slate-800">{leaves.length}</p>
          </div>
        </div>

        <EmployeeProfileModal
          isOpen={openProfile}
          onClose={async () => setOpenProfile(false)}
          user={user}
        />

        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            checkOutMutation.mutate();
            setConfirmOpen(false);
          }}
          title="Confirm Check Out"
          message="Are you sure you want to log your check-out time and end your shift?"
        />
      </div>
    </DashboardLayout>
  );
}