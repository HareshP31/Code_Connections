import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from "luxon";
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import OwnerDetailsModal from './OwnerDetailsModal';

const Post = ({ post, viewMode }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);

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

  const fetchOwnerDetails = async (event) => {
    event.preventDefault();
    if (!post.owner_id) return;
    const userRef = doc(db, 'users', post.owner_id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setOwnerDetails(userSnap.data());
      setShowModal(true);
    }
  };

  const formattedDate = DateTime.fromISO(post.created_at)
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_MED);

  return (
    <div 
    className={`post-card ${viewMode}`}
    data-aos="fade-up" 
    data-aos-delay="50"
    data-aos-once="false"
    data-aos-mirror="true"
  >
      <div className="card-header">
        {profilePicture && (
          <img 
            src={profilePicture} 
            alt="Profile" 
            className="profile-picture" 
            style={{ width: '40px', height: '40px', cursor: 'pointer' }} 
            onClick={fetchOwnerDetails}
          />
        )}
        
        <h2 style={{ cursor: 'pointer' }}>
          <Link 
            to={`/post/${post.id}`} 
            style={{ textDecoration: 'none', color: 'inherit' }} 
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {post.title}
          </Link>
        </h2>
      </div>

      <div className="post-details">
      <p className="post-meta">
          <span>
            By{" "}
            <Link 
              to={`/users/${post.owner_name}`} 
              style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {post.owner_name || "Unknown"}
            </Link>
          </span>
          <span> • </span>
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
          {viewMode === 'card' ? 'View Post' : 'View Post'}
        </Link>
      </div>

      {showModal && (
        <OwnerDetailsModal 
          ownerDetails={ownerDetails} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Post;
