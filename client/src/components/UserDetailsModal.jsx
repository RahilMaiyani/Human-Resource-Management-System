import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import API from "../api/axios";

export default function UserDetailsModal({ user, onClose }) {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/attendance/user/${user._id}`);
        setAttendance(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (!user) return null;

  return (
    <Modal isOpen={!!user} onClose={onClose}>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <img
            src={
              user.profilePic ||
              `https://ui-avatars.com/api/?name=${user.name}`
            }
            className="w-24 h-24 rounded-full object-cover border"
          />

          <h2 className="text-lg font-semibold mt-3">
            {user.name}
          </h2>

          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* USER INFO */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-400 text-xs">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-400 text-xs">Department</p>
            <p className="font-medium">{user.department}</p>
          </div>
        </div>

        {/* ATTENDANCE */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">
            Last Attendance
          </h3>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : attendance ? (
            <div className="grid grid-cols-3 gap-3 text-sm">          
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium">{attendance.date}</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Check-in</p>
                <p className="font-medium">
                  {attendance.checkIn
                    ? new Date(attendance.checkIn).toLocaleTimeString()
                    : "—"}
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">Check-out</p>
                <p className="font-medium">
                  {attendance.checkout
                    ? new Date(attendance.checkout).toLocaleTimeString()
                    : "—"}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No attendance found
            </p>
          )}
        </div>

      </div>
    </Modal>
  );
}