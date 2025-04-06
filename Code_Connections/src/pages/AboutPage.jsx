import React from "react";
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="about-page">
            <h1>Welcome to Code Connections!</h1>
            <h2>This is a forum website made for hackathon team building (or CS projects in general).</h2>
            <h2>Click <Link to="/home">here</Link> to view posts or <Link to="/register">here</Link> to get started!</h2>
        </div>
    );
};


export default AboutPage;
