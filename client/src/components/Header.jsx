import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";

export default function Header({ onAddUser }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <p className="font-semibold text-lg"></p>

      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <Button onClick={onAddUser} className={`${isActive("/users") ? "" : "hidden"}`}>+ Add User</Button>
        )}

        <Button
          variant="danger"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}