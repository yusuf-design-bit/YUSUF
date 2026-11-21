import React, { useState } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  UserCheck,
  Settings,
  Plus,
  BadgeCheck,
  Heart,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { EditProfileModal } from './EditProfileModal';

const STORY_HIGHLIGHTS = [
  {
    id: 'h1',
    title: 'Travel ✈️',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'h2',
    title: 'Kyoto 🏮',
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'h3',
    title: 'Studio 🎨',
    cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'h4',
    title: 'Coffee ☕️',
    cover: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
  },
];

export const ProfileTab: React.FC = () => {
  const { currentUser, posts, reels, setActivePostDetail, theme } = useInstagram();
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // User's own posts
  const userPosts = posts.filter((p) => p.user.id === currentUser.id);
  // User's saved posts
  const savedPosts = posts.filter((p) => p.isSaved);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 pb-8 border-b border-neutral-800/40">
        {/* Large Avatar with story gradient */}
        <div className="relative group cursor-pointer flex-shrink-0">
          <div className="p-1 rounded-full instagram-gradient-border">
            <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover"
              />
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="absolute bottom-1 right-1 p-2 rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition"
            title="Редактировать фото"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Details */}
        <div className="flex-1 flex flex-col items-center md:items-start space-y-4">
          {/* Top row: username & action buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-xl font-bold flex items-center space-x-1.5">
              <span>{currentUser.username}</span>
              {currentUser.isVerified && (
                <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/20" />
              )}
            </h2>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
              }`}
            >
              Редактировать профиль
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Ссылка на профиль скопирована!');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                  : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
              }`}
            >
              Поделиться
            </button>

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="p-1.5 rounded-xl hover:bg-neutral-800/10 text-neutral-400"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Followers / Following Stats */}
          <div className="flex items-center space-x-8 text-sm">
            <div>
              <span className="font-bold mr-1">{currentUser.postsCount}</span>
              <span className="text-neutral-400">публикаций</span>
            </div>
            <div>
              <span className="font-bold mr-1">
                {currentUser.followersCount.toLocaleString()}
              </span>
              <span className="text-neutral-400">подписчиков</span>
            </div>
            <div>
              <span className="font-bold mr-1">
                {currentUser.followingCount.toLocaleString()}
              </span>
              <span className="text-neutral-400">подписок</span>
            </div>
          </div>

          {/* Bio section */}
          <div className="text-xs md:text-sm text-center md:text-left space-y-1">
            <div className="font-semibold">{currentUser.fullName}</div>
            <p className="whitespace-pre-line leading-relaxed text-neutral-600 dark:text-neutral-300">
              {currentUser.bio}
            </p>
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-blue-500 hover:underline font-medium text-xs pt-1"
              >
                <span>{currentUser.website.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights Bar */}
      <div className="flex items-center space-x-5 overflow-x-auto no-scrollbar py-6 border-b border-neutral-800/40">
        {STORY_HIGHLIGHTS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer space-y-1.5 group"
          >
            <div className="p-0.5 rounded-full border border-neutral-600 group-hover:scale-105 transition-transform">
              <div className={`p-0.5 rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white">
              {item.title}
            </span>
          </div>
        ))}

        {/* Add Highlight */}
        <div
          onClick={() => alert('Создание нового актуального')}
          className="flex flex-col items-center flex-shrink-0 cursor-pointer space-y-1.5"
        >
          <div className="w-16 h-16 rounded-full border border-dashed border-neutral-600 flex items-center justify-center hover:border-pink-500 transition">
            <Plus className="w-5 h-5 text-neutral-400" />
          </div>
          <span className="text-[11px] font-medium text-neutral-400">Новое</span>
        </div>
      </div>

      {/* Sub Tabs: Posts | Reels | Saved | Tagged */}
      <div className="flex items-center justify-center space-x-10 text-xs font-semibold uppercase tracking-wider py-3 border-b border-neutral-800/20">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
            activeSubTab === 'posts'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Публикации</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
            activeSubTab === 'reels'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center space-x-2 pb-2 transition border-b-2 ${
            activeSubTab === 'saved'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Сохраненное</span>
        </button>
      </div>

      {/* Posts Grid */}
      {activeSubTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1 md:gap-3 pt-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePostDetail(post)}
                className="relative group aspect-square bg-neutral-900 rounded-md md:rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt="User post"
                  style={
                    post.filterStyle
                      ? {
                          filter: `brightness(${post.filterStyle.brightness ?? 100}%) contrast(${
                            post.filterStyle.contrast ?? 100
                          }%) saturate(${post.filterStyle.saturate ?? 100}%)`,
                        }
                      : undefined
                  }
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />

                {/* Hover stats */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-semibold text-sm">
                  <div className="flex items-center space-x-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-neutral-400 text-sm">
              Пока нет публикаций. Нажмите «Создать публикацию», чтобы поделиться первым моментом!
            </div>
          )}
        </div>
      )}

      {/* Reels Grid */}
      {activeSubTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1 md:gap-3 pt-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative aspect-[9/16] bg-neutral-900 rounded-md md:rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={reel.thumbnail}
                alt="Reel"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white text-xs font-semibold drop-shadow">
                <Film className="w-3.5 h-3.5" />
                <span>{reel.likesCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved Posts Grid */}
      {activeSubTab === 'saved' && (
        <div className="grid grid-cols-3 gap-1 md:gap-3 pt-4">
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePostDetail(post)}
                className="relative group aspect-square bg-neutral-900 rounded-md md:rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt="Saved post"
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 text-white font-semibold text-xs">
                  <Bookmark className="w-5 h-5 fill-white text-white" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-neutral-400 text-sm">
              Нет сохраненных публикаций. Сохраняйте фото и видео, чтобы посмотреть их позже.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />
      )}
    </div>
  );
};
