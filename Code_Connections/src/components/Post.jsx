import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from "luxon";
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Post = ({ post, viewMode }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!post.owner_id) return;
      const userRef = doc(db, 'users', post.owner_id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfilePicture(userSnap.data().profilePicture);
      }
    };

    fetchProfilePicture();
  }, [post.owner_id]);

  const formattedDate = DateTime.fromISO(post.created_at)
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_MED);

    return (
      <div className={`post-card ${viewMode}`}>
        <div className="card-header">
          {profilePicture && (
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="profile-picture" 
              style={{ width: '40px', height: '40px' }}
            />
          )}
          <h2>{post.title}</h2>
        </div>
        
        <div className="post-details">
          <p className="post-meta">
            <span>By {post.owner_name || "Unknown"}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </p>
          <div className="upvotes-section">
            ▲ {post.upvotes}
          </div>
          {Array.isArray(post.language_flair) && post.language_flair.length > 0 && (
            <div className="flair-tags">
              {post.language_flair.map(lang => (
                <span key={lang} className="flair-tag">{lang}</span>
              ))}
            </div>
          )}
          {Array.isArray(post.categories) && post.categories.length > 0 && (
            <div className="flair-tags">
              {post.categories.map(tag => (
                <span key={tag} className="flair-tag">{tag}</span>
              ))}
            </div>
          )}
          <Link to={`/post/${post.id}`} className="view-post-link">
            {viewMode === 'card' ? 'Read More →' : 'View Post'}
          </Link>
        </div>
      </div>
    );
  }

export default Post;
