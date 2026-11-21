import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

export const StoriesBar: React.FC = () => {
  const { stories, openStoryViewer, setIsCreateStoryOpen, theme } = useInstagram();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group w-full max-w-xl mx-auto py-3">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-white/90 text-black shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Stories horizontal container */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth px-2"
      >
        {stories.map((story, index) => {
          const isCurrentUser = story.user.id === 'current_user';
          const hasUnseen = story.hasUnseen;

          return (
            <div
              key={story.user.id}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer space-y-1.5"
            >
              <div
                className="relative"
                onClick={() => {
                  if (story.slides.length > 0) {
                    openStoryViewer(index);
                  } else {
                    setIsCreateStoryOpen(true);
                  }
                }}
              >
                {/* Gradient ring */}
                <div
                  className={`p-[2.5px] rounded-full transition-transform active:scale-95 hover:scale-105 ${
                    hasUnseen
                      ? 'instagram-gradient-border'
                      : isCurrentUser && story.slides.length === 0
                      ? 'border border-dashed border-neutral-400'
                      : theme === 'dark'
                      ? 'bg-neutral-800'
                      : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`p-[2px] rounded-full ${
                      theme === 'dark' ? 'bg-black' : 'bg-white'
                    }`}
                  >
                    <img
                      src={story.user.avatar}
                      alt={story.user.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Plus badge on current user */}
                {isCurrentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreateStoryOpen(true);
                    }}
                    className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow hover:bg-blue-600 transition"
                    title="Добавить историю"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                )}
              </div>

              {/* Username label */}
              <span
                className={`text-xs max-w-[70px] truncate text-center ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {isCurrentUser ? 'Ваша история' : story.user.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-white/90 text-black shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
