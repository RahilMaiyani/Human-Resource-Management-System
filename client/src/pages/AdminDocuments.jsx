import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useDocuments, useUserDocuments } from "../hooks/useDocuments.js";
import API from "../api/axios.js";
import DocumentCard from "../components/DocumentCard.jsx";
import DocumentSkeleton from "../components/DocumentSkeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import DocumentPreviewModal from "../components/DocumentPreviewModal.jsx";
import DeleteModal from "../components/DeleteModal.jsx";

const AdminDocuments = () => {
  const { isDeleting, deleteDocument } = useDocuments();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [previewDoc, setPreviewDoc] = useState(null);
  
    const handlePreview = (doc) => {
      setPreviewDoc(doc);
    };
  
    const closePreview = () => {
      setPreviewDoc(null);
    };
  

  const { documents, isLoadingUserDocuments } = useUserDocuments(selectedUserId);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await API.get("/users");
        setEmployees(response.data);
        setLoadingEmployees(false);
      } catch (error) {
        toast.error("Failed to load employees");
        setLoadingEmployees(false);
      }
    };

    if (user?.role === "admin") {
      fetchEmployees();
    }
  }, [user]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) &&
    emp.role == 'employee'
  );

  const selectedEmployee = employees.find((e) => e._id === selectedUserId);


  const [deleteTarget, setDeleteTarget] = useState(null); 

  const handleDeleteClick = (doc) => {
    setDeleteTarget(doc);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteDocument(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p className="text-red-600">Admin access required</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">View and manage employee documents</p>
        </div>

        {/* Search & Select Employee */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search Employee
          </label>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type employee name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Dropdown List */}
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg">
            {loadingEmployees ? (
              <div className="p-3 text-gray-500">Loading employees...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-3 text-gray-500">No employees found</div>
            ) : (
              filteredEmployees.map((emp) => (
                <button
                  key={emp._id}
                  onClick={() => setSelectedUserId(emp._id)}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    selectedUserId === emp._id
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-xs opacity-75">{emp.email}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected Employee Info */}
        {selectedEmployee && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-900">
              <span className="font-semibold">Selected:</span> {selectedEmployee.name}{" "}
              ({selectedEmployee.email})
            </p>
          </div>
        )}

        {/* Documents Grid */}
        {selectedUserId ? (
          isLoadingUserDocuments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <DocumentSkeleton key={i} />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon="FileBox"
              title="No Documents"
              description={`${selectedEmployee?.name || "This user"} has no uploaded documents`}
            />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Found {documents.length} document(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    document={doc}
                    onDelete={() => handleDeleteClick(doc)}
                    isDeleting={isDeleting}
                    onPreview={() => {handlePreview(doc)}}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <EmptyState
            icon="Users"
            title="Select an Employee"
            description="Choose an employee from the list to view their documents"
          />
        )}
      </div>
      
      <DocumentPreviewModal 
        previewDoc={previewDoc} 
        closePreview={closePreview} 
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title}
        type="Document"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
        
    </DashboardLayout>
  );
};

export default AdminDocuments;
