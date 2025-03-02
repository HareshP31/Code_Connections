import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const pLanguages = [ "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "Rust", "PHP", "TypeScript", "React", "Godot", "Unity", "Arduino", "Flask", ];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pSearchTerm, setpSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleLanguageSelect = (selectedLanguage) => {
    if (!selectedLanguages.includes(selectedLanguage)) {
      setSelectedLanguages([...selectedLanguages, selectedLanguage]);
    }
    setpSearchTerm('');
  };

  const handleRemoveLanguage = (lang) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  const filteredLanguages = pLanguages.filter(lang =>
    lang.toLowerCase().includes(pSearchTerm.toLowerCase()) &&
    !selectedLanguages.includes(lang)
  );

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
          owner_name: user.username,
          language_flair: selectedLanguages
        }
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
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Content: (Drag bottom right of box to make it bigger)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Programming Language:</label>
        <input
          type="text"
          placeholder="Search for a language..."
          value={pSearchTerm}
          onChange={(e) => setpSearchTerm(e.target.value)}
        />
        {pSearchTerm && (
          <ul className="planguage-dropdown">
            {filteredLanguages.map((lang) => (
              <li key={lang} onClick={() => handleLanguageSelect(lang)}>
                {lang}
              </li>
            ))}
          </ul>
        )}

        <div className="selected-languages">
          {selectedLanguages.map(lang => (
            <span key={lang} className="selected-tag">
              {lang} <button type="button" onClick={() => handleRemoveLanguage(lang)}>✖</button>
            </span>
          ))}
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
