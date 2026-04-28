import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";
import { Camera, X, User } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export default function UserModal({ isOpen, onClose, editUser }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
      reset({ name: "", email: "", password: "", department: "", role: "employee" });
      setPreview("");
    }
    setImageError("");
    setApiError("");
  }, [editUser, isOpen, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Format must be JPG or PNG");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size exceeds 2MB");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    setApiError("");
    data.profilePic = preview || "";
    const mutation = editUser ? updateMutation : createMutation;
    mutation.mutate(
      editUser ? { id: editUser._id, data } : data,
      { onSuccess: onClose, onError: (err) => setApiError(err?.response?.data?.msg || "Action failed") }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">{editUser ? "Update Employee" : "Register New Employee"}</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium text-pretty">Provide the employee details and system access level.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* IMAGE UPLOAD */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-md hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" ref={fileRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </label>
            {preview && (
              <button type="button" onClick={() => setPreview("")} className="absolute -top-1 -right-1 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {imageError && <p className="text-rose-500 text-[10px] font-bold uppercase mt-2 tracking-tighter">{imageError}</p>}
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input {...register("name", { required: "Name is required" })} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input {...register("email", { required: "Email is required" })} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" />
          </div>

          {!editUser && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Password</label>
              <input type="password" {...register("password", { required: "Password required" })} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
              <input {...register("department", { required: "Required" })} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Role</label>
              <select {...register("role")} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-indigo-500 outline-none">
                <option value="employee">Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        </div>

        {apiError && <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-bold text-center">{apiError}</div>}

        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            {editUser ? "Update Account" : "Create Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}