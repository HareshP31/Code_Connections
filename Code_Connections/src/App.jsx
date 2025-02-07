import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import UpdatePost from './pages/UpdatePost';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { initializeAuthPersistence } from './services/authService';
import './styles/App.css';

const AppContent = () => {
    const { loading } = useAuth();

    useEffect(() => {
        initializeAuthPersistence();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Router>
            <div className="app">
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/post/:id" element={<PostPage />} />
                        <Route path="/update/:id" element={<UpdatePost />} />
                    </Routes>
                </div>
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