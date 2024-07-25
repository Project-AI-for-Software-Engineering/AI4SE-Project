import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Button1 from './Button1'; // Importa el nuevo botón
import Button2 from './Button2'; // Importa el segundo nuevo botón
import Profile from './Profile';
import '../css/Home.css';
import backgroundImage from '../assets/images/background-image.png'; 

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="title">Sports Bet App</h1>
      <div className="main-content">
        <div className="buttons-column">
          {isAuthenticated ? (
            <>
              <LogoutButton className="logout-button" />
              <Button1 className="additional-button" />
              <Button2 className="additional-button" />
            </>
          ) : (
            <LoginButton className="login-button" />
          )}
        </div>
        {isAuthenticated && (
          <div className="profile-column">
            <h2>Profile Info</h2>
            <Profile className="profile-button" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



