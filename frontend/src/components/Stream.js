import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import PostCard from './PostCard';

const Stream = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getPosts();
      setPosts(data.posts || []);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  if (loading) {
    return (
      <div className="feed-container">
        {/* Loading Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="post-card">
            <div className="post-header">
              <div className="skeleton-avatar"></div>
              <div className="post-content-wrapper">
                <div className="skeleton skeleton-text w-32 mb-2"></div>
                <div className="skeleton skeleton-text w-full h-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="post-card">
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">{error}</div>
            <button 
              onClick={fetchPosts}
              className="text-blue-500 hover:text-blue-400 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-container">
        <div className="post-card">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something with the world!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Stream;
