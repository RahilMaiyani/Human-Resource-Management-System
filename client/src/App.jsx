import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Suspense } from "react";
import PageLoader from "./components/PageLoader";
import Users from "./pages/Users";
import MyLeaves from "./pages/MyLeaves";
import AdminLeaves from "./pages/AdminLeaves";
import LeaveReports from "./pages/LeaveReport";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
    <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            fontSize: "14px"
          }
        }}
      />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

  
          <Route path="/employee/leaves"
           element={
            <ProtectedRoute>
              <MyLeaves />
            </ProtectedRoute>
          } 
          />

          <Route path="/admin/leaves"
           element={
            <ProtectedRoute>
              <AdminLeaves />
            </ProtectedRoute>
          }
          />

          <Route path="/admin/reports"
           element={
            <ProtectedRoute>
              <LeaveReports />
            </ProtectedRoute>
          }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </>
  );
}