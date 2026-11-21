import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music2,
  ChevronUp,
  ChevronDown,
  X,
  BadgeCheck,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const ReelsTab: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleFollowUser,
    startConversationWith,
    theme,
  } = useInstagram();

  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<{ id: string; user: string; text: string }[]>([
    { id: '1', user: 'alex_creator', text: 'This vibe is unmatched! 🌊' },
    { id: '2', user: 'marcus_architect', text: 'Cinematography on point! 🔥' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentReel = reels[currentReelIndex] || reels[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until user interacts
      });
    }
  }, [currentReelIndex]);

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNextReel();
      if (e.key === 'ArrowUp') handlePrevReel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex]);

  // Double tap to like
  const lastTapRef = useRef<number>(0);
  const handleVideoTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
      if (!currentReel.isLiked) {
        toggleLikeReel(currentReel.id);
      }
    } else {
      // Toggle play / pause or sound
      setIsMuted((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList((prev) => [
      ...prev,
      { id: Date.now().toString(), user: 'alex_creator', text: commentText.trim() },
    ]);
    setCommentText('');
  };

  if (!currentReel) return null;

  return (
    <div className="w-full h-[calc(100vh-60px)] md:h-screen flex items-center justify-center p-2 md:p-6 pb-20 md:pb-6 select-none relative">
      {/* Up/Down Desktop Floating Buttons */}
      <div className="hidden md:flex flex-col space-y-3 absolute right-12 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrevReel}
          disabled={currentReelIndex === 0}
          className={`p-3 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition backdrop-blur shadow-lg ${
            currentReelIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextReel}
          disabled={currentReelIndex === reels.length - 1}
          className={`p-3 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition backdrop-blur shadow-lg ${
            currentReelIndex === reels.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Main Reels Card (9:16 aspect ratio) */}
      <div className="relative w-full max-w-[420px] h-full max-h-[760px] rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col justify-between border border-neutral-800">
        {/* Video Player */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleVideoTap}
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            poster={currentReel.thumbnail}
            loop
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Sound status indicator top left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Double tap heart burst */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="animate-ping">
                <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
              </div>
            </div>
          )}
        </div>

        {/* Right Vertical Action Bar */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center space-y-4 text-white">
          {/* Author avatar */}
          <div className="relative">
            <img
              src={currentReel.user.avatar}
              alt={currentReel.user.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
          </div>

          {/* Like */}
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="flex flex-col items-center group active:scale-75 transition-transform"
          >
            <div className="p-2 rounded-full bg-black/40 backdrop-blur">
              <Heart
                className={`w-7 h-7 stroke-[1.8] ${
                  currentReel.isLiked ? 'text-red-500 fill-red-500 scale-110' : ''
                }`}
              />
            </div>
            <span className="text-xs font-semibold mt-1">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setIsCommentDrawerOpen(true)}
            className="flex flex-col items-center group active:scale-90 transition-transform"
          >
            <div className="p-2 rounded-full bg-black/40 backdrop-blur">
              <MessageCircle className="w-7 h-7 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold mt-1">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => startConversationWith(currentReel.user)}
            className="flex flex-col items-center group active:scale-90 transition-transform"
          >
            <div className="p-2 rounded-full bg-black/40 backdrop-blur">
              <Send className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold mt-1">
              {currentReel.sharesCount.toLocaleString()}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="p-2 rounded-full bg-black/40 backdrop-blur active:scale-90 transition-transform"
          >
            <Bookmark className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>

        {/* Bottom Metadata & Music Bar */}
        <div className="absolute bottom-0 left-0 right-16 z-10 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
          {/* User info */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-bold text-sm">{currentReel.user.username}</span>
            {currentReel.user.isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            )}
            <button
              onClick={() => toggleFollowUser(currentReel.user.id)}
              className="text-xs px-2.5 py-0.5 rounded-md font-semibold border border-white/60 hover:bg-white/20 transition"
            >
              {currentReel.user.isFollowing ? 'Подписки' : 'Подписаться'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed mb-2.5">
            {currentReel.caption}
          </p>

          {/* Audio track info with rotating record */}
          <div className="flex items-center space-x-2 text-xs text-neutral-300">
            <Music2 className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
            <span className="truncate max-w-[200px]">{currentReel.musicTitle}</span>
            <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center animate-spin">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Comment Drawer Overlay inside Reel */}
        {isCommentDrawerOpen && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-3.5 border-b border-neutral-800 text-white">
              <span className="font-semibold text-sm">Комментарии</span>
              <button
                onClick={() => setIsCommentDrawerOpen(false)}
                className="p-1 hover:text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs text-white">
              {commentsList.map((c) => (
                <div key={c.id} className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center font-bold text-[10px]">
                    {c.user[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold mr-1.5">{c.user}</span>
                    <span className="text-neutral-300">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddComment}
              className="flex items-center p-3 border-t border-neutral-800"
            >
              <input
                type="text"
                placeholder="Добавьте комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white/10 text-xs text-white px-3 py-2 rounded-full focus:outline-none"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="ml-2 text-xs font-semibold text-pink-500"
                >
                  Отправить
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
