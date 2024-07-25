import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UpdateProfile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`/api/update-profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Handle successful update, maybe refetch user data or show a success message
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};

export default UpdateProfile;
