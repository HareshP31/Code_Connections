import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  //const [imageUrl, setImageUrl] = useState('');

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    }
    else {
      setTitle(data.tile);
      setContent(data.content);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { data, error} = await supabase
      .from('posts')
      .update({ title, content, image_url: imageUrl })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
    }
    else {
      navigate(`/post/${id}`);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    }
    else {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
      <div className="update-post">
        <h1>Edit Post</h1>
        <form onSubmit={handleUpdate}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Content:</label>
          <textarea>
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          </textarea>

          <button type="submit">Update Post</button>
        </form>
        <button onClick={handleDelete} className="delete-button">Delete Post</button>
      </div>
  );
};
  
export default UpdatePost;