import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../config';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${config.app.backend_url()}/auth/profile`);
      setProfile(response.data);
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default Profile;