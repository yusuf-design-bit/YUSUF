import React, { useState } from 'react';
import { Search, Film, Heart, MessageCircle, X } from 'lucide-react';
import { EXPLORE_POSTS, OTHER_USERS } from '../data/initialData';
import { useInstagram } from '../context/InstagramContext';
import { Post } from '../types/instagram';

const EXPLORE_CATEGORIES = [
  'Все',
  'Архитектура',
  'Путешествия',
  'Дизайн',
  'Еда',
  'Природа',
  'Стиль',
  'Технологии',
];

export const ExploreTab: React.FC = () => {
  const { posts, setActivePostDetail, setActiveTab, toggleFollowUser, theme } = useInstagram();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  // Combine pre-made explore posts with user-created posts for rich exploration
  const allExploreItems = [
    ...posts.map((p) => ({
      id: p.id,
      mediaUrl: p.mediaUrls[0],
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      type: 'photo' as const,
      caption: p.caption,
      tags: p.tags.map((t) => t.replace('#', '')),
      originalPost: p,
    })),
    ...EXPLORE_POSTS.map((ep) => ({
      ...ep,
      originalPost: {
        id: ep.id,
        user: OTHER_USERS[Math.floor(Math.random() * OTHER_USERS.length)],
        mediaUrls: [ep.mediaUrl],
        aspectRatio: 'square' as const,
        caption: ep.caption,
        tags: ep.tags.map((t) => `#${t}`),
        likesCount: ep.likesCount,
        isLiked: false,
        isSaved: false,
        commentsCount: ep.commentsCount,
        comments: [],
        createdAt: 'Недавно',
      } as Post,
    })),
  ];

  // Filter items
  const filteredItems = allExploreItems.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Все' ||
      item.caption.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  // Filtered users matching search
  const matchedUsers = searchTerm.trim()
    ? OTHER_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 md:px-6 py-4 pb-20">
      {/* Search Header */}
      <div className="relative mb-4">
        <div
          className={`flex items-center px-4 py-2.5 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-neutral-900 border-neutral-800 text-white focus-within:border-neutral-600'
              : 'bg-neutral-100 border-neutral-200 text-neutral-900 focus-within:border-neutral-400'
          }`}
        >
          <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Поиск по аккаунтам, хэштегам или темам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Search Results Dropdown */}
        {searchTerm.trim() && matchedUsers.length > 0 && (
          <div
            className={`absolute top-14 left-0 right-0 z-30 rounded-2xl shadow-2xl border p-2 ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800 text-white'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="text-xs font-semibold px-3 py-1.5 text-neutral-400 uppercase">
              Аккаунты
            </div>
            {matchedUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/10 transition"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-xs">{u.username}</div>
                    <div className="text-[11px] text-neutral-400">{u.fullName}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollowUser(u.id)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                    u.isFollowing
                      ? 'bg-neutral-800 text-white'
                      : 'bg-pink-600 text-white hover:bg-pink-500'
                  }`}
                >
                  {u.isFollowing ? 'Подписки' : 'Подписаться'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar mb-5 py-1">
        {EXPLORE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow'
                : theme === 'dark'
                ? 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Explore Grid (3-column responsive with Instagram hover stats) */}
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {filteredItems.map((item, idx) => {
          // Every 6th item can be tall / featured
          const isFeatured = idx % 9 === 2;

          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                if (item.type === 'reel') {
                  setActiveTab('reels');
                } else if (item.originalPost) {
                  setActivePostDetail(item.originalPost);
                }
              }}
              className={`relative group cursor-pointer overflow-hidden rounded-md md:rounded-lg bg-neutral-900 ${
                isFeatured ? 'row-span-2 col-span-2' : 'aspect-square'
              }`}
            >
              <img
                src={item.mediaUrl}
                alt="Explore item"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Reel Indicator Icon */}
              {item.type === 'reel' && (
                <div className="absolute top-2 right-2 text-white drop-shadow p-1">
                  <Film className="w-4 h-4" />
                </div>
              )}

              {/* Hover Overlay with Likes & Comments count */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-6 text-white font-semibold text-sm">
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{item.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{item.commentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
