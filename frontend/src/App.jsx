import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import InternGuidePage from "./pages/InternGuidePage";
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile from './components/Student/UpdateProfile';
import AllInternships from './components/Student/AllInternships';
import Sdashboard from './pages/Student/Sdashboard';
import Internship from './pages/Student/Internship';
import AdminDashboard from './components/Admin/Admin';
import LandingPage from './pages/InternGuidePage';


const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/student-dashboard" element={<Sdashboard />}>
        <Route path="updateform" element={<UpdateProfile/>} />
        <Route path="internships" element={<Internship/>} />
        </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
        <Route path="/faculty-dashboard" element={<h1>Faculty dashboard</h1> } />
    
        </Route>


        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/management-dashboard" element={<h1> Managemnt dashboard</h1>} />
        
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;