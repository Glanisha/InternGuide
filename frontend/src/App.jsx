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
import Messages from "./components/student/Messages";
import Settings from "./components/student/Settings";
import ReportPage from "./components/student/ReportPage";
import InternshipCard from "./components/Management/InternshipCard";
import ViewerDashboard from "./components/Viewer/ViewerDashboard";

// Admin components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/Dashboard"; // Make sure this exists
import AdminInternships from "./components/Admin/Internships"; // Renamed to avoid conflict
import MentorAssignment from "./components/Admin/MentorAssignment";
import AdminSettings from "./components/Admin/Settings"; // Renamed to avoid conflict

import FacultyMentees from "./components/Faculty/FacultyMentees";
import MenteeAnalysis from "./components/Faculty/MenteeAnalysis";
import FacultyProfile from "./components/Faculty/FacultyProfile";
import MentorPage from "./components/student/MentorPage";
import ProfilePage from "./components/student/ProfilePage";
import ManagementDashboard from "./components/Management/ManagementDashboard";
import MentorshipPage from "./components/Management/MentorshipPage";
import StatsPage from "./components/Management/StatsPage";
import InternshipPage from "./components/Management/InternshipPage";

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
            <Route path="profile" element={<ProfilePage />} />
            <Route path="messages" element={<Messages />} />
            <Route path="generate-report" element={<ReportPage />} />
            <Route path="mentor" element={<MentorPage/>} />
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="/faculty" element={<FacultyDashboard />}>
            <Route path="mentees" element={<FacultyMentees />} />
            <Route path="dashboard" element={<FacultyProfile/>} />
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


        <Route path="/management" element={<ManagementDashboard/>}>
          <Route path="dashboard" element={<StatsPage/>} />
          <Route path="internships" element={<InternshipPage/>} />
          <Route path="profile" element={<h2>Profile Page</h2>} />
          <Route path="mentorship" element={<MentorshipPage/>} />
          <Route path="generate-report" element={<h2>Report Page</h2>} />
        </Route>


        <Route path="/viewer-dashboard" element={<ViewerDashboard/>} />

        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;