import { useState } from "react";
import { Upload, X } from "lucide-react";
import Modal from "./ui/Modal.jsx";
import { useDocuments } from "../hooks/useDocuments.js";

const DocumentUploadModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    file: null,
  });

  const [fileError, setFileError] = useState("");
  const { uploadDocument, isUploading } = useDocuments();

  const handleTitleChange = (e) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; 
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError(
        "Invalid file type. Allowed: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT"
      );
      return;
    }

    setFileError("");
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFileError("Title is required");
      return;
    }

    if (!formData.file) {
      setFileError("Please select a file");
      return;
    }

    if (!formData.category) {
      setFileError("Category is required");
      return;
    }

    // Create FormData for multipart upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("file", formData.file);

    // Upload the document
    uploadDocument(data, {
      onSuccess: () => {
        // Reset form and close modal
        setFormData({ title: "", category: "Other", file: null });
        setFileError("");
        onClose();
      },
    });
  };

  const handleReset = () => {
    setFormData({ title: "", category: "Other", file: null });
    setFileError("");
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Employment Contract"
              value={formData.title}
              onChange={handleTitleChange}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
            >
              <option value="Contract">Contract</option>
              <option value="ID Proof">ID Proof</option>
              <option value="Certification">Certification</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (Max 5MB) *
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                className="sr-only"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formData.file
                    ? formData.file.name
                    : "Click to select file"}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Allowed formats: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT
            </p>
          </div>

          {/* Error Message */}
          {fileError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {fileError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
