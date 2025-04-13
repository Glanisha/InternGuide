import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/InternGuidePage";
import FacultyDashboard from "./components/Faculty/FacultyDashboard";
import StudentDashboard from "./components/Student/StudentDashboard";
import Dashboard from "./components/student/Dashboard";
import Internships from "./components/student/Internships";
import Profile from "./components/student/Profile";
import Schedule from "./components/student/Schedule";
import Messages from "./components/student/Messages";
import Settings from "./components/student/Settings";
import ReportPage from "./components/student/ReportPage";

// Admin components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/Dashboard"; // Make sure this exists
import AdminInternships from "./components/Admin/Internships"; // Renamed to avoid conflict
import MentorAssignment from "./components/Admin/MentorAssignment";
import AdminSettings from "./components/Admin/Settings"; // Renamed to avoid conflict

import FacultyMentees from "./components/Faculty/FacultyMentees";
import MenteeAnalysis from "./components/Faculty/MenteeAnalysis";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/student" element={<StudentDashboard />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="internships" element={<Internships />} />
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="messages" element={<Messages />} />
            <Route path="generate-report" element={<ReportPage />} />
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="/faculty" element={<FacultyDashboard />}>
            <Route path="mentees" element={<FacultyMentees />} />
            <Route path="analytics" element={<MenteeAnalysis />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="internships" element={<AdminInternships />} />
            <Route path="mentors" element={<MentorAssignment />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;