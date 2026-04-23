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
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { user } = useAuth();

  const { data: users = [], isLoading } = useUsers();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) &&
        u.email !== user.email
    );
  }, [users, search]);

  return (
    <DashboardLayout
      onAddUser={() => {
        setEditUser(null);
        setIsModalOpen(true);
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {isLoading && <PageLoader />}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Department</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map((user) => (
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

                    <div>
                      <p className="font-medium">{user.name}</p>
                      {/* <p className="text-xs text-gray-400">
                        {user.role}
                      </p> */}
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                    {user.role}
                  </span>
                </td>

                <td>{user.department}</td>

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
            ))}
          </tbody>
        </table>


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