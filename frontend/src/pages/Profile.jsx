import React, { useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    state: 'Maharashtra',
    district: 'Nashik',
    landHolding: '2.5 acres',
    cropType: 'Wheat'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="page-container">
      <h2>My Profile</h2>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">👨‍🌾</div>
          <h3>{profile.name}</h3>
          <button onClick={handleEdit}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{profile.phone}</span>
          </div>
          <div className="detail-item">
            <label>State:</label>
            <span>{profile.state}</span>
          </div>
          <div className="detail-item">
            <label>District:</label>
            <span>{profile.district}</span>
          </div>
          <div className="detail-item">
            <label>Land Holding:</label>
            <span>{profile.landHolding}</span>
          </div>
          <div className="detail-item">
            <label>Primary Crop:</label>
            <span>{profile.cropType}</span>
          </div>
        </div>

        <div className="profile-section">
          <h4>My Applications</h4>
          <p>No active applications yet. <a href="/schemes">Apply for schemes</a></p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
