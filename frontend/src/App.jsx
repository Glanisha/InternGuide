import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/Admin/Admin';
import LandingPage from './pages/InternGuidePage';
import FacultyDashboard from './components/Faculty/FacultyDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import Dashboard from './components/student/Dashboard';
import Internships from './components/student/Internships';
import Profile from './components/student/Profile';
import Schedule from './components/student/Schedule';
import Messages from './components/student/Messages';
import Settings from './components/student/Settings';
import ReportPage from './components/student/ReportPage';

import InternshipForm from './components/Admin/InternshipForm';
import MentorAssignment from './components/Admin/MentorAssignment';

import FacultyMentees from './components/Faculty/FacultyMentees';


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
          <Route path="generate-report" element={<ReportPage/>} />
          <Route index element={<Dashboard />} />
        </Route>
        </Route>
        <Route path="/faculty" element={<FacultyDashboard />}>
   
    <Route path="mentees" element={<FacultyMentees />} />
 
  </Route>


        {/* <Route path="/admin-dashboard" element={<AdminDashboard/>} /> */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="internships" element={<Internships />} />
        <Route path="create" element={<InternshipForm />} />
        <Route path="mentors" element={<MentorAssignment />} />
        <Route path="settings" element={<Settings />} />
      </Route>
        
        <Route path="/management-dashboard" element={<h1> Managemnt dashboard</h1>} />
        
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;