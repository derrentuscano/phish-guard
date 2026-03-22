import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { sendAuthToExtension, clearExtensionAuth } from './utils/extensionBridge';

// Components
import Navbar from './components/Navbar';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import LinkAnalyzer from './components/LinkAnalyzer/LinkAnalyzer';
import PasswordChecker from './components/PasswordChecker/PasswordChecker';
import AdminPanel from './components/Admin/AdminPanel';
import Profile from './components/Profile/Profile';
import ChatBot from './components/ChatBot/ChatBot';
import LinkPreview from './components/LinkPreview/LinkPreview';
import FileScanner from './components/FileScanner/FileScanner';
import ImageDetector from './components/ImageDetector/ImageDetector';
import ReverseImageSearch from './components/ReverseImageSearch/ReverseImageSearch';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user data for chatbot context
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        // Send auth tokens to extension if it's installed
        sendAuthToExtension(currentUser);
      } else {
        setUserData(null);
        clearExtensionAuth();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/link-analyzer" 
            element={user ? <LinkAnalyzer user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/password-checker" 
            element={user ? <PasswordChecker /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/link-preview" 
            element={user ? <LinkPreview user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/file-scanner" 
            element={user ? <FileScanner user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/image-detector" 
            element={user ? <ImageDetector user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/reverse-image-search" 
            element={user ? <ReverseImageSearch user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <AdminPanel user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={!user ? <Landing /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
        
        {/* AI ChatBot - Available on all authenticated pages */}
        {user && <ChatBot user={user} userData={userData} />}
      </div>
    </Router>
  );
}

export default App;
