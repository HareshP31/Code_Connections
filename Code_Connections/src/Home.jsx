import React, { useEffect, useState } from 'react';
import { supabase } from './client';
import Post from './Post';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState('created_at');
  const location = useLocation();

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*');
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (sortOption === 'upvotes') {
      query = query.order('upvotes', { ascending: false});
    }
    else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
    }
    else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortOption, location.search]);

  return (
    <div>
      <h1 className="home-banner">Code Connections</h1>
      <div className="sort-options">
        <label>Sort By: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="created_at">Time Created</option>
          <option value="upvotes">Upvotes</option>
        </select>
      </div>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => (
          <Post key={post.id} post={post}/>
        ))
      )}
    </div>
  );
};
  
export default Home;