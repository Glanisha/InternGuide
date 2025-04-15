import React, { useState } from 'react';
import StudentProfile from "./StudentProfile";
import UpdateProfile from "./UpdateProfile";
import MyApplications from './MyApplications';

const ProfilePage = () => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  return (
    <div className="space-y-4">
      <StudentProfile />
      
      <button
        onClick={() => setShowUpdateProfile(!showUpdateProfile)}
        className={`text-sm px-3 py-1 rounded-md ${
          showUpdateProfile
            ? 'bg-red-500/20 text-red-400'
            : 'bg-blue-500/20 text-blue-400'
        }`}
      >
        {showUpdateProfile ? '✕ Cancel' : 'Edit Profile'}
      </button>

      {showUpdateProfile && <UpdateProfile />}

      <div className="pt-2 border-t border-white/10">
        <MyApplications />
      </div>
    </div>
  );
};

export default ProfilePage;