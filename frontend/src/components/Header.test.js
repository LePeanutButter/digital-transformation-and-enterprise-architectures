import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Auth0Context } from '@auth0/auth0-react';
import Header from './Header';

// Mock Auth0 context
const createMockAuth0Context = (isAuthenticated = false, user = null) => ({
  isAuthenticated,
  user,
  loginWithRedirect: jest.fn(),
  logout: jest.fn()
});

const renderWithAuth0 = (component, auth0Context) => {
  return render(
    <Auth0Context.Provider value={auth0Context}>
      {component}
    </Auth0Context.Provider>
  );
};

describe('Header Component', () => {
  test('renders logo', () => {
    const auth0Context = createMockAuth0Context();
    renderWithAuth0(<Header />, auth0Context);
    
    expect(screen.getByText('TDSE Twitter')).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    const auth0Context = createMockAuth0Context(false);
    renderWithAuth0(<Header />, auth0Context);
    
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('shows user info and logout button when authenticated', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  test('displays user avatar when authenticated and picture is available', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test User');
  });

  test('does not display avatar when user picture is not available', () => {
    const mockUser = {
      name: 'Test User'
      // No picture property
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('calls loginWithRedirect when login button is clicked', () => {
    const auth0Context = createMockAuth0Context(false);
    renderWithAuth0(<Header />, auth0Context);
    
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);
    
    expect(auth0Context.loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  test('calls logout when logout button is clicked', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);
    
    expect(auth0Context.logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin }
    });
  });

  test('displays user name when authenticated', () => {
    const mockUser = {
      name: 'John Doe',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('handles missing user name gracefully', () => {
    const mockUser = {
      picture: 'https://example.com/avatar.jpg'
      // No name property
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    // Should not crash and should still show logout button
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('applies correct CSS classes to user info section', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    const userInfoContainer = screen.getByText('Test User').closest('div');
    expect(userInfoContainer).toHaveClass('flex', 'items-center', 'space-x-3');
  });

  test('applies correct CSS classes to avatar', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveClass('w-8', 'h-8', 'rounded-full');
  });

  test('applies correct CSS classes to login button', () => {
    const auth0Context = createMockAuth0Context(false);
    renderWithAuth0(<Header />, auth0Context);
    
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toHaveClass('login-button');
  });

  test('applies correct CSS classes to logout button', () => {
    const mockUser = {
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    };
    const auth0Context = createMockAuth0Context(true, mockUser);
    renderWithAuth0(<Header />, auth0Context);
    
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toHaveClass('logout-button');
  });
});
