import React, { useState } from 'react';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
  };

  return (
    <div className="post-card" data-testid="post-card">
      <div className="post-header">
        {/* User Avatar */}
        <div className="post-avatar-large">
          {post.user?.picture ? (
            <img 
              src={post.user.picture} 
              alt={post.user.displayName || post.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Post Content */}
        <div className="post-content-wrapper">
          {/* User Info */}
          <div className="post-author-info">
            <span className="post-author-name">
              {post.user?.displayName || post.user?.username || 'Unknown User'}
            </span>
            <span className="post-author-handle">
              @{post.user?.username || 'user'}
            </span>
            <span className="post-time">·</span>
            <span className="post-time">
              {formatDate(post.createdAt)}
            </span>
          </div>
          
          {/* Post Text */}
          <div className="post-content">
            {post.content}
          </div>
          
          {/* Post Actions */}
          <div className="post-footer">
            {/* Reply */}
            <button className="post-action">
              <svg className="post-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="post-action-count">
                {Math.floor(Math.random() * 50)}
              </span>
            </button>
            
            {/* Retweet */}
            <button className="post-action">
              <svg className="post-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="post-action-count">
                {Math.floor(Math.random() * 30)}
              </span>
            </button>
            
            {/* Like */}
            <button 
              className={`post-action like ${isLiked ? 'text-pink-500' : ''}`}
              onClick={handleLike}
            >
              <svg className="post-action-icon" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="post-action-count">
                {likeCount}
              </span>
            </button>
            
            {/* Share */}
            <button className="post-action">
              <svg className="post-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
