import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { supabase } from '../client';
import { DateTime } from "luxon";
import { useAuth } from '../AuthContext';

const UserProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUserData(userData);
          fetchUserPosts(userData.uid);
        } else {
          console.error("User not found");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
      setLoading(false);
    };

    const fetchUserPosts = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, upvotes, created_at, language_flair, categories')
          .eq('owner_id', userId);
    
        if (error) {
          throw error;
        }
    
        setUserPosts(data || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    

    fetchUserProfile();
  }, [username]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) return <p style={{ color: 'white' }}>Loading profile...</p>;
  if (!userData) return <p style={{ color: 'white' }}>User not found.</p>;

  return (
    <div className="view-profile">
      <h1>{userData.username}'s Profile</h1>
      <img 
        src={userData.profilePicture || 'https://via.placeholder.com/100'} 
        alt="Profile" 
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />
      <p><strong>Last Seen:</strong> {formatLastSeen(userData.lastSeen)}</p>
      <p><strong>Number of Posts:</strong> {userPosts.length}</p>
      <p><strong>Bio:</strong> {userData.bio ? userData.bio : "No bio available."}</p>

      {user && user.username === userData.username && (
        <Link 
          to="/edit-profile" 
          style={{ 
            display: 'inline-block', 
            marginTop: '10px', 
            padding: '10px 15px', 
            backgroundColor: '#744bfa', 
            color: 'black', 
            borderRadius: '5px', 
            textDecoration: 'none', 
            fontWeight: 'bold' 
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'white'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#744bfa'}
        >
          Edit Profile
        </Link>
      )}
{userPosts.length > 0 ? (
  <div style={{ marginTop: '20px' }}>
    <h2>{userData.username}'s Posts:</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
      {userPosts.map(post => {
        const formattedDate = DateTime.fromISO(post.created_at)
          .setZone("America/New_York")
          .toLocaleString(DateTime.DATETIME_MED);

        return (
          <div className="view-profile-posts" key={post.id} style={{ padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div>
              <h3>
                <Link to={`/users/${userData.username}`}>
                  <img 
                    src={userData.profilePicture || 'https://via.placeholder.com/50'} 
                    alt="User Profile" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px', marginBottom: '-20px'}} 
                  />
                </Link>
                <Link to={`/post/${post.id}`} className="view-profile-posts-titles"
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                  {post.title}
                </Link>
              </h3>

              <p>
                By <Link to={`/users/${userData.username}`} style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                  {userData.username}
                </Link> • {formattedDate}
              </p>

              <p>▲ {post.upvotes}</p>

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

              <Link to={`/post/${post.id}`} style={{ display: 'inline-block', color: 'inherit'}}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                View Post
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
) : (
  <p style={{ marginTop: '20px', fontSize: '16px' }}><em>This user has not made any posts yet.</em></p>
)}

    </div>
  );
};

export default UserProfile;
