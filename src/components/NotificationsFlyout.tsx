import React from 'react';
import { Heart, MessageCircle, UserPlus, Check, X } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const NotificationsFlyout: React.FC = () => {
  const {
    notifications,
    toggleFollowUser,
    setActiveTab,
    markNotificationsAsRead,
    theme,
  } = useInstagram();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800/40 mb-4">
        <h2 className="text-xl font-bold">Уведомления</h2>
        <button
          onClick={markNotificationsAsRead}
          className="text-xs text-pink-500 hover:text-pink-400 font-semibold"
        >
          Прочитать все
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center justify-between p-3 rounded-xl transition ${
                !notif.isRead
                  ? theme === 'dark'
                    ? 'bg-neutral-900/80'
                    : 'bg-neutral-100'
                  : 'hover:bg-neutral-800/10'
              }`}
            >
              {/* Left: Avatar with type badge */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={notif.user.avatar}
                    alt={notif.user.username}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-pink-600 text-white shadow">
                    {notif.type === 'like' && <Heart className="w-3 h-3 fill-white" />}
                    {notif.type === 'comment' && <MessageCircle className="w-3 h-3 fill-white" />}
                    {notif.type === 'follow' && <UserPlus className="w-3 h-3" />}
                  </div>
                </div>

                {/* Text snippet */}
                <div className="text-xs">
                  <p className="leading-snug">
                    <span className="font-semibold mr-1">{notif.user.username}</span>
                    <span className="text-neutral-400">{notif.text}</span>
                  </p>
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    {notif.createdAt}
                  </span>
                </div>
              </div>

              {/* Right: Action button or Target Post Thumbnail */}
              <div>
                {notif.type === 'follow' ? (
                  <button
                    onClick={() => toggleFollowUser(notif.user.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition ${
                      notif.user.isFollowing
                        ? 'bg-neutral-800 text-white'
                        : 'bg-pink-600 hover:bg-pink-500 text-white'
                    }`}
                  >
                    {notif.user.isFollowing ? 'Подписки' : 'В ответ'}
                  </button>
                ) : notif.targetPost ? (
                  <img
                    src={notif.targetPost.mediaUrl}
                    alt="Target post"
                    className="w-10 h-10 rounded-lg object-cover ring-1 ring-neutral-700"
                  />
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-neutral-400 text-xs">
            У вас пока нет новых уведомлений.
          </div>
        )}
      </div>
    </div>
  );
};
