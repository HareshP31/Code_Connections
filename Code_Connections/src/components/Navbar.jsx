import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user) {
            if (isRegistering) {
                setIsRedirecting(true);
                const timer = setTimeout(() => {
                    setShowWelcome(true);
                    setIsRedirecting(false);
                    setIsRegistering(false);
                }, 2000);
                return () => clearTimeout(timer);
            } else {
                setShowWelcome(true);
            }
        } else {
            setShowWelcome(false);
        }
    }, [user, isRegistering]);

    const handleLogout = () => {
      if (window.confirm('Are you sure you want to log out?')) {
          if (isRegistering) {
              setTimeout(() => {
                  logout();
                  navigate('/login');
                  setTimeout(() => {
                      document.activeElement.blur();
                  }, 0);
              }, 2000);
          } else {
              logout();
              navigate('/login');
              setTimeout(() => {
                  document.activeElement.blur();
              }, 0);
          }
      }
  };
  

    const handleCreatePost = () => {
        if (isRegistering) {
            setTimeout(() => navigate('/create'), 2000);
        } else {
            navigate('/create');
        }
    };

    if (isRedirecting) {
        return <nav className="navbar"></nav>;
    }

    return (
        <nav className="navbar">
            {user && showWelcome && (
                <span className="welcome-message">Welcome, {user.username}!</span>
            )}

            <Link to="/" className="nav-link">Home</Link>

            {user ? (
                <>
                    <button onClick={handleCreatePost} className="nav-link">Create Post</button>
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')} className="nav-link">Login</button>
                    <button
                        onClick={() => {
                            setIsRegistering(true);
                            navigate('/register');
                        }}
                        className="nav-link"
                    >
                        Register
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
