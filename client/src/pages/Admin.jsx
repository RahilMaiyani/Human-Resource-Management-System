import DashboardLayout from "../layouts/DashboardLayout";
import { useUsers } from "../hooks/useUsers";
import { useEffect, useState } from "react";
import API from "../api/axios";
import PageLoader from "../components/PageLoader";

import AttendanceChart from "../components/charts/AttendanceChart";
import LeaveStatusChart from "../components/charts/LeaveStatusChart";
import LeaveTrendChart from "../components/charts/LeaveTrendChart";

import { useAllLeaves } from "../hooks/useLeaves";

export default function Admin() {
  const { data: users = [], isLoading } = useUsers();
  const { data: leaves = [] } = useAllLeaves();
  const [attendance, setAttendance] = useState([]);

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
  // console.log(chartData)

  return (
    <DashboardLayout>
      <div className="p-6 max-w-350 mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of employees, attendance, and leaves
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80">
            <AttendanceChart data={chartData} />
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col justify-between h-80">
            <div>
              <p className="text-sm text-gray-500">Quick Summary</p>
              <h2 className="text-xl font-bold mt-2">
                {todayCheckins} Employees Active Today
              </h2>
            </div>

            <div className="text-sm text-gray-400 mt-4">
              Last updated just now
            </div>
          </div>
        </div>

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
      </div>
    </DashboardLayout>
  );
}