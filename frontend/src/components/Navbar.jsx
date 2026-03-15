import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">

        <div className="navbar-logo">
          <img
            src="/placeholder-cbit-logo.png"
            alt="CBIT Logo"
            className="cbit-logo"
          />
        </div>

        <div className="navbar-menu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Complaints</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Analytics</NavLink>
          <NavLink to="/login" className={({ isActive }) => `nav-link login-link ${isActive ? 'active' : ''}`}>Login</NavLink>
        </div>

      </div>

    </nav>
  );
}