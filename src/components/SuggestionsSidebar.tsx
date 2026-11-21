import React from 'react';
import { useInstagram } from '../context/InstagramContext';
import { BadgeCheck } from 'lucide-react';

export const SuggestionsSidebar: React.FC = () => {
  const { currentUser, users, toggleFollowUser, setActiveTab, theme } = useInstagram();

  return (
    <aside className="hidden lg:block w-80 pl-8 pt-4">
      {/* Current User Card */}
      <div className="flex items-center justify-between mb-5">
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-xs group-hover:underline">
                {currentUser.username}
              </span>
              {currentUser.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
              )}
            </div>
            <span className="text-[11px] text-neutral-400 block truncate max-w-[150px]">
              {currentUser.fullName}
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition"
        >
          Переключить
        </button>
      </div>

      {/* Recommendations Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral-400">Рекомендации для вас</span>
        <button
          onClick={() => setActiveTab('explore')}
          className="text-[11px] font-semibold text-neutral-300 hover:text-white"
        >
          Все
        </button>
      </div>

      {/* Suggested Users */}
      <div className="space-y-3 mb-6">
        {users.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-xs hover:underline cursor-pointer">
                    {user.username}
                  </span>
                  {user.isVerified && (
                    <BadgeCheck className="w-3 h-3 text-blue-500" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {user.isFollowing ? 'Подписаны' : 'Популярно в сети'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleFollowUser(user.id)}
              className={`text-xs font-semibold transition ${
                user.isFollowing
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-blue-500 hover:text-blue-400'
              }`}
            >
              {user.isFollowing ? 'Подписки' : 'Подписаться'}
            </button>
          </div>
        ))}
      </div>

      {/* Instagram Footer Links */}
      <div className="text-[11px] text-neutral-500 space-y-3 leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>Информация</span>
          <span>•</span>
          <span>Помощь</span>
          <span>•</span>
          <span>Пресса</span>
          <span>•</span>
          <span>API</span>
          <span>•</span>
          <span>Вакансии</span>
          <span>•</span>
          <span>Конфиденциальность</span>
          <span>•</span>
          <span>Условия</span>
          <span>•</span>
          <span>Места</span>
          <span>•</span>
          <span>Язык</span>
        </div>
        <div>© 2026 YOURGRAM FROM META</div>
      </div>
    </aside>
  );
};
