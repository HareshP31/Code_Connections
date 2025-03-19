import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading users...</p>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#FFD700" }}>All Users</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid white",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor: "#1a1a1a",
            }}
          >
            <Link to={`/users/${user.username}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img
                src={user.profilePicture || "https://via.placeholder.com/100"}
                alt="Profile"
                style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0px", marginTop: '10px' }}
              />
              <h3
                style={{ color: "#FFD700", marginBottom: "0px" }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {user.username}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
