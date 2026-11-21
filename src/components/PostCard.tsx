import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  BadgeCheck,
  Share2,
  Copy,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Post } from '../types/instagram';
import { useInstagram } from '../context/InstagramContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    toggleLikePost,
    toggleSavePost,
    addComment,
    toggleFollowUser,
    setActivePostDetail,
    startConversationWith,
    theme,
  } = useInstagram();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Double tap to like handler
  const lastTapRef = useRef<number>(0);
  const handleMediaClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger heart burst
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
      if (!post.isLiked) {
        toggleLikePost(post.id);
      }
    }
    lastTapRef.current = now;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const copyPostLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
    setShowMoreMenu(false);
  };

  const mediaUrls = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : [''];

  return (
    <article
      className={`w-full max-w-xl mx-auto rounded-xl border mb-6 transition-colors overflow-hidden ${
        theme === 'dark'
          ? 'bg-black border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-neutral-700 animate-in fade-in">
          Ссылка скопирована в буфер обмена!
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center space-x-3">
          <div className="p-[1.5px] rounded-full instagram-gradient-border cursor-pointer">
            <div className={`p-[1.5px] rounded-full ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-sm hover:underline cursor-pointer">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              )}
              <span className="text-neutral-500 text-xs">• {post.createdAt}</span>
            </div>
            {post.location && (
              <span className="text-xs text-neutral-500 hover:underline cursor-pointer">
                {post.location}
              </span>
            )}
          </div>
        </div>

        {/* More options button */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu((prev) => !prev)}
            className="p-1 rounded-full hover:bg-neutral-800/10 transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* More Dropdown Menu */}
          {showMoreMenu && (
            <div
              className={`absolute right-0 top-8 w-48 rounded-xl shadow-xl border z-20 py-1 ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white'
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <button
                onClick={copyPostLink}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs hover:bg-neutral-800/10 text-left"
              >
                <Copy className="w-4 h-4" />
                <span>Копировать ссылку</span>
              </button>

              <button
                onClick={() => {
                  startConversationWith(post.user);
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs hover:bg-neutral-800/10 text-left"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться в Direct</span>
              </button>

              {post.user.id !== 'current_user' && (
                <button
                  onClick={() => {
                    toggleFollowUser(post.user.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs hover:bg-neutral-800/10 text-left font-semibold text-pink-500"
                >
                  {post.user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Отписаться</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Подписаться</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Image / Carousel */}
      <div
        className="relative w-full bg-black select-none overflow-hidden flex items-center justify-center cursor-pointer"
        style={{
          aspectRatio:
            post.aspectRatio === 'portrait'
              ? '4 / 5'
              : post.aspectRatio === 'landscape'
              ? '16 / 9'
              : '1 / 1',
        }}
        onClick={handleMediaClick}
      >
        <img
          src={mediaUrls[currentMediaIndex]}
          alt="Post media"
          style={
            post.filterStyle
              ? {
                  filter: `brightness(${post.filterStyle.brightness ?? 100}%) contrast(${
                    post.filterStyle.contrast ?? 100
                  }%) saturate(${post.filterStyle.saturate ?? 100}%) sepia(${
                    post.filterStyle.sepia ?? 0
                  }%) grayscale(${post.filterStyle.grayscale ?? 0}%)`,
                }
              : undefined
          }
          className="w-full h-full object-cover"
        />

        {/* Double-tap Burst Heart Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-ping scale-150 transform transition duration-500">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </div>
          </div>
        )}

        {/* Carousel arrows */}
        {mediaUrls.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentMediaIndex < mediaUrls.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
              {mediaUrls.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    currentMediaIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="px-3.5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            {/* Like Heart */}
            <button
              onClick={() => toggleLikePost(post.id)}
              aria-label="Нравится"
              className="group active:scale-75 transition-transform"
            >
              <Heart
                className={`w-6 h-6 stroke-[1.8] transition-colors ${
                  post.isLiked
                    ? 'text-red-500 fill-red-500 scale-110'
                    : 'group-hover:text-neutral-400'
                }`}
              />
            </button>

            {/* Comment */}
            <button
              onClick={() => commentInputRef.current?.focus()}
              aria-label="Комментировать"
              className="active:scale-90 transition-transform"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8] hover:text-neutral-400" />
            </button>

            {/* Share / Direct */}
            <button
              onClick={() => startConversationWith(post.user)}
              aria-label="Поделиться"
              className="active:scale-90 transition-transform"
            >
              <Send className="w-6 h-6 stroke-[1.8] hover:text-neutral-400" />
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => toggleSavePost(post.id)}
            aria-label="Сохранить"
            className="active:scale-90 transition-transform"
          >
            <Bookmark
              className={`w-6 h-6 stroke-[1.8] transition-colors ${
                post.isSaved ? 'text-amber-500 fill-amber-500' : 'hover:text-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-1.5">
          {post.likesCount.toLocaleString()} отметок «Нравится»
        </div>

        {/* Caption */}
        <div className="text-sm leading-relaxed mb-1.5">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span>
            {isCaptionExpanded || post.caption.length <= 90
              ? post.caption
              : `${post.caption.slice(0, 90)}... `}
          </span>
          {post.caption.length > 90 && !isCaptionExpanded && (
            <button
              onClick={() => setIsCaptionExpanded(true)}
              className="text-neutral-500 hover:text-neutral-400 text-xs ml-1 font-medium"
            >
              ещё
            </button>
          )}
        </div>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-blue-500 hover:underline cursor-pointer"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        {/* Comments Count / Detail Link */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setActivePostDetail(post)}
            className="text-neutral-500 text-xs mb-2 block hover:underline"
          >
            Посмотреть все {post.commentsCount} комментариев
          </button>
        )}

        {/* Latest 2 Comments Preview */}
        {post.comments && post.comments.length > 0 && (
          <div className="space-y-1 mb-2">
            {post.comments.slice(-2).map((comment) => (
              <div key={comment.id} className="text-xs flex items-baseline space-x-1.5">
                <span className="font-semibold">{comment.user.username}</span>
                <span className="text-neutral-600 dark:text-neutral-300">{comment.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Input Bar */}
      <form
        onSubmit={handleCommentSubmit}
        className={`flex items-center px-3.5 py-2.5 border-t ${
          theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
        }`}
      >
        <button
          type="button"
          onClick={() => setCommentText((prev) => prev + ' 😍')}
          className="mr-2 text-neutral-400 hover:text-neutral-200"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          ref={commentInputRef}
          type="text"
          placeholder="Добавьте комментарий..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-transparent text-xs focus:outline-none placeholder-neutral-500"
        />

        {commentText.trim() && (
          <button
            type="submit"
            className="text-xs font-semibold text-pink-500 hover:text-pink-400 transition"
          >
            Опубликовать
          </button>
        )}
      </form>
    </article>
  );
};
