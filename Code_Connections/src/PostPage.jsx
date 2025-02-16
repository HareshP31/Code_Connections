import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from './client';
import { DateTime } from "luxon";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if(error) {
      console.error('Error fetching post:', error);
    } 
    else {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true});

    if (error) {
      console.error('Error fetching comments:', error);
    } 
    else {
      setComments(data);
    }
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error upvoting:', error);
    } 
    else {
      setPost(data[0]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return;
    }
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { post_id: id, content: newComment },
      ]);
    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments([...comments, data[0]]);
      setNewComment('');
    }
  };

  const handleDeletePost = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  if (!post) {
    return <p>Loading post...</p>;
  }

  const formattedDate = DateTime.fromISO(post.created_at)
  .setZone("America/New_York")
  .toLocaleString(DateTime.DATETIME_MED);

  return (
    <div className="post-page">
        <h1>{post.title}</h1>
        <p>Posted on: {formattedDate}</p>
        <p>{post.content}</p>
        <div className="upvote-section">
          <button onClick={handleUpvote}>Upvote</button>
          <span>Upvotes: {post.upvotes}</span>
        </div>
        <div className="post-actions">
          <Link to={`/update/${post.id}`} className="edit-link">Edit Post</Link>
          <button onClick={handleDeletePost} className="delete-button">Delete Post</button>
        </div>  
        <div className="comments-section">
          <h2>Comments</h2>
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            ></textarea>
          </form>
          {comments.length === 0 ? (
          <p>No comments yet.</p>
          ) : (
          comments.map(comment => {
            const formattedCommentDate = DateTime.fromISO(comment.created_at)
            .setZone("America/New_York")
            .toLocaleString(DateTime.DATETIME_MED);
            return (
            <div key={comment.id} className="comment">
              <p>{comment.content}</p>
              <small>Posted on: {formattedCommentDate}</small>
            </div>
          );
          })
        )}
        </div>      
    </div>
  );
};
  
export default PostPage;