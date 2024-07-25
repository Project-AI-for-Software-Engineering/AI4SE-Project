import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UpdateProfile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage(''); // Clear previous messages

    try {
      // Obtain the access token
      const token = await getAccessTokenSilently({
        audience: 'https://dev-3pjtuh5txz1sg5lc.us.auth0.com/api/v2/',
        scope: 'update:users',
      });

      // Log the token and user ID for debugging
      console.log('Token:', token);
      console.log('User ID:', user.sub);

      // Set up the PATCH request
      const response = await fetch(`https://dev-3pjtuh5txz1sg5lc.us.auth0.com/api/v2/users/${user.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      // Check the response
      const responseBody = await response.text();
      console.log('Response:', responseBody);

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${responseBody}`);
      }

      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage(`Error updating profile: ${error.message}`);
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProfile;
