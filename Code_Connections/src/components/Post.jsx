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
    event.preventDefault(); // ✅ Prevents scrolling to the top
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
          <span>
            By
            <a 
              href="#" 
              onClick={fetchOwnerDetails} 
              style={{ 
                cursor: 'pointer', 
                marginLeft: '4px', 
                color: 'inherit', 
                textDecoration: 'none' // Ensure no underline by default
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} // Add underline on hover
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'} // Remove underline when not hovering
            >
              {post.owner_name || "Unknown"}
            </a>

          </span>
          <span>•</span>
          <span>{formattedDate}</span>
        </p>
        <div className="upvotes-section">
          ▲ {post.upvotes}
        </div>
        <Link to={`/post/${post.id}`} className="view-post-link">
          {viewMode === 'card' ? 'Read More →' : 'View Post'}
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
}

export default Post;
