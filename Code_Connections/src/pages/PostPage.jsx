import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { DateTime } from "luxon";
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";


const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setPost(data);
      fetchProfilePicture(data.owner_id);
  
      const storedUpvotes = JSON.parse(localStorage.getItem("upvotedPosts")) || {};
      if (user) {
        setHasUpvoted(storedUpvotes[user.uid]?.[id] || false);
      }
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
      const commentsWithPFP = await Promise.all(data.map(async (comment) => {
        const userRef = doc(db, 'users', comment.owner_id);
        const userSnap = await getDoc(userRef);
  
        return {
          ...comment,
          profilePicture: userSnap.exists() ? userSnap.data().profilePicture : '/default-pfp.png'
        };
      }));
  
      setComments(commentsWithPFP);
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
    if (!user) return;
  
    const newUpvoteCount = hasUpvoted ? post.upvotes - 1 : post.upvotes + 1;
  
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: newUpvoteCount })
      .eq('id', id)
      .select()
      .single();
  
    if (!error) {
      setPost(data);
      setHasUpvoted(!hasUpvoted);
  
      let storedUpvotes = JSON.parse(localStorage.getItem("upvotedPosts")) || {};
  
      if (!storedUpvotes[user.uid]) {
        storedUpvotes[user.uid] = {};
      }
  
      storedUpvotes[user.uid][id] = !hasUpvoted;
      
      localStorage.setItem("upvotedPosts", JSON.stringify(storedUpvotes));
    }
  };

  const handleDeletePost = async () => {
    if (!post || user?.uid !== post.owner_id) return;
  
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
  
    if (!error) {
      try {
        console.log("Post deleted successfully. Updating Firestore...");
  
        const userRef = doc(db, "users", post.owner_id);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const currentPosts = userSnap.data().numberOfPosts || 0;
          const newPostCount = Math.max(currentPosts - 1, 0);
  
          console.log(`Current posts: ${currentPosts}, New posts: ${newPostCount}`);
  
          await updateDoc(userRef, { numberOfPosts: newPostCount });
  
          console.log("Firestore successfully updated!");
        } else {
          console.error("User document not found in Firestore.");
        }
      } catch (err) {
        console.error("Error updating user post count:", err);
      }
  
      navigate('/');
    } else {
      console.error('Error deleting post:', error);
    }
  };
  
  
  

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
          <h3>
            Posted by: 
            <Link to={`/users/${post.owner_name}`} 
              style={{ textDecoration: 'none', color: 'inherit', marginLeft: '5px'}}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
              {post.owner_name || "Unknown"}
            </Link>
          </h3>
            {profilePicture && (
              <Link to={`/users/${post.owner_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  style={{ width: '35px', height: '35px', borderRadius: '50%', marginBottom: '1px'}} 
                />
              </Link>
            )}
          </div>
          <h3>Posted on: {formattedDate}</h3>
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
        </div>
        <div className="upvote-section">
          <button 
            onClick={handleUpvote} 
            className={`upvote-button ${hasUpvoted ? 'upvoted' : ''}`}
          >
            Upvote
          </button>
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
                <div key={comment.id} className="comment" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <p  style={{ display: 'inline-block'}}>Posted by: {comment.owner_name || "Unknown"}</p>
                    <img 
                    src={comment.profilePicture} 
                    alt="Profile" 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginBottom: '-10px', marginLeft: '10px' }} 
                  />
                    <p>{comment.content}</p>
                    <small>Posted on: {formattedCommentDate}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`post-content ${!post.image_url ? 'no-image' : ''}`}>
        <p>{post.content}</p>
      </div>
      
      {post.image_url && (
        <div className="post-image">
          <img src={post.image_url} alt="Post" />
        </div>
      )}
      
      
    </div>
  );
};

export default PostPage;
