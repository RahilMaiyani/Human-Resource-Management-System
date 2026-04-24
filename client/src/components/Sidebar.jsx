import { Link, useLocation } from "react-router-dom";
import { usePendingLeavesCount } from "../hooks/useLeaveNotifications";

export default function Sidebar({ user }) {
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  const { data: pendingCount = 0 } = usePendingLeavesCount(isAdmin);

  const isActive = (path) => location.pathname === path;

  const baseClass =
    "flex items-center justify-between px-3 py-2 rounded-md transition";

  const activeClass = "bg-gray-700";
  const inactiveClass = "hover:bg-gray-700";

  return (
    <div className="w-60 bg-gray-900 text-white p-4 flex flex-col h-screen sticky top-0">
      <h2 className="text-xl font-bold mb-6">OfficeLink</h2>

      <nav className="flex flex-col gap-2">

        {/* ADMIN */}
        {user.role === "admin" && (
          <>
            <Link
              to="/admin"
              className={`${baseClass} ${
                isActive("/admin") ? activeClass : inactiveClass
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/users"
              className={`${baseClass} ${
                isActive("/users") ? activeClass : inactiveClass
              }`}
            >
              Users
            </Link>

            <Link
              to="/admin/leaves"
              className={`${baseClass} ${
                isActive("/admin/leaves") ? activeClass : inactiveClass
              }`}
            >
              <span>Leave Management</span>

              {pendingCount > 0 && (
                <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>

            <Link to="/admin/reports" className={`${baseClass} ${
                isActive("/admin/reports") ? activeClass : inactiveClass
              }`}>
              All Leaves
            </Link>
          </>
        )}

        {/* EMPLOYEE */}
        {user.role === "employee" && (
          <>
            <Link
              to="/employee"
              className={`${baseClass} ${
                isActive("/employee") ? activeClass : inactiveClass
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/employee/leaves"
              className={`${baseClass} ${
                isActive("/employee/leaves") ? activeClass : inactiveClass
              }`}
            >
              Leaves
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}