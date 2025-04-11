import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { useAuth } from '../AuthContext';

const pLanguages = [ "HTML/CSS", "JavaScript", "Python", "Java", "C", "C++", "C#", "Ruby", "Swift", "Kotlin", "Rust", "PHP", "TypeScript", "React", "Godot", "Unity", "Arduino", "Flask", "Golang", "Lua", "AWS", "GCP", "Azure"];
const pCategories = ["Beginner", "Advanced", "AI/Machine Learning", "Game", "Educational", "Virtual Reality", "Computer Vision", "Embedded Systems"];

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [pSearchTerm, setpSearchTerm] = useState('');
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
      setSelectedLanguages(data.language_flair || []);
      setSelectedCategories(data.categories || []);
      setImageUrls(data.image_urls || []);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const toggleTag = (tag) => {
    setSelectedCategories((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleLanguageSelect = (lang) => {
    if(!selectedLanguages.includes(lang)) {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
    setpSearchTerm('');
  };

  const handleRemoveLanguage = (lang) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
  };

  const filteredLanguages = pLanguages.filter((lang) =>
    lang.toLowerCase().includes(pSearchTerm.toLowerCase()) && !selectedLanguages.includes(lang)
  );

  const handleRemoveImage = async (imageUrl) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;
    
    const updatedImageUrls = imageUrls.filter((url) => url !== imageUrl);
    setImageUrls(updatedImageUrls);

    const fileName = imageUrl.split('/').pop().split('?')[0];

    const { error } = await supabase.storage
      .from('post-images')
      .remove([fileName]);

    if (error) {
      console.error('Image deletion failed:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!post || user?.uid !== post.owner_id) return;

    let updatedImageUrls = [...imageUrls];

    if(imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if(error) {
        console.error('Image upload failed:', error);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
      updatedImageUrls.push(publicUrlData.publicUrl);
    }

    const { error } = await supabase
      .from('posts')
      .update({ 
        title, 
        content,
        image_urls: updatedImageUrls,
        language_flair: selectedLanguages,
        categories: selectedCategories
      })
      .eq('id', id);

    if (!error) {
      navigate(`/post/${id}`);
    } else {
      console.error('Post update failed:', error);
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

        <label>Add New Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageUrls.length > 0 && (
          <div className="image-preview-container">
            <p>Current Images:</p>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="image-container">
                <img key={idx} src={url} alt={`preview-${idx}`} width="150" />
                <button type="button" onClick={() => handleRemoveImage(url)}>Remove?</button>
              </div>
            ))}
          </div>
        )}

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
          {selectedLanguages.map((lang) => (
            <span key={lang} className="selected-tag">
              {lang} <button type="button" onClick={() => handleRemoveLanguage(lang)}>✖</button>
            </span>
          ))}
        </div>

        <label>Additional Tags (Click to Toggle):</label>
        <div className="tags-container">
          {pCategories.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-button ${selectedCategories.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div> 

        <button type="submit">CLICK HERE TO SAVE CHANGES</button>
      </form>
    </div>
  );
};

export default UpdatePost;
