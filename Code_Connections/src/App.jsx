import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import UpdatePost from './pages/UpdatePost';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import UsersList from './pages/UsersList';
import GuidePage from './pages/GuidePage';
import Chatbot from './components/Chatbot.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { initializeAuthPersistence } from './services/authService';
import './styles/App.css';

const AppContent = () => {
    const { loading } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark' : 'light';
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    useEffect(() => {
        initializeAuthPersistence();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Router>
            <div className="app">
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/post/:id" element={<PostPage />} />
                        <Route path="/update/:id" element={<UpdatePost />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/users/:username" element={<UserProfile />} /> 
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/guide" element={<GuidePage />} />
                    </Routes>
                </div>
                <Chatbot />
            </div>
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
