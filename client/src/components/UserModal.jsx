import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export default function UserModal({ isOpen, onClose, editUser }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [preview, setPreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [apiError, setApiError] = useState("");
  const fileRef = useRef(null);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (!isOpen) return;

    if (editUser) {
      reset({
        name: editUser.name || "",
        email: editUser.email || "",
        department: editUser.department || "",
        role: editUser.role || "employee"
      });
      setPreview(editUser.profilePic || "");
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        department: "",
        role: "employee"
      });
      setPreview("");
    }

    setImageError("");
    setApiError("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }, [editUser, isOpen, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG or PNG allowed");
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 2MB or smaller");
      setPreview("");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setImageError("");

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview("");
    setImageError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data) => {
    setApiError("");

    if (imageError) return;

    data.profilePic = preview || "";

    const mutation = editUser ? updateMutation : createMutation;

    mutation.mutate(
      editUser ? { id: editUser._id, data } : data,
      {
        onSuccess: onClose,
        onError: (err) => {
          setApiError(err?.response?.data?.msg || "Server error");
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-107.5 max-w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {editUser ? "Edit User" : "Create User"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage employee details and access
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile image */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={preview || "https://ui-avatars.com/api/?name=User"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm bg-white"
              />

              <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293z" />
                </svg>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  ref={fileRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md border-2 border-white"
                  aria-label="Remove image"
                >
                  ×
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400">JPG / PNG • Max 2MB</p>

            {imageError && (
              <p className="text-red-500 text-xs">{imageError}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="John Doe"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email"
                }
              })}
              placeholder="john@test.com"
              className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          {!editUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters"
                  }
                })}
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {/* Department + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                {...register("department", {
                  required: "Department is required"
                })}
                placeholder="HR"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {apiError && (
            <div className="text-sm text-red-500">{apiError}</div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">
              {editUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}