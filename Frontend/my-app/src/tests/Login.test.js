import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';

// Mock de useAuth0 para controlar el comportamiento de Auth0 en las pruebas
jest.mock('@auth0/auth0-react');

describe('LoginButton', () => {
  it('renders the login button and calls loginWithRedirect on click', () => {
    // Mock de la función loginWithRedirect
    const loginWithRedirect = jest.fn();
    useAuth0.mockReturnValue({
      loginWithRedirect,
    });

    // Renderizar el componente LoginButton
    render(<LoginButton className="login-button" />);

    // Verificar que el botón de login está en el documento
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    // Simular un clic en el botón de login
    fireEvent.click(loginButton);

    // Verificar que loginWithRedirect fue llamado
    expect(loginWithRedirect).toHaveBeenCalled();
  });
});
