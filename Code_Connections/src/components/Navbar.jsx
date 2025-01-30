import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      if (window.confirm('Are you sure you want to log out?')) {
          logout();
          navigate('/login');
      }
  };

  const handleLogin = () => {
      navigate('/login');
  };

  const handleRegister = () => {
      navigate('/register');
  };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-link">Home</Link>
            {user ? (
                <>
                    <button onClick={() => navigate('/create')} className="nav-link">Create Post</button>
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                </>
            ) : (
                <>
                    <button onClick={handleLogin} className="nav-link">Login</button>
                    <button onClick={handleRegister} className="nav-link">Register</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
