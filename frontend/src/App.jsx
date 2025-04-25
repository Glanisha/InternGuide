import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/Landing/LandingPage";
import FacultyDashboard from "./components/Faculty/FacultyDashboard";
import StudentDashboard from "./components/Student/StudentDashboard";
import Dashboard from "./components/student/Dashboard";
import Internships from "./components/student/Internships";
import Profile from "./components/student/Profile";
import Messages from "./components/student/Messages";
import Settings from "./components/student/Settings";
import ReportPage from "./components/student/ReportPage";
import InternshipCard from "./components/Management/InternshipCard";
import ViewerDashboard from "./components/ViewerLiza/ViewerDashboard";
import ReportPageManage from "./components/Management/ReportPageManage";

// Admin components
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/Dashboard"; // Make sure this exists
import AdminInternships from "./components/Admin/Internships"; // Renamed to avoid conflict
import MentorAssignment from "./components/Admin/MentorAssignment";
import AdminSettings from "./components/Admin/Settings"; // Renamed to avoid conflict
import AdminRequestManager from "./components/Admin/AdminRequestManager"; // adjust path as needed



import FacultyMentees from "./components/Faculty/FacultyMentees";
import MenteeAnalysis from "./components/Faculty/MenteeAnalysis";
import FacultyProfile from "./components/Faculty/FacultyProfile";
import MentorPage from "./components/student/MentorPage";
import ProfilePage from "./components/student/ProfilePage";
import ManagementDashboard from "./components/Management/ManagementDashboard";
import MentorshipPage from "./components/Management/MentorshipPage";
import StatsPage from "./components/Management/StatsPage";
import InternshipPage from "./components/Management/InternshipPage";
import SDGPage from "./components/Management/SDGPage";
import OverallReport from "./components/Management/OverAllReport";
import ViewerInternships from "./components/ViewerLiza/ViewerInternships";
import SubmitRequest from "./components/ViewerLiza/SubmitRequest";
import ViewerStats from "./components/ViewerLiza/ViewerStats";

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
            <Route path="requests" element={<AdminRequestManager />} />
          </Route>
        </Route>


        <Route path="/management" element={<ManagementDashboard/>}>
          <Route path="dashboard" element={<StatsPage/>} />
          <Route path="internships" element={<InternshipPage/>} />
          <Route path="sdg" element={<SDGPage/>} />
          <Route path="mentorship" element={<MentorshipPage/>} />
          <Route path="reports" element={<OverallReport/>} />
        </Route>


        <Route path="/viewer/dashboard" element={<ViewerDashboard />}>
  {/* <Route index element={<ViewerHome />} /> */}
  <Route path="stats" element={<ViewerStats />} />
  <Route path="internships" element={<ViewerInternships />} />
  <Route path="requests" element={<SubmitRequest />} />
</Route>

        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;