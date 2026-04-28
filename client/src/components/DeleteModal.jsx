import Modal from "./ui/Modal";
import { Trash2, AlertCircle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-sm">
        
        {/* ICON & TITLE */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-50 rounded-xl">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Remove User
          </h2>
        </div>

        {/* MESSAGE */}
        <div className="space-y-4 mb-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Are you sure you want to delete this user? This action will permanently remove their profile and all associated data from the system.
          </p>
          
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-8 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-100 transition-all active:scale-95"
          >
            Delete User
          </button>
        </div>
        
      </div>
    </Modal>
  );
} 