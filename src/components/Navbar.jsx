import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  Shield, 
  Home, 
  Mail, 
  Link as LinkIcon, 
  Trophy, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <Shield size={28} />
          <span>PhishGuard</span>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/simulation" 
            className={`nav-link ${isActive('/simulation') ? 'active' : ''}`}
          >
            <Mail size={20} />
            <span>Email Sim</span>
          </Link>
          
          <Link 
            to="/link-analyzer" 
            className={`nav-link ${isActive('/link-analyzer') ? 'active' : ''}`}
          >
            <LinkIcon size={20} />
            <span>Link Analyzer</span>
          </Link>
          
          <Link 
            to="/quiz" 
            className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}
          >
            <Trophy size={20} />
            <span>Quiz</span>
          </Link>
          
          <Link 
            to="/performance" 
            className={`nav-link ${isActive('/performance') ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>Performance</span>
          </Link>
          
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span>Admin</span>
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.displayName || user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
