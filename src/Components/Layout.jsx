import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Supervisor from "../Page/Supervisor";
import ConsumerDetails from "../Page/ConsumerDetails";
import SurveyDetails from "../Page/ApprovalsaData";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import SurveyorManagement from "../Page/SurveyorManagement";
import TicketStatus from "../Page/Ticket";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-[#F6F7FF]">
        <Navbar />

        <main className="px-2 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/supervisor"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Supervisor />
                </ProtectedRoute>
              }
            />

            <Route path="/consumer-details" element={<ConsumerDetails />} />

            <Route
              path="/survey-details"
              element={
                <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                  <SurveyDetails />
                </ProtectedRoute>
              }
            />

        
            <Route
              path="/surveyor-management"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SurveyorManagement/>
                </ProtectedRoute>
              }
            />
        
           <Route
  path="/ticket-status"
  element={
    <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
      <TicketStatus />
    </ProtectedRoute>
  }
/>

          </Routes>
        </main>
      </div>
    </div>
  );
}
