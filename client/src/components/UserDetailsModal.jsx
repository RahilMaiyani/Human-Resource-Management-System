import { useState } from "react";
import Modal from "./ui/Modal";
import EmailModal from "./EmailModal";
import { Mail, Briefcase, Shield, Clock, LogIn, LogOut, Calendar } from "lucide-react";
import Skeleton from "./Skeleton";
import { useUserAttendance } from "../hooks/useAttendance";

export default function UserDetailsModal({ user, onClose }) {
  const [openEmail, setOpenEmail] = useState(false);

  const { data: attendance, isLoading, isError } = useUserAttendance(user?._id);

  if (!user) return null;

  return (
    <>
      <Modal isOpen={!!user} onClose={onClose}>
        <div className="space-y-8">
          
          {/* HEADER / PROFILE */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f1f5f9&color=475569`}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                alt={user.name}
                draggable="false"
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-4 tracking-tight">
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </div>
          </div>

          {/* ORGANIZATION INFO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Shield className="w-3 h-3" /> Role
              </p>
              <p className="text-sm font-bold text-slate-700 capitalize">{user.role}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3 h-3" /> Department
              </p>
              <p className="text-sm font-bold text-slate-700">{user.department || "General"}</p>
            </div>
          </div>

          {/* ATTENDANCE SECTION */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Latest Activity
            </h3>

            {isLoading ? (
              <div className="space-y-4 mt-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : attendance ? (
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">Record Date</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 tabular-nums">{attendance.date}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1 mb-1">
                      <LogIn className="w-3 h-3" /> Check In
                    </p>
                    <p className="text-sm font-black text-emerald-700 tabular-nums">
                      {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tighter flex items-center gap-1 mb-1">
                      <LogOut className="w-3 h-3" /> Check Out
                    </p>
                    <p className="text-sm font-black text-rose-700 tabular-nums">
                      {attendance.checkout || attendance.checkOut 
                        ? new Date(attendance.checkout || attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity found</p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <button
              onClick={() => setOpenEmail(true)}
              className="flex-1 h-11 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Employee
            </button>

            <button
              onClick={onClose}
              className="px-6 h-11 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </Modal>

      <EmailModal
        isOpen={openEmail}
        onClose={() => setOpenEmail(false)}
        user={user}
        template={null}
      />
    </>
  );
}