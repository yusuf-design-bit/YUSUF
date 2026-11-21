import React, { useState } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
];

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateProfile, theme } = useInstagram();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim() || currentUser.fullName,
      username: username.trim() || currentUser.username,
      bio: bio.trim(),
      website: website.trim(),
      avatar: customAvatarInput.trim() || avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-b ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <span className="font-semibold text-sm md:text-base">Редактировать профиль</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-800/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Avatar edit row */}
          <div className="flex items-center space-x-4 pb-4 border-b border-neutral-800/40">
            <img
              src={customAvatarInput.trim() || avatar}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500"
            />
            <div>
              <span className="font-semibold text-xs block mb-1">Фотография профиля</span>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer text-xs font-semibold text-pink-500 hover:text-pink-400">
                  Изменить фото
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Avatars Row */}
              <div className="flex items-center space-x-1.5 mt-2">
                {SAMPLE_AVATARS.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAvatar(src);
                      setCustomAvatarInput('');
                    }}
                    className={`w-7 h-7 rounded-full overflow-hidden border ${
                      avatar === src ? 'ring-2 ring-pink-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="Sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Имя</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Имя пользователя
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* Website */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Веб-сайт</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              О себе (Bio)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-800/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-xl hover:bg-neutral-800/10 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white rounded-xl bg-pink-600 hover:bg-pink-500 transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
