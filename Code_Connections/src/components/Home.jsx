import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import Post from "./Post";
import { useLocation } from "react-router-dom";
import "../styles/App.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [sortOption, setSortOption] = useState("created_at");
  const [selectedTag, setSelectedTag] = useState("");
  const location = useLocation();

  const availableTags = [
    "JavaScript", "Python", "Java", "C", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "Rust", 
    "PHP", "TypeScript", "React", "Godot", "Unity", "Arduino", "Flask",
    "Beginner", "Advanced", "AI/Machine Learning", "Game", "Educational", "Virtual Reality", 
    "Computer Vision", "Embedded Systems"
  ];

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "card" : "list"));
  };

  const fetchPosts = async () => {
    let query = supabase.from("posts").select("*");
    const params = new URLSearchParams(location.search);
    const search = params.get("search");

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (selectedTag) {
      query = query.or(`language_flair.cs.{${selectedTag}},categories.cs.{${selectedTag}}`);
    }

    if (sortOption === "upvotes") {
      query = query.order("upvotes", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortOption, location.search, selectedTag]);

  return (
    <div>
      <h1 className="home-banner">Code Connections</h1>
      
      <div className="sort-options" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <label>Sort By:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ padding: '5px' }}>
          <option value="created_at">Time Created</option>
          <option value="upvotes">Upvotes</option>
        </select>

        <label>Filter by Tag:</label>
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} style={{ padding: '5px' }}>
          <option value="">All Tags</option>
          {availableTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <button 
          onClick={toggleViewMode} 
          className="view-toggle py-2 px-4 rounded"
          style={{ padding: '10px 15px', marginLeft: 'auto', border: 'solid 2px white' }}
        >
          {viewMode === "list" ? "☷ Card View" : "☰ List View"}
        </button>
      </div>


      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className={`posts-container ${viewMode}`}>
          {posts.map((post) => (
            <Post key={post.id} post={post} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
