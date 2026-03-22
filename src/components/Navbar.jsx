import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Shield, 
  Home, 
  Link as LinkIcon, 
  Settings,
  LogOut,
  Lock,
  User,
  Wrench,
  ChevronDown,
  MousePointer2,
  FileSearch,
  ScanEye,
  Image
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowToolsDropdown(false);
    };
    
    if (showToolsDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showToolsDropdown]);

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
          <img src="/phishguardlogo.svg" alt="PhishGuard Logo" className="navbar-logo" />
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          
          {/* Security Tools Dropdown */}
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
              <Wrench size={20} />
              <span>Security Tools</span>
              <ChevronDown size={16} />
            </button>
            {showToolsDropdown && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <Link to="/link-analyzer" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <LinkIcon size={18} />
                  <span>Link Analyzer</span>
                </Link>
                <Link to="/password-checker" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <Lock size={18} />
                  <span>Password Checker</span>
                </Link>
                <Link to="/link-preview" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <MousePointer2 size={18} />
                  <span>Link Hover Preview</span>
                </Link>
                <Link to="/file-scanner" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <FileSearch size={18} />
                  <span>File Scanner</span>
                </Link>
                <Link to="/image-detector" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <ScanEye size={18} />
                  <span>AI Image Detector</span>
                </Link>
                <Link to="/reverse-image-search" className="dropdown-item" onClick={() => setShowToolsDropdown(false)}>
                  <Image size={18} />
                  <span>Reverse Image Search</span>
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
