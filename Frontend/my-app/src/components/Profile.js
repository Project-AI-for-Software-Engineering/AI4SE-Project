import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user } = useAuth0();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <img src={user.picture} alt={user.name || 'User picture'} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
