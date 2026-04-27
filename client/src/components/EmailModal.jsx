import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { useSendEmail } from "../hooks/useEmail";

export default function EmailModal({ isOpen, onClose, user, template }) {
  const send = useSendEmail();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Initialize values when modal opens / template changes
  useEffect(() => {
    if (isOpen) {
      setSubject(template?.subject || "");
      setMessage(template?.message || "");
      setError("");
    }
  }, [isOpen, template]);

  if (!isOpen || !user) return null;

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required");
      return;
    }

    send.mutate(
      {
        to: user.email,
        subject,
        message
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          setError("Failed to send email");
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[500px] max-w-full space-y-5">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Send Email
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Contact employee directly
          </p>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
          <img
            src={
              user.profilePic ||
              `https://ui-avatars.com/api/?name=${user.name}`
            }
            onError={(e) =>
              (e.target.src = `https://ui-avatars.com/api/?name=${user.name}`)
            }
            className="w-10 h-10 rounded-full object-cover border"
          />

          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setError("");
            }}
            placeholder="Enter subject..."
            className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Message
          </label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
            }}
            placeholder="Write your message..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSend}
            disabled={send.isPending}
          >
            {send.isPending ? "Sending..." : "Send Email"}
          </Button>
        </div>

      </div>
    </Modal>
  );
}