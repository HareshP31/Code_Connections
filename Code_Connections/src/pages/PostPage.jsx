import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { DateTime } from "luxon";
import { useAuth } from '../AuthContext';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setPost(data);
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

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (!error) {
      setPost(data);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return;
    }
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: newComment }]);

    if (!error) {
      setComments([...comments, data[0]]);
      setNewComment('');
    }
  };

  const handleDeletePost = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (!error) {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
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
      {post.image_url && <img src={post.image_url} alt="Post" />}
      <p>{post.content}</p>

      <div className="upvote-section">
        <button onClick={handleUpvote}>Upvote</button>
        <span>Upvotes: {post.upvotes}</span>
      </div>

      {user && (
        <div className="post-actions">
          <Link to={`/update/${post.id}`} className="edit-link">Edit Post</Link>
          <button onClick={handleDeletePost} className="delete-button">Delete Post</button>
        </div>
      )}

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
