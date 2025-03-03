import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };


  const incrementUserPostCount = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentPosts = userSnap.data().numberOfPosts || 0;
        await updateDoc(userRef, { numberOfPosts: currentPosts + 1 });
      }
    } catch (err) {
      console.error("Error updating user post count:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Title and Content are required.');
      return;
    }

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          title, 
          content, 
          upvotes: 0, 
          created_at: new Date().toISOString(), 
          image_url: imageUrl,
          owner_id: user.uid, 
          owner_name: user.username 
        }
      ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {

      await incrementUserPostCount(user.uid);
      navigate('/');
    }
  };

  return (
    <div className="create-post">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Content: (Drag bottom right of box to make it bigger)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
