import React from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { SuggestionsSidebar } from './SuggestionsSidebar';
import { useInstagram } from '../context/InstagramContext';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const FeedTab: React.FC = () => {
  const { posts, theme, setIsCreatePostOpen } = useInstagram();

  return (
    <div className="flex justify-center max-w-6xl mx-auto px-2 md:px-4 pt-2 pb-20">
      {/* Center Feed Column */}
      <div className="w-full max-w-xl flex-shrink-0">
        {/* Stories Bar */}
        <StoriesBar />

        {/* Posts Feed */}
        <div className="mt-2 space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Catch-up Banner */}
          <div
            className={`p-6 rounded-2xl border text-center my-8 ${
              theme === 'dark'
                ? 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              Вы посмотрели все новые публикации
            </h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4">
              Вы просмотрели все обновления от авторов, на которых вы подписаны.
            </p>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition active:scale-95 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Создать новую публикацию</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Suggestions Column on Desktop */}
      <SuggestionsSidebar />
    </div>
  );
};
