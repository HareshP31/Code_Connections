import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import CreatePost from './CreatePost';
import PostPage from './PostPage';
import UpdatePost from './UpdatePost';
import './App.css';


const App = () => {
  return (
    <Router>
      <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/update/:id" element={<UpdatePost />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
};

export default App;
