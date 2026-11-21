import React from 'react';
import { Heart, MessageCircle, Sun, Moon } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const MobileHeader: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    unreadMessagesCount,
    unreadNotificationsCount,
    markNotificationsAsRead,
  } = useInstagram();

  const handleNotificationsClick = () => {
    markNotificationsAsRead();
    setActiveTab('notifications');
  };

  return (
    <header
      className={`md:hidden sticky top-0 left-0 w-full z-30 px-4 py-2.5 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
        theme === 'dark'
          ? 'bg-black/90 border-neutral-800 text-white'
          : 'bg-white/90 border-neutral-200 text-neutral-900'
      }`}
    >
      <div
        onClick={() => setActiveTab('home')}
        className="cursor-pointer text-2xl font-bold font-instagram-brand tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent lowercase"
      >
        yourgram
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-full hover:bg-neutral-800/10 active:scale-95 transition"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
        </button>

        <button
          onClick={handleNotificationsClick}
          aria-label="Notifications"
          className="relative p-1.5 rounded-full hover:bg-neutral-800/10 active:scale-95 transition"
        >
          <Heart className={`w-6 h-6 stroke-[1.8] ${activeTab === 'notifications' ? 'fill-red-500 text-red-500' : ''}`} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-black" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          aria-label="Messages"
          className="relative p-1.5 rounded-full hover:bg-neutral-800/10 active:scale-95 transition"
        >
          <MessageCircle className={`w-6 h-6 stroke-[1.8] ${activeTab === 'messages' ? 'text-pink-500' : ''}`} />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-black">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
