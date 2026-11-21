import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
  Trash2,
  BadgeCheck,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const PostDetailModal: React.FC = () => {
  const {
    activePostDetail,
    setActivePostDetail,
    toggleLikePost,
    toggleSavePost,
    addComment,
    deleteComment,
    currentUser,
    startConversationWith,
    theme,
  } = useInstagram();

  const [commentInput, setCommentInput] = useState('');

  if (!activePostDetail) return null;

  const post = activePostDetail;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-8 animate-in fade-in duration-200">
      {/* Close button outside */}
      <button
        onClick={() => setActivePostDetail(null)}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className={`relative w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden border flex flex-col md:flex-row ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Left: Media View */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden">
          <img
            src={post.mediaUrls[0]}
            alt="Post content"
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
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right: Comments & Actions Sidebar */}
        <div
          className={`w-full md:w-2/5 flex flex-col h-full border-t md:border-t-0 md:border-l ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-3.5 border-b ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-pink-500"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-xs">{post.user.username}</span>
                  {post.user.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                {post.location && (
                  <span className="text-[10px] text-neutral-400 block">{post.location}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActivePostDetail(null)}
              className="md:hidden p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Author caption as first comment */}
            <div className="flex items-start space-x-3">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-7 h-7 rounded-full object-cover mt-0.5"
              />
              <div className="flex-1">
                <p className="leading-relaxed">
                  <span className="font-semibold mr-1.5">{post.user.username}</span>
                  <span>{post.caption}</span>
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-neutral-400 mt-1">
                  <span>{post.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Other comments */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => {
                const isOwnComment = c.user.id === currentUser.id;
                return (
                  <div key={c.id} className="flex items-start space-x-3 group">
                    <img
                      src={c.user.avatar}
                      alt={c.user.username}
                      className="w-7 h-7 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="leading-relaxed">
                        <span className="font-semibold mr-1.5">{c.user.username}</span>
                        <span>{c.text}</span>
                      </p>
                      <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-1">
                        <span>{c.createdAt}</span>
                        {isOwnComment && (
                          <button
                            onClick={() => deleteComment(post.id, c.id)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-neutral-400 text-xs">
                Пока нет комментариев. Будьте первыми!
              </div>
            )}
          </div>

          {/* Action Row */}
          <div
            className={`p-3.5 border-t ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className="active:scale-90 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 stroke-[1.8] ${
                      post.isLiked ? 'text-red-500 fill-red-500' : 'hover:text-neutral-400'
                    }`}
                  />
                </button>
                <button
                  onClick={() => startConversationWith(post.user)}
                  className="hover:text-neutral-400"
                >
                  <Send className="w-6 h-6 stroke-[1.8]" />
                </button>
              </div>

              <button
                onClick={() => toggleSavePost(post.id)}
                className="hover:text-neutral-400"
              >
                <Bookmark
                  className={`w-6 h-6 stroke-[1.8] ${
                    post.isSaved ? 'text-amber-500 fill-amber-500' : ''
                  }`}
                />
              </button>
            </div>

            <div className="font-semibold text-xs mb-1">
              {post.likesCount.toLocaleString()} отметок «Нравится»
            </div>
            <div className="text-[10px] text-neutral-400 uppercase">{post.createdAt}</div>
          </div>

          {/* Add Comment Input */}
          <form
            onSubmit={handleAddComment}
            className={`flex items-center px-3.5 py-3 border-t ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setCommentInput((prev) => prev + ' 🔥')}
              className="mr-2 text-neutral-400 hover:text-white"
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Добавьте комментарий..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-transparent text-xs focus:outline-none placeholder-neutral-500"
            />
            {commentInput.trim() && (
              <button
                type="submit"
                className="text-xs font-semibold text-pink-500 hover:text-pink-400"
              >
                Опубликовать
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
