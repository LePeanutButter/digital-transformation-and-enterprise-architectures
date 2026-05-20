import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    content: 'This is a test post',
    user: {
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      picture: 'https://example.com/avatar.jpg'
    },
    createdAt: '2024-04-17T10:00:00Z'
  };

  test('renders post content', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
  });

  test('renders user information', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Posted by Test User')).toBeInTheDocument();
  });

  test('renders user avatar when picture is available', () => {
    render(<PostCard post={mockPost} />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test User');
  });

  test('does not render avatar when user picture is not available', () => {
    const postWithoutPicture = {
      ...mockPost,
      user: {
        ...mockPost.user,
        picture: null
      }
    };
    
    render(<PostCard post={postWithoutPicture} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('displays username when displayName is not available', () => {
    const postWithoutDisplayName = {
      ...mockPost,
      user: {
        ...mockPost.user,
        displayName: null
      }
    };
    
    render(<PostCard post={postWithoutDisplayName} />);
    
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Posted by testuser')).toBeInTheDocument();
  });

  test('handles missing user data gracefully', () => {
    const postWithoutUser = {
      ...mockPost,
      user: null
    };
    
    render(<PostCard post={postWithoutUser} />);
    
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Posted by')).toBeInTheDocument();
  });

  test('formats timestamp correctly - "Just now"', () => {
    const now = new Date();
    const postJustNow = {
      ...mockPost,
      createdAt: now.toISOString()
    };
    
    render(<PostCard post={postJustNow} />);
    
    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  test('formats timestamp correctly - minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const postFiveMinutesAgo = {
      ...mockPost,
      createdAt: fiveMinutesAgo.toISOString()
    };
    
    render(<PostCard post={postFiveMinutesAgo} />);
    
    expect(screen.getByText('5m ago')).toBeInTheDocument();
  });

  test('formats timestamp correctly - hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const postTwoHoursAgo = {
      ...mockPost,
      createdAt: twoHoursAgo.toISOString()
    };
    
    render(<PostCard post={postTwoHoursAgo} />);
    
    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  test('formats timestamp correctly - days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const postThreeDaysAgo = {
      ...mockPost,
      createdAt: threeDaysAgo.toISOString()
    };
    
    render(<PostCard post={postThreeDaysAgo} />);
    
    expect(screen.getByText('3d ago')).toBeInTheDocument();
  });

  test('formats timestamp correctly - date for older posts', () => {
    const oldDate = new Date('2024-01-01T10:00:00Z');
    const oldPost = {
      ...mockPost,
      createdAt: oldDate.toISOString()
    };
    
    render(<PostCard post={oldPost} />);
    
    expect(screen.getByText(oldDate.toLocaleDateString())).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<PostCard post={mockPost} />);
    
    const postCard = screen.getByText('This is a test post').closest('.post-card');
    expect(postCard).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-4', 'mb-4', 'border', 'border-gray-200');
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveClass('w-10', 'h-10', 'rounded-full', 'mr-3');
  });

  test('renders with long post content', () => {
    const longContent = 'a'.repeat(200);
    const longPost = {
      ...mockPost,
      content: longContent
    };
    
    render(<PostCard post={longPost} />);
    
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  test('renders with special characters in content', () => {
    const specialContent = 'Post with émojis & special chars! @#$%^&*()';
    const specialPost = {
      ...mockPost,
      content: specialContent
    };
    
    render(<PostCard post={specialPost} />);
    
    expect(screen.getByText(specialContent)).toBeInTheDocument();
  });

  test('renders with multiline content', () => {
    const multilineContent = 'First line\nSecond line\nThird line';
    const multilinePost = {
      ...mockPost,
      content: multilineContent
    };
    
    render(<PostCard post={multilinePost} />);
    
    expect(screen.getByText(multilineContent)).toBeInTheDocument();
  });

  test('handles invalid date gracefully', () => {
    const postWithInvalidDate = {
      ...mockPost,
      createdAt: 'invalid-date'
    };
    
    render(<PostCard post={postWithInvalidDate} />);
    
    // Should not crash and should still render content
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  test('handles missing createdAt gracefully', () => {
    const postWithoutCreatedAt = {
      ...mockPost,
      createdAt: null
    };
    
    render(<PostCard post={postWithoutCreatedAt} />);
    
    // Should not crash and should still render content
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });
});
