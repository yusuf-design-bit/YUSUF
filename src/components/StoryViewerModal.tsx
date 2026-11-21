import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, Pause, Play } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

const EMOJI_REACTIONS = ['🔥', '❤️', '😂', '😮', '😢', '👏', '🎉', '💯'];

export const StoryViewerModal: React.FC = () => {
  const {
    activeStoryViewer,
    closeStoryViewer,
    stories,
    sendMessage,
    startConversationWith,
  } = useInstagram();

  if (!activeStoryViewer) return null;

  const { userIndex, slideIndex } = activeStoryViewer;
  const currentStory = stories[userIndex];
  if (!currentStory || !currentStory.slides.length) return null;

  const [currentSlideIdx, setCurrentSlideIdx] = useState(slideIndex || 0);
  const [currentUserIdx, setCurrentUserIdx] = useState(userIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; char: string; x: number }[]>([]);

  const activeStory = stories[currentUserIdx];
  const activeSlide = activeStory?.slides[currentSlideIdx];

  const handleNext = useCallback(() => {
    if (!activeStory) return;
    if (currentSlideIdx < activeStory.slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
      setProgress(0);
    } else {
      // Go to next user
      if (currentUserIdx < stories.length - 1) {
        setCurrentUserIdx((prev) => prev + 1);
        setCurrentSlideIdx(0);
        setProgress(0);
      } else {
        closeStoryViewer();
      }
    }
  }, [activeStory, currentSlideIdx, currentUserIdx, stories.length, closeStoryViewer]);

  const handlePrev = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx((prev) => prev - 1);
      setProgress(0);
    } else {
      // Go to previous user
      if (currentUserIdx > 0) {
        const prevUserStories = stories[currentUserIdx - 1];
        setCurrentUserIdx((prev) => prev - 1);
        setCurrentSlideIdx(prevUserStories.slides.length - 1);
        setProgress(0);
      }
    }
  }, [currentSlideIdx, currentUserIdx, stories]);

  // Progress ticker
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 50 ticks of 100ms = 5000ms = 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
  }, [currentSlideIdx, currentUserIdx]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStoryViewer();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') setIsPaused((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeStoryViewer, handleNext, handlePrev]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeStory) return;

    // Send DM to the story owner
    startConversationWith(activeStory.user);
    // Find conversation ID and send
    const convId = `conv_${activeStory.user.id}`;
    sendMessage(convId, `Ответ на историю: "${replyText.trim()}"`);

    // Emoji burst
    addFloatingEmoji('💬');
    setReplyText('');
  };

  const handleReactionClick = (emoji: string) => {
    if (!activeStory) return;
    addFloatingEmoji(emoji);
    startConversationWith(activeStory.user);
    const convId = `conv_${activeStory.user.id}`;
    sendMessage(convId, `Реакция на историю: ${emoji}`);
  };

  const addFloatingEmoji = (char: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      char,
      x: 30 + Math.random() * 40,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1500);
  };

  if (!activeStory || !activeSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 md:p-6 select-none">
      {/* Floating Emojis */}
      {floatingEmojis.map((e) => (
        <div
          key={e.id}
          style={{ left: `${e.x}%` }}
          className="pointer-events-none fixed bottom-24 text-4xl animate-bounce z-50 transition-all duration-1000 transform -translate-y-48 opacity-90"
        >
          {e.char}
        </div>
      ))}

      {/* Close button in top-right */}
      <button
        onClick={closeStoryViewer}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows for desktop */}
      {currentUserIdx > 0 || currentSlideIdx > 0 ? (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition backdrop-blur"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : null}

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition backdrop-blur"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-sm h-full max-h-[820px] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Progress Bars */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            {activeStory.slides.map((_, idx) => {
              let widthPercent = 0;
              if (idx < currentSlideIdx) widthPercent = 100;
              else if (idx === currentSlideIdx) widthPercent = progress;

              return (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img
                src={activeStory.user.avatar}
                alt={activeStory.user.username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500"
              />
              <span className="text-white font-semibold text-sm">
                {activeStory.user.username}
              </span>
              <span className="text-white/60 text-xs">{activeSlide.createdAt}</span>
            </div>

            <div className="flex items-center space-x-2 text-white">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1 hover:text-pink-400"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Media Photo */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={activeSlide.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />

          {/* Story Sticker/Text if present */}
          {activeSlide.text && (
            <div className="absolute bottom-28 left-4 right-4 z-20 pointer-events-none">
              <div className="inline-block px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-white font-medium text-base shadow-lg border border-white/20">
                {activeSlide.text}
              </div>
            </div>
          )}

          {/* Left/Right Tap zones */}
          <div
            className="absolute top-16 bottom-20 left-0 w-1/3 z-10 cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="absolute top-16 bottom-20 right-0 w-2/3 z-10 cursor-pointer"
            onClick={handleNext}
          />
        </div>

        {/* Bottom Reaction & Reply Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col space-y-2">
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-around px-1 py-1">
            {EMOJI_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReactionClick(emoji);
                }}
                className="text-2xl hover:scale-130 active:scale-95 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Form */}
          <form
            onSubmit={handleSendReply}
            className="flex items-center space-x-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder={`Ответить ${activeStory.user.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/15 text-white placeholder-white/60 text-sm px-4 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-white transition"
            />
            {replyText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleReactionClick('❤️')}
                className="p-2.5 rounded-full bg-white/10 text-white hover:text-red-500 transition"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
