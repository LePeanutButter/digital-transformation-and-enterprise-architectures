import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const navItems = [
    { icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', label: 'Home', active: true },
    { icon: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z', label: 'Explore', active: false },
    { icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5-.7 1.23-1.5 2.42-2.5 3.5l1.5 1.5c1.08-1 2.27-1.8 3.5-2.5 1.46 1.49 3.21 3 5.5 3 2.3 0 4.05-1.5 5.5-3 1.23.7 2.42 1.5 3.5 2.5l1.5-1.5c-1-1.08-1.8-2.27-2.5-3.5z', label: 'Notifications', active: false },
    { icon: 'M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z', label: 'Messages', active: false },
    { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile', active: false },
  ];

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="sidebar">
      <div className="nav-sidebar">
        {/* Logo */}
        <div className="nav-item mb-8">
          <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.05-2.579-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.067 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
          </svg>
        </div>

        {/* Navigation Items */}
        {navItems.map((item, index) => (
          <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="nav-text">{item.label}</span>
          </div>
        ))}

        {/* Post Button */}
        <div className="mt-4">
          <button className="post-button w-full">
            Post
          </button>
        </div>

        {/* User Section */}
        {isAuthenticated && user && (
          <div className="mt-auto pt-4 border-t border-gray-800">
            <div className="nav-item">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600"></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user.name || 'User'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  @{user.nickname || 'user'}
                </div>
              </div>
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {/* Login/Logout Button */}
        {!isAuthenticated && (
          <div className="mt-auto pt-4">
            <button 
              onClick={() => loginWithRedirect()}
              className="post-button w-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
