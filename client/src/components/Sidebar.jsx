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
      <h2 className="text-xl font-bold mb-10 flex gap-3 mt-1 justify-center">OfficeLink
        <span className="mt-1"><svg fill="#5C6BC0" version="1.1" id="Capa_1" width="25px" height="25px" viewBox="0 0 442.246 442.246" xml:space="preserve" stroke="#3F51B5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M409.657,32.474c-43.146-43.146-113.832-43.146-156.978,0l-84.763,84.762c29.07-8.262,60.589-6.12,88.129,6.732 l44.063-44.064c17.136-17.136,44.982-17.136,62.118,0c17.136,17.136,17.136,44.982,0,62.118l-55.386,55.386l-36.414,36.414 c-17.136,17.136-44.982,17.136-62.119,0l-47.43,47.43c11.016,11.017,23.868,19.278,37.332,24.48 c36.415,14.382,78.643,8.874,110.467-16.219c3.06-2.447,6.426-5.201,9.18-8.262l57.222-57.222l34.578-34.578 C453.109,146.306,453.109,75.926,409.657,32.474z"></path> <path d="M184.135,320.114l-42.228,42.228c-17.136,17.137-44.982,17.137-62.118,0c-17.136-17.136-17.136-44.981,0-62.118 l91.8-91.799c17.136-17.136,44.982-17.136,62.119,0l47.43-47.43c-11.016-11.016-23.868-19.278-37.332-24.48 c-38.25-15.3-83.232-8.262-115.362,20.502c-1.53,1.224-3.06,2.754-4.284,3.978l-91.8,91.799 c-43.146,43.146-43.146,113.832,0,156.979c43.146,43.146,113.832,43.146,156.978,0l82.927-83.845 C230.035,335.719,220.243,334.496,184.135,320.114z"></path> </g> </g> </g></svg></span>
      </h2>

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