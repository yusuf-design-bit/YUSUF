import React, { useState } from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Sun,
  Moon,
  Menu,
  Instagram,
  Settings,
  Bookmark,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { ActiveTab } from '../types/instagram';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    theme,
    toggleTheme,
    unreadMessagesCount,
    unreadNotificationsCount,
    setIsCreatePostOpen,
    setIsCreateStoryOpen,
    markNotificationsAsRead,
  } = useInstagram();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleTabClick = (tab: ActiveTab) => {
    if (tab === 'notifications') {
      markNotificationsAsRead();
    }
    setActiveTab(tab);
    setIsMoreMenuOpen(false);
  };

  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: 'Главная',
      icon: <Home className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      id: 'explore',
      label: 'Интересное',
      icon: <Compass className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      id: 'reels',
      label: 'Reels',
      icon: <Film className="w-6 h-6 stroke-[1.8]" />,
    },
    {
      id: 'messages',
      label: 'Сообщения',
      icon: <MessageCircle className="w-6 h-6 stroke-[1.8]" />,
      badge: unreadMessagesCount,
    },
    {
      id: 'notifications',
      label: 'Уведомления',
      icon: <Heart className="w-6 h-6 stroke-[1.8]" />,
      badge: unreadNotificationsCount,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen z-40 border-r transition-all duration-300 ${
        isSearchExpanded ? 'w-20' : 'w-20 xl:w-64'
      } ${
        theme === 'dark'
          ? 'bg-black border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900'
      } px-3 py-6`}
    >
      {/* Top Section */}
      <div className="flex flex-col space-y-6">
        {/* yourgram Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer px-3 py-2 flex items-center space-x-3 group"
        >
          <div className="p-1 rounded-xl group-hover:scale-105 transition-transform">
            <Instagram className="w-7 h-7 text-pink-600 xl:hidden" />
          </div>
          <span className="hidden xl:block text-2xl font-bold font-instagram-brand tracking-wide bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent lowercase">
            yourgram
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-150 group relative text-left w-full ${
                  isActive
                    ? 'font-bold scale-[1.02]'
                    : 'font-normal opacity-90 hover:opacity-100'
                } ${
                  theme === 'dark'
                    ? 'hover:bg-neutral-900 text-neutral-100'
                    : 'hover:bg-neutral-100 text-neutral-900'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-black animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="hidden xl:block text-base">{item.label}</span>
              </button>
            );
          })}

          {/* Create Button */}
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-150 text-left w-full ${
              theme === 'dark'
                ? 'hover:bg-neutral-900 text-neutral-100'
                : 'hover:bg-neutral-100 text-neutral-900'
            }`}
          >
            <PlusSquare className="w-6 h-6 stroke-[1.8] text-pink-500" />
            <span className="hidden xl:block text-base font-semibold">Создать публикацию</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-150 text-left w-full ${
              activeTab === 'profile'
                ? 'font-bold scale-[1.02]'
                : 'opacity-90 hover:opacity-100'
            } ${
              theme === 'dark'
                ? 'hover:bg-neutral-900 text-neutral-100'
                : 'hover:bg-neutral-100 text-neutral-900'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className={`w-6 h-6 rounded-full object-cover ${
                activeTab === 'profile' ? 'ring-2 ring-pink-500' : 'ring-1 ring-neutral-400'
              }`}
            />
            <span className="hidden xl:block text-base truncate">
              {currentUser.username}
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: Theme & More Settings */}
      <div className="relative">
        {/* More Menu Dropdown */}
        {isMoreMenuOpen && (
          <div
            className={`absolute bottom-16 left-0 w-60 rounded-2xl shadow-2xl p-2 border z-50 animate-in fade-in slide-in-from-bottom-2 ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <span className="flex items-center space-x-3">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
              </span>
              <span className="text-xs opacity-60 uppercase">{theme}</span>
            </button>

            <button
              onClick={() => {
                setIsCreateStoryOpen(true);
                setIsMoreMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <PlusSquare className="w-4 h-4 text-emerald-400" />
              <span>Добавить в историю</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsMoreMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Сохраненное</span>
            </button>

            <div className={`my-1 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`} />

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить демо-данные</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMoreMenuOpen((prev) => !prev)}
          className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-150 w-full ${
            theme === 'dark'
              ? 'hover:bg-neutral-900 text-neutral-100'
              : 'hover:bg-neutral-100 text-neutral-900'
          }`}
        >
          <Menu className="w-6 h-6 stroke-[1.8]" />
          <span className="hidden xl:block text-base">Ещё</span>
        </button>
      </div>
    </aside>
  );
};
