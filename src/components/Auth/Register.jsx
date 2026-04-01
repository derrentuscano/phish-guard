import React, { useState, useMemo } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react';
import { getUserRole } from '../../utils/adminConfig';
import './Auth.css';

/* ── Password strength scorer ─────────────────────────── */
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ff3b3b' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#ff8c00' };
  if (score === 3) return { score: 3, label: 'Good', color: '#ffcc00' };
  return { score: 4, label: 'Strong', color: '#00e65a' };
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, { displayName: formData.name });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: getUserRole(formData.email),
        score: 0,
        level: 'Beginner',
        badges: [],
        completedScenarios: [],
        totalAttempts: 0,
        correctAnswers: 0,
        quizzesCompleted: 0,
        totalQuizScore: 0,
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName || 'User',
          email: result.user.email,
          role: getUserRole(result.user.email),
          score: 0,
          level: 'Beginner',
          badges: [],
          completedScenarios: [],
          totalAttempts: 0,
          correctAnswers: 0,
          quizzesCompleted: 0,
          totalQuizScore: 0,
          createdAt: new Date().toISOString()
        });
      } else {
        const userData = userDoc.data();
        if (!userData.role) {
          await setDoc(doc(db, 'users', result.user.uid), {
            ...userData,
            role: getUserRole(result.user.email)
          }, { merge: true });
        }
      }

      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email address.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* CRT overlay */}
      <div className="auth-scanlines" />

      <div className="auth-card hud-fade-in">
        {/* Corner brackets */}
        <div className="auth-corners">
          <span /><span /><span /><span />
        </div>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-wrap">
            <div className="auth-logo-ring" />
            <img src="/phishguardlogo.svg" alt="PhishGuard Logo" className="auth-icon" />
          </div>
          <h1>Join Phish<span>Guard</span></h1>
          <div className="auth-tagline">Initialize Agent Profile</div>
        </div>

        {/* Status bar */}
        <div className="auth-status-bar">
          <span className="status-dot" />
          <span>ENCRYPTED_CHANNEL_ACTIVE :: REGISTRATION_PROTOCOL</span>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} noValidate>
          <div className="input-group">
            <label htmlFor="name">
              <User size={13} />
              Agent Name
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
              <div className="input-line" />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <Mail size={13} />
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="agent@domain.com"
                required
                autoComplete="email"
                spellCheck="false"
              />
              <div className="input-line" />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <Lock size={13} />
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong passphrase"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <div className="input-line" />
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className={`pw-strength strength-${strength.score}`}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="pw-strength-bar">
                    <div
                      className="pw-strength-bar-fill"
                      style={{
                        width: i <= strength.score ? '100%' : '0%',
                        background: i <= strength.score ? strength.color : undefined,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                ))}
                <span
                  className="pw-strength-label"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              <Lock size={13} />
              Confirm Password
            </label>
            <div className="input-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your passphrase"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <div className="input-line" />
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                INITIALIZING
              </>
            ) : (
              <>
                <UserPlus size={14} />
                CREATE AGENT PROFILE
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or register with</span>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          className="btn-google"
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Access the system</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
