import React from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from "luxon";

const Post = ({ post }) => {
  const formattedDate = DateTime.fromISO(post.created_at)
  .setZone("America/New_York")
  .toLocaleString(DateTime.DATETIME_MED);
  
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p>Posted on: {formattedDate}</p>
      <p>Upvotes: {post.upvotes}</p>
      <Link to={'/post/${post.id}'} className = "view-post-link">View Post</Link>
    </div>
  );
};
  
export default App;