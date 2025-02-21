import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from "luxon";
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Post = ({ post }) => {
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
    <div className="post-card">
      <h2>{post.title}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <p>Posted by: {post.owner_name || "Unknown"}</p>
        {profilePicture && (
          <img 
            src={profilePicture} 
            alt="Profile" 
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
        )}
      </div>
      <p>Posted on: {formattedDate}</p>
      <p>Upvotes: {post.upvotes}</p>
      <Link to={`/post/${post.id}`} className="view-post-link">View Post</Link>
    </div>
  );
};

export default Post;
