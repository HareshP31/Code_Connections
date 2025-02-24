import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { DateTime } from "luxon";
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setPost(data);
      fetchProfilePicture(data.owner_id);
    }
  };

  const fetchProfilePicture = async (ownerId) => {
    if (!ownerId) return;
    const userRef = doc(db, 'users', ownerId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setProfilePicture(userSnap.data().profilePicture);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (!error) {
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!user) return; 
    
    if (newComment.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }
  
    const { data, error } = await supabase
      .from('comments')
      .insert([{ 
        post_id: id, 
        content: newComment, 
        created_at: new Date().toISOString(),
        owner_id: user.uid, 
        owner_name: user.username 
      }]);
  
    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNewComment(""); 
      fetchComments(); 
    }
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error upvoting:', error);
    } 
    else {
      setPost(data);
    }
  };

  const handleDeletePost = async () => {
    if (!post || user?.uid !== post.owner_id) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

      if (!error) {
        navigate('/');
      }
      else 
      {
        console.error('Error deleting post:', error);
      }
    }

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  if (!post) {
    return <p>Loading post...</p>;
  }

  const formattedDate = DateTime.fromISO(post.created_at)
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_MED);

  return (
    <div className="post-page">
        <div className="post-interactions">
        <div className="header-info">
          <h1>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            <h3>Posted by: {post.owner_name || "Unknown"}</h3>
            {profilePicture && (
              <img 
                src={profilePicture} 
                alt="Profile" 
                style={{ width: '35px', height: '35px', borderRadius: '50%', marginBottom: '35px'}} 
              />
            )}
          </div>
          <h3>Posted on: {formattedDate}</h3>
        </div>
        <div className="upvote-section">
          <button onClick={handleUpvote}>Upvote</button>
          <span>Upvotes: {post.upvotes}</span>
        </div>

        {user && user.uid === post.owner_id && (
          <div className="post-actions">
            <Link to={`/update/${post.id}`} className="edit-link">Edit Post</Link>
            <button onClick={handleDeletePost} className="delete-button">Delete Post</button>
          </div>
        )}

        <div className="comments-section">
          <h2>Comments</h2>

          {user ? (
            <div>
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Add a comment..." 
                required
              />
              <button onClick={handleAddComment}>Post Comment</button>
            </div>
          ) : (
            <p>You must be logged in to comment.</p>
          )}

          {comments.length === 0 ? <p>No comments yet.</p> : (
            comments.map(comment => {
              const formattedCommentDate = DateTime.fromISO(comment.created_at)
                .setZone("America/New_York")
                .toLocaleString(DateTime.DATETIME_MED);
              return (
                <div key={comment.id} className="comment">
                  <p>Posted by: {comment.owner_name || "Unknown"}</p>
                  <p>{comment.content}</p>
                  <small>Posted on: {formattedCommentDate}</small>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      <div className="post-image">
        {post.image_url && <img src={post.image_url} alt="Post" />}
      </div>

      
      
    </div>
  );
};

export default PostPage;
