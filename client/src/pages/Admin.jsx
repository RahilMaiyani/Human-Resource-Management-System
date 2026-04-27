import DashboardLayout from "../layouts/DashboardLayout";
import { useUsers } from "../hooks/useUsers";
import { useEffect, useState } from "react";
import API from "../api/axios";
import PageLoader from "../components/PageLoader";

import AttendanceChart from "../components/charts/AttendanceChart";
import LeaveStatusChart from "../components/charts/LeaveStatusChart";
import LeaveTrendChart from "../components/charts/LeaveTrendChart";

import EmailModal from "../components/EmailModal";

import { useAllLeaves } from "../hooks/useLeaves";
import Button from "../components/ui/Button";

export default function Admin() {
  const { data: users = [], isLoading } = useUsers();
  const { data: leaves = [] } = useAllLeaves();
  const [attendance, setAttendance] = useState([]);

  const [emailUser, setEmailUser] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get("/attendance/all");
        setAttendance(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAttendance();
  }, []);

  if (isLoading) return <PageLoader />;

  const employees = users.filter((u) => u.role !== "admin");
  const employeeIds = new Set(employees.map((u) => u._id));

  const validAttendance = attendance.filter((a) =>
    employeeIds.has(a.userId)
  );

  const totalEmployees = employees.length;
  const todayDate = new Date().toISOString().split("T")[0];

  const todayCheckins = validAttendance.filter(
    (a) => a.date === todayDate
  ).length;

  const totalRecords = validAttendance.length;

  
  const today = new Date();

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
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
    validAttendance
      .filter((a) => a.date === todayDate)
      .map((a) => a.userId)
  );

  const onLeaveUserIds = new Set(
    leaves
      .filter(
        (l) =>
          l.status === "approved" &&
          l.fromDate.slice(0, 10) <= todayDate &&
          l.toDate.slice(0, 10) >= todayDate
      )
      .map((l) => l.userId?._id)
  );

  const checkedInUsers = employees.filter((u) =>
    checkedInUserIds.has(u._id)
  );

  const onLeaveUsers = employees.filter((u) =>
    onLeaveUserIds.has(u._id)
  );

  const absentUsers = employees.filter(
    (u) =>
      !checkedInUserIds.has(u._id) &&
      !onLeaveUserIds.has(u._id)
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-350 mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of employees, attendance, and leaves
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Total Employees</p>
            <h2 className="text-2xl font-bold mt-1">{totalEmployees}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Today's Check-ins</p>
            <h2 className="text-2xl font-bold mt-1">{todayCheckins}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Total Records</p>
            <h2 className="text-2xl font-bold mt-1">{totalRecords}</h2>
          </div>
        </div>

        {/* CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3 h-80">
            <AttendanceChart data={chartData} />
          </div>
        </div>

        {/* DAILY WORKFORCE STATUS */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Today's Workforce Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* CHECKED IN */}
            <div className="bg-white p-4 rounded-xl border">
              <h3 className="text-sm text-gray-500 mb-2">
                Checked-in ({checkedInUsers.length})
              </h3>

              <div className="space-y-2 max-h-100 overflow-auto">
                {checkedInUsers.length === 0 ? (
                  <p className="text-xs text-gray-400">No check-ins yet</p>
                ) : (
                  checkedInUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-3">
                      <img
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.name}`
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-medium">{u.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ON LEAVE */}
            <div className="bg-white p-4 rounded-xl border">
              <h3 className="text-sm text-gray-500 mb-2">
                On Leave ({onLeaveUsers.length})
              </h3>

              <div className="space-y-2 max-h-40 overflow-auto">
                {onLeaveUsers.length === 0 ? (
                  <p className="text-xs text-gray-400">No one on leave</p>
                ) : (
                  onLeaveUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-3">
                      <img
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.name}`
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-medium">{u.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ABSENT */}
            <div className="bg-white p-4 rounded-xl border">
              <h3 className="text-sm text-gray-500 mb-2">
                Absent ({absentUsers.length})
              </h3>

              <div className="space-y-2 max-h-40 overflow-auto">
                {absentUsers.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    Everyone accounted for
                  </p>
                ) : (
                  absentUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between text-sm"
                    >
                    <div key={u._id} className="flex items-center gap-3">
                      <img
                        src={
                          u.profilePic ||
                          `https://ui-avatars.com/api/?name=${u.name}`
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-medium">{u.name}</p>
                    </div>

                      <Button variant="primary"
                        onClick={() => {
                          setEmailUser(u);
                          setEmailTemplate({
                            subject: "Attendance Reminder",
                            message: `Hi ${u.name}, you have not checked in today. Please update your attendance.`
                          });
                        }}
                      >
                        Remind
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* LEAVE ANALYTICS */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Leave Analytics
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Insights into employee leave patterns
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2">
              <LeaveStatusChart leaves={leaves} />
            </div>

            <div className="xl:col-span-3">
              <LeaveTrendChart leaves={leaves} />
            </div>
          </div>
        </div>

        <EmailModal
          isOpen={!!emailUser}
          onClose={() => setEmailUser(null)}
          user={emailUser}
          template={emailTemplate}
        />

      </div>
    </DashboardLayout>
  );
}