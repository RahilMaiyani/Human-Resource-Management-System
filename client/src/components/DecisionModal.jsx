import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function DecisionModal({
  isOpen,
  onClose,
  onSubmit,
  type // "approved" | "rejected"
}) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const isReject = type === "rejected";

  const handleSubmit = () => {
    if (isReject && !comment.trim()) {
      setError("Comment is required for rejection");
      return;
    }

    onSubmit(comment);
    setComment("");
    setError("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[420px] max-w-full">
        <h2 className="text-lg font-semibold mb-2 capitalize">
          {type === "approved" ? "Approve Leave" : "Reject Leave"}
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          {isReject
            ? "Provide a reason for rejection"
            : "Optional note for approval"}
        </p>

        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setError("");
          }}
          rows="4"
          placeholder="Enter comment..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant={isReject ? "danger" : "primary"} onClick={handleSubmit}>
            {type === "approved" ? "Approve" : "Reject"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}