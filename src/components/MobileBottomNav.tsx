import React from 'react';
import { Home, Compass, PlusSquare, Film } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { ActiveTab } from '../types/instagram';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, theme, setIsCreatePostOpen } = useInstagram();

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 w-full z-40 border-t flex items-center justify-around py-2 px-1 backdrop-blur-md transition-colors ${
        theme === 'dark'
          ? 'bg-black/95 border-neutral-800 text-white'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      }`}
    >
      <button
        onClick={() => setActiveTab('home')}
        className={`p-2 rounded-lg transition-transform active:scale-90 ${
          activeTab === 'home' ? 'font-bold scale-105' : 'opacity-80'
        }`}
      >
        <Home className="w-6 h-6 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setActiveTab('explore')}
        className={`p-2 rounded-lg transition-transform active:scale-90 ${
          activeTab === 'explore' ? 'font-bold scale-105' : 'opacity-80'
        }`}
      >
        <Compass className="w-6 h-6 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="p-2 rounded-lg transition-transform active:scale-90 text-pink-500"
      >
        <PlusSquare className="w-7 h-7 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setActiveTab('reels')}
        className={`p-2 rounded-lg transition-transform active:scale-90 ${
          activeTab === 'reels' ? 'font-bold scale-105' : 'opacity-80'
        }`}
      >
        <Film className="w-6 h-6 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className="p-2 rounded-lg transition-transform active:scale-90"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.username}
          className={`w-6 h-6 rounded-full object-cover ${
            activeTab === 'profile' ? 'ring-2 ring-pink-500' : 'ring-1 ring-neutral-400'
          }`}
        />
      </button>
    </nav>
  );
};
