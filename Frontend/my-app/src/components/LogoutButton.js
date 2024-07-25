import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = ({ className }) => {
  const { logout } = useAuth0();

  return (
    <button className={className} onClick={() => logout()}>
      Logout
    </button>
  );
};

export default LogoutButton;
