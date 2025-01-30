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

    return (
        <nav className="navbar">
            {user && (
                <span className="welcome-message">Welcome, {user.username}!</span>
            )}

            <Link to="/" className="nav-link">Home</Link>

            {user ? (
                <>
                    <button onClick={() => navigate('/create')} className="nav-link">Create Post</button>
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')} className="nav-link">Login</button>
                    <button onClick={() => navigate('/register')} className="nav-link">Register</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
