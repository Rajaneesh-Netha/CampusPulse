import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
<<<<<<< HEAD
import StudentDashboard from './components/StudentDashboard';
import InChargeDashboard from './components/InChargeDashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicComplaints from './components/PublicComplaints';
import PublicAnalytics from './components/PublicAnalytics';
=======
import SubmitComplaint from './components/SubmitComplaint';
import Analytics from './components/Analytics';
>>>>>>> a49bd7dbf44c0933cfa6b33d344fd1f75aa930dd

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
=======
          <Route path="/complaints" element={<div>Complaints Page - Coming Soon</div>} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Student section (existing login/register behavior) */}
          <Route path="/student/login" element={<Login />} />
          <Route path="/student/register" element={<Signup />} />
>>>>>>> a49bd7dbf44c0933cfa6b33d344fd1f75aa930dd

          {/* Public pages — navbar links */}
          <Route path="/complaints" element={<PublicComplaints />} />
          <Route path="/analytics"  element={<PublicAnalytics />} />

          {/* Student */}
          <Route path="/student/login"      element={<Login />} />
          <Route path="/student/register"   element={<Signup />} />
          <Route path="/student/dashboard"  element={<StudentDashboard />} />

          {/* In-Charge */}
          <Route path="/incharge/dashboard" element={<InChargeDashboard />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Legacy redirects */}
          <Route path="/login"             element={<Navigate to="/student/login"      replace />} />
          <Route path="/signup"            element={<Navigate to="/student/register"   replace />} />
          <Route path="/submit-complaint"  element={<Navigate to="/student/dashboard"  replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;