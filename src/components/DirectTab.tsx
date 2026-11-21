import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  Mic,
  Phone,
  Video,
  Info,
  BadgeCheck,
  CheckCheck,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { OTHER_USERS } from '../data/initialData';

export const DirectTab: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    currentUser,
    startConversationWith,
    theme,
  } = useInstagram();

  const [messageText, setMessageText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation (defaults to first one if none selected)
  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  useEffect(() => {
    if (activeConversation && !selectedConversationId) {
      setSelectedConversationId(activeConversation.id);
    }
  }, [activeConversation, selectedConversationId, setSelectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, messageText);
    setMessageText('');
  };

  const handleSendVoiceMemo = () => {
    if (!activeConversation) return;
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      sendMessage(activeConversation.id, '🎙️ Голосовое сообщение (0:14)');
    }, 1200);
  };

  const handleSendQuickPhoto = () => {
    if (!activeConversation) return;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    ];
    const randomPic = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    sendMessage(activeConversation.id, undefined, randomPic);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) =>
    c.participant.username.toLowerCase().includes(searchConv.toLowerCase()) ||
    c.participant.fullName.toLowerCase().includes(searchConv.toLowerCase())
  );

  return (
    <div
      className={`w-full max-w-5xl mx-auto h-[calc(100vh-60px)] md:h-[90vh] my-0 md:my-5 rounded-2xl border overflow-hidden flex transition-colors ${
        theme === 'dark'
          ? 'bg-black border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      {/* Left Pane: Conversations List */}
      <div
        className={`w-full md:w-80 flex-shrink-0 flex flex-col border-r ${
          theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
        } ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}
      >
        {/* User bar */}
        <div
          className={`p-4 border-b flex items-center justify-between font-bold text-base ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <span>{currentUser.username}</span>
          <span className="text-xs font-normal text-neutral-400">Сообщения</span>
        </div>

        {/* Search Input */}
        <div className="p-3">
          <div
            className={`flex items-center px-3 py-1.5 rounded-xl border text-xs ${
              theme === 'dark'
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-neutral-100 border-neutral-200'
            }`}
          >
            <Search className="w-4 h-4 text-neutral-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Поиск сообщений..."
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Conversations scroll area */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/20">
          {filteredConversations.map((conv) => {
            const isSelected = activeConversation?.id === conv.id;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`flex items-center space-x-3 p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-neutral-900'
                      : 'bg-neutral-100'
                    : 'hover:bg-neutral-800/10'
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.username}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-neutral-700"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">
                      {conv.participant.username}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {lastMsg ? lastMsg.createdAt.split(',')[0] : ''}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {lastMsg?.text || (lastMsg?.mediaUrl ? '📷 Фото' : 'Начните беседу')}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>
            );
          })}

          {/* Quick Start Chat with Other Users */}
          <div className="p-3 border-t border-neutral-800/30">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              Рекомендованные контакты
            </span>
            <div className="space-y-1.5">
              {OTHER_USERS.slice(3).map((u) => (
                <div
                  key={u.id}
                  onClick={() => startConversationWith(u)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800/10 cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium">{u.username}</span>
                  </div>
                  <span className="text-[11px] text-blue-500 font-semibold">Написать</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Active Chat Window */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Chat Header */}
          <div
            className={`p-3.5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedConversationId(null)}
                className="md:hidden text-xs text-blue-500 font-semibold mr-1"
              >
                Назад
              </button>
              <img
                src={activeConversation.participant.avatar}
                alt={activeConversation.participant.username}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-xs">
                    {activeConversation.participant.fullName}
                  </span>
                  {activeConversation.participant.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>
                <span className="text-[10px] text-green-500">В сети</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-neutral-400">
              <button
                onClick={() => alert('Аудиозвонок начат...')}
                className="hover:text-white transition"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert('Видеозвонок начат...')}
                className="hover:text-white transition"
              >
                <Video className="w-5 h-5" />
              </button>
              <button className="hover:text-white transition">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {/* Top user profile banner */}
            <div className="text-center py-6 border-b border-neutral-800/30 mb-4">
              <img
                src={activeConversation.participant.avatar}
                alt={activeConversation.participant.username}
                className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-pink-500 mb-2"
              />
              <div className="font-bold text-sm">
                {activeConversation.participant.fullName}
              </div>
              <div className="text-neutral-400 text-xs">
                @{activeConversation.participant.username} • yourgram
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                {activeConversation.participant.followersCount.toLocaleString()} подписчиков
              </div>
            </div>

            {/* Messages Stream */}
            {activeConversation.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl relative shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-br-sm'
                        : theme === 'dark'
                        ? 'bg-neutral-800 text-white rounded-bl-sm'
                        : 'bg-neutral-200 text-neutral-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                    {msg.mediaUrl && (
                      <img
                        src={msg.mediaUrl}
                        alt="Shared media"
                        className="rounded-xl max-h-60 object-cover mt-1"
                      />
                    )}

                    {msg.liked && (
                      <span className="absolute -bottom-2 -right-1 text-sm bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow">
                        ❤️
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-500 mt-1 px-1">
                    {msg.createdAt}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className={`p-3 border-t flex items-center space-x-2 ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <button
              type="button"
              onClick={handleSendQuickPhoto}
              title="Отправить фото"
              className="p-1.5 text-neutral-400 hover:text-pink-500 transition"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSendVoiceMemo}
              title="Записать голосовое"
              className={`p-1.5 rounded-full transition ${
                isRecordingVoice
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={isRecordingVoice ? 'Запись аудио...' : 'Напишите сообщение...'}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-neutral-800/20 text-xs px-3.5 py-2.5 rounded-full border border-neutral-700/60 focus:outline-none focus:border-pink-500 placeholder-neutral-500"
            />

            {messageText.trim() ? (
              <button
                type="submit"
                className="p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full transition"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => sendMessage(activeConversation.id, '❤️')}
                className="p-1.5 text-red-500 hover:scale-125 transition-transform"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400">
          <Send className="w-16 h-16 stroke-[1.2] mb-3 text-pink-500" />
          <h3 className="text-base font-semibold text-white mb-1">Ваши сообщения</h3>
          <p className="text-xs max-w-sm">
            Отправляйте личные сообщения, фотографии и реакции друзьям.
          </p>
        </div>
      )}
    </div>
  );
};
