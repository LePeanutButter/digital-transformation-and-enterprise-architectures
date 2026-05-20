import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Stream from './Stream';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');
const mockGetPosts = api.getPosts;

describe('Stream Component', () => {
  const mockPosts = [
    {
      id: 1,
      content: 'First post',
      user: {
        id: 1,
        username: 'user1',
        displayName: 'User One',
        picture: 'https://example.com/avatar1.jpg'
      },
      createdAt: '2024-04-17T10:00:00Z'
    },
    {
      id: 2,
      content: 'Second post',
      user: {
        id: 2,
        username: 'user2',
        displayName: 'User Two',
        picture: 'https://example.com/avatar2.jpg'
      },
      createdAt: '2024-04-17T09:30:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockGetPosts.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Stream />);
    
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  test('renders posts successfully', async () => {
    mockGetPosts.mockResolvedValue({ posts: mockPosts });
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('Public Stream')).toBeInTheDocument();
    });
    
    // Check that posts are rendered
    expect(screen.getByText('First post')).toBeInTheDocument();
    expect(screen.getByText('Second post')).toBeInTheDocument();
    expect(screen.getByText('@user1')).toBeInTheDocument();
    expect(screen.getByText('@user2')).toBeInTheDocument();
  });

  test('renders empty state when no posts', async () => {
    mockGetPosts.mockResolvedValue({ posts: [] });
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('No posts yet. Be the first to share something!')).toBeInTheDocument();
    });
  });

  test('renders error state when API fails', async () => {
    mockGetPosts.mockRejectedValue(new Error('API Error'));
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  test('retries fetching posts when retry button is clicked', async () => {
    mockGetPosts
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({ posts: mockPosts });
    
    render(<Stream />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeInTheDocument();
    });
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    
    // Should show posts after retry
    await waitFor(() => {
      expect(screen.getByText('First post')).toBeInTheDocument();
    });
    
    expect(mockGetPosts).toHaveBeenCalledTimes(2);
  });

  test('displays posts in correct order', async () => {
    mockGetPosts.mockResolvedValue({ posts: mockPosts });
    
    render(<Stream />);
    
    await waitFor(() => {
      const posts = screen.getAllByTestId('post-card');
      expect(posts).toHaveLength(2);
      
      // First post should be first (newest)
      expect(posts[0]).toHaveTextContent('First post');
      expect(posts[1]).toHaveTextContent('Second post');
    });
  });

  test('shows loading state during retry', async () => {
    mockGetPosts
      .mockRejectedValueOnce(new Error('API Error'))
      .mockImplementationOnce(() => new Promise(() => {})); // Never resolves for retry
    
    render(<Stream />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeInTheDocument();
    });
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    
    // Should show loading state again
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  test('handles malformed API response gracefully', async () => {
    mockGetPosts.mockResolvedValue({ posts: null });
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('No posts yet. Be the first to share something!')).toBeInTheDocument();
    });
  });

  test('handles posts without user data', async () => {
    const postsWithMissingUser = [
      {
        id: 1,
        content: 'Post without user',
        user: null,
        createdAt: '2024-04-17T10:00:00Z'
      }
    ];
    
    mockGetPosts.mockResolvedValue({ posts: postsWithMissingUser });
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('Post without user')).toBeInTheDocument();
    });
  });

  test('handles posts with missing user properties', async () => {
    const postsWithPartialUser = [
      {
        id: 1,
        content: 'Post with partial user',
        user: {
          id: 1,
          username: 'user1'
          // Missing displayName and picture
        },
        createdAt: '2024-04-17T10:00:00Z'
      }
    ];
    
    mockGetPosts.mockResolvedValue({ posts: postsWithPartialUser });
    
    render(<Stream />);
    
    await waitFor(() => {
      expect(screen.getByText('Post with partial user')).toBeInTheDocument();
      expect(screen.getByText('@user1')).toBeInTheDocument();
    });
  });
});
