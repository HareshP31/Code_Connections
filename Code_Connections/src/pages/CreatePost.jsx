import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const pLanguages = [ "HTML/CSS", "JavaScript", "Python", "Java", "C", "C++", "C#", "Ruby", "Swift", "Kotlin", "Rust", "PHP", "TypeScript", "React", "Godot", "Unity", "Arduino", "Flask", "Golang", "Lua", "AWS", "GCP", "Azure"];
const pCategories = ["Beginner", "Advanced", "AI/Machine Learning", "Game", "Educational", "Virtual Reality", "Computer Vision", "Embedded Systems"];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [pSearchTerm, setpSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleFileChange = (e) => {
    setImageFiles([...e.target.files]);
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


  const toggleTag = (tag) => {
    setSelectedCategories((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
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

    let imageUrls = [];

    for(const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if(uploadError) {
        console.error('Image upload failed:', uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrlData.publicUrl);
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          title, 
          content, 
          upvotes: 0, 
          created_at: new Date().toISOString(), 
          image_urls: imageUrls,
          owner_id: user.uid, 
          owner_name: user.username,
          language_flair: selectedLanguages,
          categories: selectedCategories
        }
      ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {

      await incrementUserPostCount(user.uid);
      navigate('/home');
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

        <label>Upload Image(s):</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        <label>Programming Language/Technology:</label>
        <input
          type="text"
          placeholder="Begin typing..."
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

        <div className="scrollable-language-list">
          <h4>Full List:</h4>
          <ul>
            {pLanguages.map((lang) => (
              <li 
                key={lang} 
                className={`language-item ${selectedLanguages.includes(lang) ? "selected" : ""}`} 
                onClick={() => handleLanguageSelect(lang)}
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>

        <div className="selected-languages">
          {selectedLanguages.map(lang => (
            <span key={lang} className="selected-tag">
              {lang} <button type="button" onClick={() => handleRemoveLanguage(lang)}>✖</button>
            </span>
          ))}
        </div>

        <label>Additional Tags: (Click to Toggle)</label>
        <div className="tags-container">
          {pCategories.map(tag => (
            <button 
              key={tag} 
              type="button" 
              className={`tag-button ${selectedCategories.includes(tag) ? "selected" : ""}`} 
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
