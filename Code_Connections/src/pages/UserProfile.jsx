import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
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
          setUserData(userDoc.data());
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
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>{userData.username}'s Profile</h1>
      <img 
        src={userData.profilePicture || 'https://via.placeholder.com/100'} 
        alt="Profile" 
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />
      <p><strong>Last Seen:</strong> {formatLastSeen(userData.lastSeen)}</p>
      <p><strong>Number of Posts:</strong> {userData.numberOfPosts || 0}</p>

      {/* ✅ Added Bio Section */}
      <p><strong>Bio:</strong> {userData.bio ? userData.bio : "No bio available."}</p>
    </div>
  );
};

export default UserProfile;
