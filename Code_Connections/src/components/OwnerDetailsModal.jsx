import React, { useEffect, useRef } from 'react';

const OwnerDetailsModal = ({ ownerDetails, onClose }) => {
  if (!ownerDetails) return null;

  const modalRef = useRef(null); // Reference for modal content

  // Function to handle clicks outside the modal content
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Close the modal
    }
  };

  // Attach event listener when modal is open
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Convert Firestore timestamp to a readable format (without seconds)
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown"; // Handle missing timestamp

    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Ensures AM/PM format
    }); 
  };

  return (
    <div 
      className="modal" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <div 
        ref={modalRef} 
        className="modal-content" 
        style={{ position: 'relative', padding: '20px', backgroundColor: '#000000e8', borderRadius: '10px' }}
      >
        {/* Close Button */}
        <span 
          className="close" 
          onClick={onClose} 
          style={{ position: 'absolute', right: '15px', top: '10px', cursor: 'pointer', fontSize: '20px', color: 'white' }}
        >
          &times;
        </span>

        {/* Header: Profile Picture, Username, View Profile & Last Seen */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Profile Picture */}
          {ownerDetails.profilePicture && (
            <img 
              src={ownerDetails.profilePicture} 
              alt="Profile" 
              className="profile-picture" 
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          )}

          {/* User Info */}
          <div>
            {/* Username */}
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              {ownerDetails.username}
            </h2>

            {/* View Profile Link */}
            <a
                style={{ margin: '5px 0', fontSize: '14px', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} // Add underline on hover
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'} >
              View Profile
            </a>

            {/* Last Seen */}
            <p style={{ margin: 0, color: 'white', fontSize: '14px' }}>
              <strong>Last Seen:</strong> {formatLastSeen(ownerDetails.lastSeen)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDetailsModal;
