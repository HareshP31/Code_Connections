import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  //const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Title and Content are required.');
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { title, content, upvotes: 0, created_at: new Date().toISOString(), },
      ]);

      if (error) {
        console.error('Error creating post:', error);
      } else {
        navigate('/');
      }
    };

    return (
      <div className="create-post">
        <h1>Create a New Post</h1>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <button type="submit">Create Post</button>


        </form>
      </div>
    );
  };
  
export default CreatePost;