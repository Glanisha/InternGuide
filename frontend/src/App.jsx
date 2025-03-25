import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import InternGuidePage from "./pages/InternGuidePage";
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile from './components/Student/UpdateProfile';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/student-dashboard" element={<h1>Student Dashboard</h1>} />
        <Route path="/updateform" element={<UpdateProfile/>} />

        </Route>

        <Route element={<ProtectedRoute />}>
        <Route path="/faculty-dashboard" element={<h1>Faculty dashboard</h1> } />
        <Route path="/admin-dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="/management-dashboard" element={<h1> Managemnt dashboard</h1>} />
        </Route>
        
        <Route path="/" element={<InternGuidePage />} />
      </Routes>
    </Router>
  );
};

export default App;