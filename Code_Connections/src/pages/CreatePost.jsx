import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Title and Content are required.');
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

      console.log('Image upload response data:', data);

      const filePath = `post-images/${fileName}`;

      const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { title, 
          content, 
          upvotes: 0, 
          created_at: new Date().toISOString(), 
          image_url: imageUrl,
        },
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

          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit">Create Post</button>


        </form>
      </div>
    );
  };
  
export default CreatePost;