import DashboardLayout from "../layouts/DashboardLayout";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import UserModal from "../components/UserModal";
import PageLoader from "../components/PageLoader";
import Button from "../components/ui/Button";
import DeleteModal from "../components/DeleteModal";
import UserDetailsModal from "../components/UserDetailsModal";

export default function Users() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 6;

  const { user } = useAuth();

  const { data: users = [], isLoading } = useUsers();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // UNIQUE DEPARTMENTS
  const departments = useMemo(() => {
    const deps = users.map((u) => u.department).filter(Boolean);
    return ["", ...new Set(deps)];
  }, [users]);

  // FILTER USERS
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchDepartment =
        !department || u.department === department;

      const notSelf = u.email !== user.email;

      return matchSearch && matchDepartment && notSelf;
    });
  }, [users, search, department]);

  // RESET PAGE WHEN FILTER CHANGES
  useMemo(() => {
    setCurrentPage(1);
  }, [search, department]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
    <DashboardLayout
      onAddUser={() => {
        setEditUser(null);
        setIsModalOpen(true);
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 p-1">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {departments.map((dep, i) => (
              <option key={i} value={dep}>
                {dep || "All Departments"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <PageLoader />}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 text-left">User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-gray-500 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.profilePic ||
                          `https://ui-avatars.com/api/?name=${user.name}`
                        }
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.department || (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  <td className="text-right pr-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteUserId(user._id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}
        <DeleteModal
          isOpen={!!deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onConfirm={() => {
            deleteMutation.mutate(deleteUserId);
            setDeleteUserId(null);
          }}
        />

        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editUser={editUser}
        />
      </div>
    </DashboardLayout>
  );
}