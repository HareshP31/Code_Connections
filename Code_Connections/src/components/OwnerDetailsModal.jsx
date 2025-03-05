import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerDetailsModal = ({ ownerDetails, onClose }) => {
  if (!ownerDetails) return null;

  const navigate = useNavigate();
  const modalRef = useRef(null);


  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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

  const goToProfile = () => {
    navigate(`/users/${ownerDetails.username}`);
    onClose();
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
        <span 
          className="close" 
          onClick={onClose} 
          style={{ position: 'absolute', right: '15px', top: '10px', cursor: 'pointer', fontSize: '20px', color: 'white' }}
        >
          &times;
        </span>

        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {ownerDetails.profilePicture && (
            <img 
              src={ownerDetails.profilePicture} 
              alt="Profile" 
              className="profile-picture" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }} 
              onClick={goToProfile} 
            />
          )}


          <div>

            <h2 style={{ margin: 0, fontSize: '20px', cursor: 'pointer'}} onClick={goToProfile} >
              {ownerDetails.username}
            </h2>


            <p 
              onClick={goToProfile} 
              style={{ margin: '5px 0', fontSize: '14px', cursor: 'pointer', color: 'inherit' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} 
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'} 
            >
              View Profile
            </p>


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
