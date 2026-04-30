import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import DocumentList from "../components/DocumentList.jsx";
import DocumentUploadModal from "../components/DocumentUploadModal.jsx";

const DocumentVault = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-6">
        <DocumentList onUploadClick={() => setIsUploadModalOpen(true)} />
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default DocumentVault;
