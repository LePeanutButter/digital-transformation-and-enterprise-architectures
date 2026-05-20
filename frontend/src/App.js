import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Stream from './components/Stream';
import CreatePost from './components/CreatePost';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Left Sidebar - Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="main-content">
        <Header />
        <div className="feed-container">
          {isAuthenticated && <CreatePost />}
          <Stream />
        </div>
      </div>
      
      {/* Right Sidebar - Search & Trends */}
      <RightSidebar />
    </div>
  );
}

export default App;
