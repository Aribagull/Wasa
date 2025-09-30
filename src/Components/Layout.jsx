import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Supervisor from "../Page/Supervisor";
import ConsumerDetails from "../Page/ConsumerDetails";
import SurveyDetails from "../Page/ApprovalsaData";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import SurveyorManagement from "../Page/SurveyorManagement";
import TicketTabs from "../Page/Ticket";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden text-sm 2xl:text-base">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-[#F6F7FF]">
        <Navbar />

        <main className="px-2 2xl:px-6 flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Supervisor', 'Surveyor']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor"
              element={
                <ProtectedRoute allowedRoles={['Super Admin']}>
                  <Supervisor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/consumer-details"
              element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Supervisor', 'Surveyor']}>
                  <ConsumerDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/survey-details"
              element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Supervisor']}>
                  <SurveyDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/surveyor-management"
              element={
                <ProtectedRoute allowedRoles={['Supervisor']}>
                  <SurveyorManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket-status"
              element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Supervisor']}>
                  <TicketTabs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
