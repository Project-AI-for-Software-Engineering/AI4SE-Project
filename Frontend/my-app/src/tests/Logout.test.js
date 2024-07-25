
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/LogoutButton';

// Mock de useAuth0 para controlar el comportamiento de Auth0 en las pruebas
jest.mock('@auth0/auth0-react');

describe('LogoutButton', () => {
  it('renders the logout button and calls logout on click', () => {
    // Mock de la función logout
    const logout = jest.fn();
    useAuth0.mockReturnValue({
      logout,
    });

    // Renderizar el componente LogoutButton
    render(<LogoutButton className="logout-button" />);

    // Verificar que el botón de logout está en el documento
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    // Simular un clic en el botón de logout
    fireEvent.click(logoutButton);

    // Verificar que logout fue llamado
    expect(logout).toHaveBeenCalled();
  });
});
