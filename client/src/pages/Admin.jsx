import DashboardLayout from "../layouts/DashboardLayout";
import { useUsers } from "../hooks/useUsers";
import { useEffect, useState } from "react";
import PageLoader from "../components/PageLoader";
import { useQueryClient } from "@tanstack/react-query";

import AttendanceChart from "../components/charts/AttendanceChart";
import LeaveStatusChart from "../components/charts/LeaveStatusChart";
import LeaveTrendChart from "../components/charts/LeaveTrendChart";

import EmailModal from "../components/EmailModal";
import HoverItem from "../components/HoverItem";

import { useAllLeaves } from "../hooks/useLeaves";
import { useAllAttendance } from "../hooks/useAttendance";

import { 
  Users,
  BarChart3, 
  CalendarCheck,
  Mail,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useUsers();
  const { data: leaves = [] } = useAllLeaves();
  const [attendance, setAttendance] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [emailUser, setEmailUser] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(null);

  const { data : allAttendance, isPending, isError} = useAllAttendance();

  const fetchAttendance = async () => {
      try {
        setAttendance(allAttendance);
        
      } catch (err) {
        console.error("Attendance fetch error:", err);
      }
    };

  useEffect(() => {
    fetchAttendance();
  }, [allAttendance, isPending, isError]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    await Promise.all([
      queryClient.invalidateQueries(["users"]),
      queryClient.invalidateQueries(["leaves"]),
      fetchAttendance() 
    ]);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (isLoading) return <PageLoader />;

  const employees = users.filter((u) => u.role !== "admin");
  const employeeIds = new Set(employees.map((u) => u._id));
  const validAttendance = attendance.filter((a) => employeeIds.has(a.userId));
  
  const totalEmployees = employees.length;
  const todayDate = new Date().toISOString().split("T")[0];
  const todayCheckins = validAttendance.filter((a) => a.date === todayDate).length;
  const totalRecords = validAttendance.length;

  const formatTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(new Date().getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const grouped = {};
  validAttendance.forEach((a) => {
    if (!grouped[a.date]) grouped[a.date] = 0;
    grouped[a.date]++;
  });

  const chartData = last7Days.map((date) => ({
    date,
    count: grouped[date] || 0
  }));

  const checkedInUserIds = new Set(
    validAttendance.filter((a) => a.date === todayDate).map((a) => a.userId)
  );

  const onLeaveUserIds = new Set(
    leaves
      .filter((l) => 
        l.status === "approved" &&
        l.fromDate.slice(0, 10) <= todayDate &&
        l.toDate.slice(0, 10) >= todayDate
      )
      .map((l) => l.userId?._id)
  );

  const checkedInUsers = employees.filter((u) => checkedInUserIds.has(u._id));
  const onLeaveUsers = employees.filter((u) => onLeaveUserIds.has(u._id));
  const absentUsers = employees.filter(
    (u) => !checkedInUserIds.has(u._id) && !onLeaveUserIds.has(u._id)
  );

  return (
    <DashboardLayout>
      <div className="p-10 max-w-400 mx-auto space-y-10 bg-slate-50/30 min-h-screen">
        
        {/* HEADER */}
        <div className="border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrative Overview</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Real-time monitoring of workforce operations and leave metrics.
            </p>
          </div>
        </div>

        {/* TOP LEVEL STATS */}
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Workforce</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800">{totalEmployees}</h2>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-1" /> Active Employees
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Presence</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800">{todayCheckins}</h2>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium">Checked in for {todayDate}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Records</p>
                <h2 className="text-3xl font-bold mt-2 text-slate-800">{totalRecords}</h2>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium">Aggregated attendance entries</p>
          </div>
        </div>

        {/* MAIN VISUALIZATION */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          {/* <div className="flex items-center gap-2 mb-8"> */}
            {/* <Clock className="w-5 h-5 text-indigo-600" /> */}
            {/* <h2 className="text-lg font-bold text-slate-800 tracking-tight">Attendance Velocity (7 Days)</h2> */}
          {/* </div> */}
          <div className="h-90 w-full">
            <AttendanceChart data={chartData} />
          </div>
        </div>

        {/* WORKFORCE SEGMENTATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Daily Workforce Status</h2>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
            {isRefreshing ? "Updating..." : "Refresh Data"}
          </button>

          <div className="grid grid-cols-3 gap-8">
            {/* COLUMN: CHECKED IN */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-125">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Checked-in</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">{checkedInUsers.length}</span>
              </div>
              <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                {checkedInUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 italic text-xs">No active sessions</div>
                ) : (
                  checkedInUsers.map((u) => {
                    const record = validAttendance.find(a => a.userId === u._id && a.date === todayDate);
                    return (
                      <HoverItem
                        key={u._id}
                        user={u}
                        isCheckedout={!!record?.checkout}
                        content={
                          <div className="text-[11px] space-y-1">
                            <p className="font-bold border-b border-slate-100 pb-1 mb-1">Session Data</p>
                            <p><span className="text-slate-400">In:</span> {formatTime(record?.checkIn)}</p>
                            <p><span className="text-slate-400">Out:</span> {formatTime(record?.checkOut || record?.checkout)}</p>
                          </div>
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN: ON LEAVE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-125">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-amber-700">On Leave</h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">{onLeaveUsers.length}</span>
              </div>
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {onLeaveUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 italic text-xs">Full attendance</div>
                ) : (
                  onLeaveUsers.map((u) => {
                    const leave = leaves.find(l => l.userId?._id === u._id && l.status === "approved" && l.fromDate.slice(0, 10) <= todayDate && l.toDate.slice(0, 10) >= todayDate);
                    return (
                      <HoverItem
                        key={u._id}
                        user={u}
                        toDate={leave?.toDate.slice(0, 10)}
                        content={
                          <div className="text-[11px] space-y-1">
                            <p className="font-bold border-b border-slate-100 pb-1 mb-1">Leave Info</p>
                            <p className="italic">"{leave?.reason || 'No reason provided'}"</p>
                            <p><span className="text-slate-400">Returning:</span> {leave?.toDate.slice(0, 10)}</p>
                          </div>
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN: ABSENT */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-125">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-rose-700">Absent</h3>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">{absentUsers.length}</span>
              </div>
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {absentUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 italic text-xs">Zero absences</div>
                ) : (
                  absentUsers.map((u) => (
                    <div key={u._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=f1f5f9&color=475569`}
                          className="w-9 h-9 rounded-full object-cover grayscale"
                          alt={u.name}
                        />
                        <p className="text-sm font-bold text-slate-700">{u.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEmailUser(u);
                          setEmailTemplate({
                            subject: "Attendance Reminder",
                            message: `Hi ${u.name}, our records show you haven't checked in for today (${todayDate}). Please update your status.`
                          });
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Send Notification"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="pt-6 border-t border-slate-200">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave Intelligence</h2>
            <p className="text-slate-500 text-sm font-medium">Patterns and distribution of time-off requests.</p>
          </div>

          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-100">
              <LeaveStatusChart leaves={leaves} />
            </div>
            <div className="col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-100">
              <LeaveTrendChart leaves={leaves} />
            </div>
          </div>
        </div>

        <EmailModal
          isOpen={!!emailUser}
          onClose={() => {
            setEmailUser(null);
            setEmailTemplate(null);
          }}
          user={emailUser}
          template={emailTemplate}
        />
      </div>
    </DashboardLayout>
  );
}