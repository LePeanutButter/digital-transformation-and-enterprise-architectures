import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Auth0Context } from '@auth0/auth0-react';
import CreatePost from './CreatePost';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');
const mockCreatePost = api.createPost;

// Mock Auth0 context
const mockAuth0Context = {
  getAccessTokenSilently: jest.fn(),
  user: {
    name: 'Test User',
    email: 'test@example.com'
  },
  isAuthenticated: true
};

const renderWithAuth0 = (component, auth0Context = mockAuth0Context) => {
  return render(
    <Auth0Context.Provider value={auth0Context}>
      {component}
    </Auth0Context.Provider>
  );
};

describe('CreatePost Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create post form', () => {
    renderWithAuth0(<CreatePost />);
    
    expect(screen.getByPlaceholderText('What\'s happening?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
    expect(screen.getByText('0/140')).toBeInTheDocument();
  });

  test('updates character count as user types', () => {
    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    
    expect(screen.getByText('11/140')).toBeInTheDocument();
  });

  test('shows warning color when approaching character limit', () => {
    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    fireEvent.change(textarea, { target: { value: 'a'.repeat(125) } });
    
    const characterCount = screen.getByText('125/140');
    expect(characterCount).toHaveClass('warning');
  });

  test('shows danger color when exceeding character limit', () => {
    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    fireEvent.change(textarea, { target: { value: 'a'.repeat(141) } });
    
    const characterCount = screen.getByText('141/140');
    expect(characterCount).toHaveClass('danger');
  });

  test('disables submit button when content is empty', () => {
    renderWithAuth0(<CreatePost />);
    
    const submitButton = screen.getByRole('button', { name: 'Post' });
    expect(submitButton).toBeDisabled();
  });

  test('disables submit button when content exceeds 140 characters', () => {
    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    fireEvent.change(textarea, { target: { value: 'a'.repeat(141) } });
    
    const submitButton = screen.getByRole('button', { name: 'Post' });
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when content is valid', () => {
    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    fireEvent.change(textarea, { target: { value: 'Valid post content' } });
    
    const submitButton = screen.getByRole('button', { name: 'Post' });
    expect(submitButton).not.toBeDisabled();
  });

  test('shows error message when trying to submit empty post', async () => {
    renderWithAuth0(<CreatePost />);
    
    const submitButton = screen.getByRole('button', { name: 'Post' });
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    
    // Try to submit empty form
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Post content cannot be empty')).toBeInTheDocument();
    });
  });

  test('shows error message when trying to submit post with only whitespace', async () => {
    renderWithAuth0(<CreatePost />);
    
    const submitButton = screen.getByRole('button', { name: 'Post' });
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Post content cannot be empty')).toBeInTheDocument();
    });
  });

  test('successfully creates and submits a valid post', async () => {
    const mockToken = 'mock-jwt-token';
    mockAuth0Context.getAccessTokenSilently.mockResolvedValue(mockToken);
    mockCreatePost.mockResolvedValue({ id: 1, content: 'Test post' });

    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    const submitButton = screen.getByRole('button', { name: 'Post' });
    
    fireEvent.change(textarea, { target: { value: 'Test post' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith(
        { content: 'Test post' },
        mockToken
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
    });

    // Check that textarea is cleared after successful submission
    expect(textarea).toHaveValue('');
  });

  test('shows error message when API call fails', async () => {
    const mockToken = 'mock-jwt-token';
    mockAuth0Context.getAccessTokenSilently.mockResolvedValue(mockToken);
    mockCreatePost.mockRejectedValue(new Error('API Error'));

    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    const submitButton = screen.getByRole('button', { name: 'Post' });
    
    fireEvent.change(textarea, { target: { value: 'Test post' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create post. Please try again.')).toBeInTheDocument();
    });
  });

  test('shows loading state while submitting', async () => {
    const mockToken = 'mock-jwt-token';
    mockAuth0Context.getAccessTokenSilently.mockResolvedValue(mockToken);
    
    // Make the API call take some time
    mockCreatePost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    const submitButton = screen.getByRole('button', { name: 'Post' });
    
    fireEvent.change(textarea, { target: { value: 'Test post' } });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('Posting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('clears success message after 3 seconds', async () => {
    jest.useFakeTimers();
    
    const mockToken = 'mock-jwt-token';
    mockAuth0Context.getAccessTokenSilently.mockResolvedValue(mockToken);
    mockCreatePost.mockResolvedValue({ id: 1, content: 'Test post' });

    renderWithAuth0(<CreatePost />);
    
    const textarea = screen.getByPlaceholderText('What\'s happening?');
    const submitButton = screen.getByRole('button', { name: 'Post' });
    
    fireEvent.change(textarea, { target: { value: 'Test post' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
    });

    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(screen.queryByText('Post created successfully!')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
