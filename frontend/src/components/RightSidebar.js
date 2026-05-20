import React, { useState } from 'react';

const RightSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const trends = [
    {
      category: 'Technology',
      name: '#AI',
      posts: '12.5K posts'
    },
    {
      category: 'Trending in Tech',
      name: '#WebDevelopment',
      posts: '8.2K posts'
    },
    {
      category: 'Trending',
      name: '#React',
      posts: '6.7K posts'
    },
    {
      category: 'Technology',
      name: '#JavaScript',
      posts: '4.3K posts'
    },
    {
      category: 'Trending',
      name: '#Programming',
      posts: '3.8K posts'
    }
  ];

  const suggestions = [
    {
      name: 'John Developer',
      handle: '@johndev',
      avatar: null
    },
    {
      name: 'Jane Coder',
      handle: '@janecode',
      avatar: null
    },
    {
      name: 'Tech Enthusiast',
      handle: '@techenthusiast',
      avatar: null
    }
  ];

  return (
    <div className="right-sidebar">
      {/* Search Bar */}
      <div className="search-bar">
        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Trends Section */}
      <div className="trends-section">
        <h2 className="trends-header">Trends for you</h2>
        
        {trends.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-category">{trend.category}</div>
            <div className="trend-name">{trend.name}</div>
            <div className="trend-posts">{trend.posts}</div>
          </div>
        ))}
        
        <div className="show-more">
          Show more
        </div>
      </div>

      {/* Who to Follow */}
      <div className="trends-section mt-4">
        <h2 className="trends-header">Who to follow</h2>
        
        {suggestions.map((suggestion, index) => (
          <div key={index} className="trend-item">
            <div className="flex items-center space-x-3">
              {suggestion.avatar ? (
                <img 
                  src={suggestion.avatar} 
                  alt={suggestion.name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600"></div>
              )}
              <div className="flex-1">
                <div className="font-semibold">{suggestion.name}</div>
                <div className="text-gray-500 text-sm">{suggestion.handle}</div>
              </div>
              <button className="bg-white text-black px-4 py-1.5 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
        
        <div className="show-more">
          Show more
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 px-4 text-xs text-gray-500 space-y-1">
        <div className="flex flex-wrap gap-x-2">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Ads info</a>
          <a href="#" className="hover:underline">More</a>
        </div>
        <div className="mt-2">
          © 2024 TDSE Twitter Clone
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
