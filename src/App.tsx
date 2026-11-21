import React from 'react';
import { InstagramProvider, useInstagram } from './context/InstagramContext';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FeedTab } from './components/FeedTab';
import { ExploreTab } from './components/ExploreTab';
import { ReelsTab } from './components/ReelsTab';
import { DirectTab } from './components/DirectTab';
import { NotificationsFlyout } from './components/NotificationsFlyout';
import { ProfileTab } from './components/ProfileTab';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';

const AppContent: React.FC = () => {
  const { activeTab, theme } = useInstagram();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-20 xl:ml-64 min-h-screen">
        {activeTab === 'home' && <FeedTab />}
        {activeTab === 'explore' && <ExploreTab />}
        {activeTab === 'reels' && <ReelsTab />}
        {activeTab === 'messages' && <DirectTab />}
        {activeTab === 'notifications' && <NotificationsFlyout />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Modals & Overlays */}
      <StoryViewerModal />
      <CreateStoryModal />
      <CreatePostModal />
      <PostDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <InstagramProvider>
      <AppContent />
    </InstagramProvider>
  );
}
