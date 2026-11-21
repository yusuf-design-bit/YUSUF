import React, { useState } from 'react';
import { X, Image as ImageIcon, Type, Sparkles, Check } from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';

const PRESET_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
];

export const CreateStoryModal: React.FC = () => {
  const { isCreateStoryOpen, setIsCreateStoryOpen, createStory, theme } = useInstagram();
  const [selectedImage, setSelectedImage] = useState(PRESET_STORY_IMAGES[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [storyText, setStoryText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBg, setTextBg] = useState(true);

  if (!isCreateStoryOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    const imageToUse = customUrl.trim() || selectedImage;
    createStory(imageToUse, storyText);
    setIsCreateStoryOpen(false);
    setStoryText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <span className="font-semibold text-base">Добавить в историю</span>
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            className="p-1 rounded-full hover:bg-neutral-800/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Preview */}
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
          {/* Vertical Preview Card */}
          <div className="relative w-48 h-80 rounded-xl overflow-hidden shadow-lg bg-black flex-shrink-0 border border-neutral-700">
            <img
              src={customUrl.trim() || selectedImage}
              alt="Story Preview"
              className="w-full h-full object-cover"
            />
            {storyText && (
              <div className="absolute bottom-8 left-2 right-2 text-center pointer-events-none">
                <span
                  style={{ color: textColor }}
                  className={`inline-block text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-md ${
                    textBg ? 'bg-black/60 backdrop-blur' : ''
                  }`}
                >
                  {storyText}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                Выбрать фото
              </label>
              {/* Presets Grid */}
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {PRESET_STORY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedImage(img);
                      setCustomUrl('');
                    }}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition ${
                      selectedImage === img && !customUrl
                        ? 'border-pink-500 scale-105'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload file or enter image URL */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-600 hover:bg-neutral-800/20 transition">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Загрузить фото</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  placeholder="Или ссылка URL..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Sticker / Caption text */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Текст / Стикер
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Добавить надпись в историю..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  maxLength={60}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Text styling options */}
              {storyText && (
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setTextBg(!textBg)}
                    className={`text-xs px-2 py-1 rounded border transition ${
                      textBg ? 'bg-pink-600 text-white border-pink-600' : 'border-neutral-600'
                    }`}
                  >
                    Фон текста
                  </button>
                  <div className="flex items-center gap-1.5">
                    {['#ffffff', '#f43f5e', '#eab308', '#06b6d4', '#a855f7'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setTextColor(col)}
                        style={{ backgroundColor: col }}
                        className={`w-5 h-5 rounded-full border-2 ${
                          textColor === col ? 'border-white ring-1 ring-black' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-4 py-3 border-t ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            className="px-4 py-2 text-sm rounded-xl hover:bg-neutral-800/10 transition"
          >
            Отмена
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Опубликовать в историю</span>
          </button>
        </div>
      </div>
    </div>
  );
};
