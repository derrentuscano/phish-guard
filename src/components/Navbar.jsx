import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Shield, 
  Home, 
  Mail, 
  Link as LinkIcon, 
  Trophy, 
  BarChart3, 
  BookOpen,
  Settings,
  LogOut,
  Lock,
  User,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowToolsDropdown(false);
      setShowResourcesDropdown(false);
    };
    
    if (showToolsDropdown || showResourcesDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showToolsDropdown, showResourcesDropdown]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
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
          
          {/* Learning Tools Dropdown */}
          <div 
            className={`nav-dropdown ${showToolsDropdown ? 'open' : ''}`}
            onMouseEnter={() => setShowToolsDropdown(true)}
            onMouseLeave={() => setShowToolsDropdown(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowToolsDropdown(!showToolsDropdown);
            }}
          >
            <button className="nav-link dropdown-trigger">
              <GraduationCap size={20} />
              <span>Learning Tools</span>
              <ChevronDown size={16} />
            </button>
            {showToolsDropdown && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <Link to="/simulation" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <Mail size={18} />
                  <span>Email Simulation</span>
                </Link>
                <Link to="/link-analyzer" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <LinkIcon size={18} />
                  <span>Link Analyzer</span>
                </Link>
                <Link to="/quiz" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <Trophy size={18} />
                  <span>Quiz Mode</span>
                </Link>
                <Link to="/password-checker" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <Lock size={18} />
                  <span>Password Checker</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Resources Dropdown */}
          <div 
            className={`nav-dropdown ${showResourcesDropdown ? 'open' : ''}`}
            onMouseEnter={() => setShowResourcesDropdown(true)}
            onMouseLeave={() => setShowResourcesDropdown(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowResourcesDropdown(!showResourcesDropdown);
            }}
          >
            <button className="nav-link dropdown-trigger">
              <BookOpen size={20} />
              <span>Resources</span>
              <ChevronDown size={16} />
            </button>
            {showResourcesDropdown && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <Link to="/performance" className="dropdown-item" onClick={() => setShowResourcesDropdown(false)}>
                  <BarChart3 size={18} />
                  <span>Performance Stats</span>
                </Link>
                <Link to="/articles" className="dropdown-item" onClick={() => setShowResourcesDropdown(false)}>
                  <BookOpen size={18} />
                  <span>Security Articles</span>
                </Link>
              </div>
            )}
          </div>
          
          {userData?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              <Settings size={20} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
