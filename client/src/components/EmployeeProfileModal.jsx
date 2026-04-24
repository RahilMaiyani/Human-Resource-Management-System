import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useUpdateUser } from "../hooks/useUsers";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export default function EmployeeProfileModal({ isOpen, onClose, user }) {
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
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (!isOpen || !user) return;

    reset({
      name: user.name || "",
      email: user.email || "",
      password: ""
    });

    setPreview(user.profilePic || "");
    setImageError("");
    setApiError("");

    if (fileRef.current) fileRef.current.value = "";
  }, [isOpen, user, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG or PNG allowed");
      setPreview("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Max size 2MB");
      setPreview("");
      return;
    }

    setImageError("");

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data) => {
    setApiError("");

    if (imageError) return;

    const payload = {
      name: data.name,
      profilePic: preview
    };

    if (data.password) {
      payload.password = data.password;
    }

    updateMutation.mutate(
      { id: user._id, data: payload },
      {
        onSuccess: onClose,
        onError: (err) =>
          setApiError(err?.response?.data?.msg || "Update failed")
      }
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <p className="text-sm text-gray-500">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* IMAGE */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={preview || "https://ui-avatars.com/api/?name=User"}
                className="w-24 h-24 rounded-full object-cover border"
              />

              <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer">
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
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                >
                  ×
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400">JPG/PNG • Max 2MB</p>
            {imageError && (
              <p className="text-red-500 text-xs">{imageError}</p>
            )}
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              {...register("name", { required: "Required" })}
              className="w-full h-11 mt-1 px-3 border rounded-lg"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL (READ ONLY) */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register("email")}
              disabled
              className="w-full h-11 mt-1 px-3 border rounded-lg bg-gray-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">
              New Password (optional)
            </label>
            <input
              type="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Min 6 characters"
                }
              })}
              className="w-full h-11 mt-1 px-3 border rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-red-500">{apiError}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}