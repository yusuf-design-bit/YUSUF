import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  UserStory,
  Reel,
  Conversation,
  NotificationItem,
  ActiveTab,
  Comment,
} from '../types/instagram';
import {
  CURRENT_USER,
  OTHER_USERS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface InstagramContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: UserStory[];
  reels: Reel[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Modals & Viewers
  activeStoryViewer: { userIndex: number; slideIndex: number } | null;
  openStoryViewer: (userIndex: number, slideIndex?: number) => void;
  closeStoryViewer: () => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCreateStoryOpen: boolean;
  setIsCreateStoryOpen: (open: boolean) => void;
  activePostDetail: Post | null;
  setActivePostDetail: (post: Post | null) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  // Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  createPost: (data: {
    mediaUrls: string[];
    caption: string;
    aspectRatio: 'square' | 'portrait' | 'landscape';
    location?: string;
    tags?: string[];
    filterStyle?: any;
  }) => void;
  createStory: (mediaUrl: string, text?: string) => void;
  toggleFollowUser: (userId: string) => void;
  sendMessage: (conversationId: string, text?: string, mediaUrl?: string) => void;
  startConversationWith: (user: User) => void;
  toggleLikeReel: (reelId: string) => void;
  updateProfile: (updated: Partial<User>) => void;
  markNotificationsAsRead: () => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'yourgram_user_v1',
  POSTS: 'yourgram_posts_v1',
  STORIES: 'yourgram_stories_v1',
  REELS: 'yourgram_reels_v1',
  CONVERSATIONS: 'yourgram_convs_v1',
  NOTIFICATIONS: 'yourgram_notifs_v1',
  THEME: 'yourgram_theme_v1',
};

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [users, setUsers] = useState<User[]>(OTHER_USERS);

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<UserStory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REELS);
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeStoryViewer, setActiveStoryViewer] = useState<{ userIndex: number; slideIndex: number } | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openStoryViewer = (userIndex: number, slideIndex: number = 0) => {
    setActiveStoryViewer({ userIndex, slideIndex });
    // Mark as seen
    setStories((prev) =>
      prev.map((s, idx) => (idx === userIndex ? { ...s, hasUnseen: false } : s))
    );
  };

  const closeStoryViewer = () => {
    setActiveStoryViewer(null);
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );

    // Keep activePostDetail in sync if open
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
            }
          : null
      );
    }
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      })
    );

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
      },
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: Math.max(0, post.commentsCount - 1),
            comments: post.comments.filter((c) => c.id !== commentId),
          };
        }
        return post;
      })
    );

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: Math.max(0, prev.commentsCount - 1),
              comments: prev.comments.filter((c) => c.id !== commentId),
            }
          : null
      );
    }
  };

  const createPost = ({
    mediaUrls,
    caption,
    aspectRatio,
    location,
    tags = [],
    filterStyle,
  }: {
    mediaUrls: string[];
    caption: string;
    aspectRatio: 'square' | 'portrait' | 'landscape';
    location?: string;
    tags?: string[];
    filterStyle?: any;
  }) => {
    // Extract hashtags from caption if not provided
    const extractedTags = caption.match(/#[a-zA-Z0-9_а-яА-ЯёЁ]+/g) || [];
    const allTags = Array.from(new Set([...tags, ...extractedTags]));

    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: currentUser,
      mediaUrls,
      aspectRatio,
      caption,
      tags: allTags,
      location: location?.trim() || undefined,
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      createdAt: 'Just now',
      filterStyle,
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));
    setActiveTab('home');
  };

  const createStory = (mediaUrl: string, text?: string) => {
    const newSlide = {
      id: `story_slide_${Date.now()}`,
      mediaUrl,
      type: 'image' as const,
      text: text?.trim(),
      createdAt: 'Just now',
    };

    setStories((prev) => {
      const userStoryIdx = prev.findIndex((s) => s.user.id === currentUser.id);
      if (userStoryIdx >= 0) {
        const copy = [...prev];
        copy[userStoryIdx] = {
          ...copy[userStoryIdx],
          hasUnseen: true,
          slides: [newSlide, ...copy[userStoryIdx].slides],
        };
        return copy;
      } else {
        return [
          {
            user: currentUser,
            hasUnseen: true,
            slides: [newSlide],
          },
          ...prev,
        ];
      }
    });
  };

  const toggleFollowUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing,
            followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );

    // Also update in currentUser followingCount
    setCurrentUser((prev) => {
      const target = users.find((u) => u.id === userId);
      const isNowFollowing = !target?.isFollowing;
      return {
        ...prev,
        followingCount: isNowFollowing ? prev.followingCount + 1 : Math.max(0, prev.followingCount - 1),
      };
    });

    // Also sync with posts user objects
    setPosts((prev) =>
      prev.map((post) => {
        if (post.user.id === userId) {
          return {
            ...post,
            user: {
              ...post.user,
              isFollowing: !post.user.isFollowing,
            },
          };
        }
        return post;
      })
    );
  };

  const sendMessage = (conversationId: string, text?: string, mediaUrl?: string) => {
    if (!text?.trim() && !mediaUrl) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: text?.trim(),
      mediaUrl,
      createdAt: 'Just now',
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
          };
        }
        return conv;
      })
    );

    // Automated cute reply after 2 seconds for a lively interactive experience!
    setTimeout(() => {
      const conv = conversations.find((c) => c.id === conversationId);
      if (!conv) return;
      const responses = [
        'Awesome! Thanks for sharing this 👏✨',
        'Haha totally agree! 😂 Let’s catch up soon!',
        'Love this photo so much! 📸🔥',
        'Sounds great, will check it out later today! 🙌',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botMessage = {
        id: `msg_bot_${Date.now()}`,
        conversationId,
        senderId: conv.participant.id,
        text: randomResponse,
        createdAt: 'Just now',
        isRead: false,
      };

      setConversations((p) =>
        p.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, botMessage],
              lastMessage: botMessage,
              unreadCount: selectedConversationId === conversationId ? 0 : c.unreadCount + 1,
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const startConversationWith = (targetUser: User) => {
    // Find existing or create new
    const existing = conversations.find((c) => c.participant.id === targetUser.id);
    if (existing) {
      setSelectedConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv_${targetUser.id}`,
        participant: targetUser,
        unreadCount: 0,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setSelectedConversationId(newConv.id);
    }
    setActiveTab('messages');
  };

  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked,
            likesCount: isLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1),
          };
        }
        return reel;
      })
    );
  };

  const updateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => {
      const nextUser = { ...prev, ...updated };
      // Also update currentUser in posts created by user
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.user.id === prev.id ? { ...p, user: { ...p.user, ...updated } } : p
        )
      );
      return nextUser;
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <InstagramContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        reels,
        conversations,
        notifications,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        activeStoryViewer,
        openStoryViewer,
        closeStoryViewer,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        activePostDetail,
        setActivePostDetail,
        selectedConversationId,
        setSelectedConversationId,
        toggleLikePost,
        toggleSavePost,
        addComment,
        deleteComment,
        createPost,
        createStory,
        toggleFollowUser,
        sendMessage,
        startConversationWith,
        toggleLikeReel,
        updateProfile,
        markNotificationsAsRead,
        unreadMessagesCount,
        unreadNotificationsCount,
      }}
    >
      {children}
    </InstagramContext.Provider>
  );
};

export const useInstagram = () => {
  const context = useContext(InstagramContext);
  if (!context) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};
