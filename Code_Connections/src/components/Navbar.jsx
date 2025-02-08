import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      {user && (
        <Link to="/create" className="nav-link">Create Post</Link>
      )}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="nav-link">Search</button>
      </form>
      {user ? (
        <>
          <span className="nav-link">Welcome, {user.username}</span>
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
