import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/home/?search=${searchTerm}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const defaultProfilePicture = 'https://cdn.pfps.gg/pfps/2301-default-2.png';

  return (
    <nav className={`navbar ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="navbar-scroll">
        <button onClick={() => navigate('/')} className="nav-link">About</button>
        <button onClick={() => navigate('/home')} className="nav-link">Home</button>
        <button onClick={() => navigate('/timeline')} className="nav-link">Timeline</button>
        <button onClick={() => navigate('/guide')} className="nav-link">Guide</button>
        {user && (
          <button onClick={() => navigate('/create')} className="nav-link">Create Post</button>
        )}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              required
            />
            <button type="submit" className="nav-link">Search</button>
          </form>
        </div>
        {user ? (
          <>
            <button
              onClick={() => navigate(`/users/${user.username}`)}
              className="profile-button"
            >
              <img
                src={user.profilePicture || defaultProfilePicture}
                alt="Profile"
                className="profile-picture"
              />
              <span className="username">{user.username}</span> 
            </button>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="nav-link">Login</button>
            <button onClick={() => navigate('/register')} className="nav-link">Register</button>
          </>
        )}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
