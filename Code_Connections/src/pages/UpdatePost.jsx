import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '../AuthContext';

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!post || user?.uid !== post.owner_id) return;

    const { error } = await supabase
      .from('posts')
      .update({ title, content })
      .eq('id', id);

    if (!error) {
      navigate(`/post/${id}`);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (!post || user?.uid !== post.owner_id) {
    return <p>You are not authorized to edit this post.</p>;
  }

  return (
    <div className="update-post">
      <h1>Edit Post</h1>
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>

        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default UpdatePost;
