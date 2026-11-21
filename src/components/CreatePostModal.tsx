import React, { useState } from 'react';
import {
  X,
  Upload,
  Sliders,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Smile,
  Hash,
} from 'lucide-react';
import { useInstagram } from '../context/InstagramContext';
import { FILTER_PRESETS } from '../data/initialData';

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1080&q=85',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1080&q=85',
];

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, createPost, currentUser, theme } = useInstagram();

  // Multi-step: 'media' -> 'filter' -> 'caption'
  const [step, setStep] = useState<'media' | 'filter' | 'caption'>('media');
  const [mediaUrls, setMediaUrls] = useState<string[]>([SAMPLE_PHOTOS[0]]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [selectedFilterId, setSelectedFilterId] = useState('normal');

  // Filter adjustment values
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);

  // Post details
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [activeAdjustTab, setActiveAdjustTab] = useState<'presets' | 'adjust'>('presets');

  if (!isCreatePostOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrls([event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    setSelectedFilterId(presetId);
    const preset = FILTER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setBrightness(preset.filterStyle.brightness);
      setContrast(preset.filterStyle.contrast);
      setSaturate(preset.filterStyle.saturate);
      setSepia(preset.filterStyle.sepia);
      setGrayscale(preset.filterStyle.grayscale);
    }
  };

  const handleAddCustomUrl = () => {
    if (customUrlInput.trim()) {
      setMediaUrls([customUrlInput.trim()]);
      setCustomUrlInput('');
    }
  };

  const handlePublish = () => {
    createPost({
      mediaUrls,
      caption,
      aspectRatio,
      location,
      filterStyle: {
        brightness,
        contrast,
        saturate,
        sepia,
        grayscale,
      },
    });

    // Reset and close
    setIsCreatePostOpen(false);
    setStep('media');
    setCaption('');
    setLocation('');
  };

  const currentFilterStyleString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) sepia(${sepia}%) grayscale(${grayscale}%)`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border flex flex-col ${
          theme === 'dark'
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          {step !== 'media' ? (
            <button
              onClick={() => setStep(step === 'caption' ? 'filter' : 'media')}
              className="text-sm font-semibold flex items-center space-x-1 hover:text-pink-500 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <div className="w-12" />
          )}

          <h3 className="font-semibold text-sm md:text-base">
            {step === 'media' && 'Создание публикации'}
            {step === 'filter' && 'Фильтры и коррекция'}
            {step === 'caption' && 'Новая публикация'}
          </h3>

          <div>
            {step === 'media' && (
              <button
                onClick={() => setStep('filter')}
                className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition"
              >
                Далее
              </button>
            )}
            {step === 'filter' && (
              <button
                onClick={() => setStep('caption')}
                className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition"
              >
                Далее
              </button>
            )}
            {step === 'caption' && (
              <button
                onClick={handlePublish}
                className="text-sm font-semibold text-pink-500 hover:text-pink-400 transition"
              >
                Поделиться
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Left Column: Image Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative min-h-[340px] md:min-h-[500px]">
            <div
              className="w-full h-full max-h-[500px] flex items-center justify-center overflow-hidden"
              style={{
                aspectRatio:
                  aspectRatio === 'portrait'
                    ? '4 / 5'
                    : aspectRatio === 'landscape'
                    ? '16 / 9'
                    : '1 / 1',
              }}
            >
              <img
                src={mediaUrls[0]}
                alt="Upload preview"
                style={{ filter: currentFilterStyleString }}
                className="w-full h-full object-cover transition-all duration-200"
              />
            </div>

            {/* Aspect Ratio Floating Switcher (on media step) */}
            {step === 'media' && (
              <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white">
                <span className="opacity-70">Формат:</span>
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    aspectRatio === 'square' ? 'bg-pink-600' : 'hover:bg-white/20'
                  }`}
                >
                  1:1
                </button>
                <button
                  onClick={() => setAspectRatio('portrait')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    aspectRatio === 'portrait' ? 'bg-pink-600' : 'hover:bg-white/20'
                  }`}
                >
                  4:5
                </button>
                <button
                  onClick={() => setAspectRatio('landscape')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    aspectRatio === 'landscape' ? 'bg-pink-600' : 'hover:bg-white/20'
                  }`}
                >
                  16:9
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Step Controls */}
          <div
            className={`w-full md:w-80 border-t md:border-t-0 md:border-l p-4 flex flex-col justify-between ${
              theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            {/* STEP 1: MEDIA SELECTION */}
            {step === 'media' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-neutral-400 mb-2">
                    Выберите готовую фотографию
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_PHOTOS.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setMediaUrls([src])}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                          mediaUrls[0] === src
                            ? 'border-pink-500 scale-105'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt="Sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-700/50 space-y-2">
                  <label className="w-full cursor-pointer flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-dashed border-neutral-600 hover:border-pink-500 hover:bg-pink-500/5 transition text-xs font-medium">
                    <Upload className="w-4 h-4 text-pink-500" />
                    <span>Загрузить фото с устройства</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      placeholder="Или вставьте URL картинки..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 bg-transparent focus:outline-none focus:border-pink-500"
                    />
                    <button
                      onClick={handleAddCustomUrl}
                      className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium"
                    >
                      Ок
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FILTERS & ADJUSTMENTS */}
            {step === 'filter' && (
              <div className="space-y-4">
                {/* Tabs: Presets vs Sliders */}
                <div className="flex border-b border-neutral-700 pb-2 gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveAdjustTab('presets')}
                    className={`pb-1 transition ${
                      activeAdjustTab === 'presets'
                        ? 'border-b-2 border-pink-500 text-pink-500'
                        : 'text-neutral-400'
                    }`}
                  >
                    Фильтры
                  </button>
                  <button
                    onClick={() => setActiveAdjustTab('adjust')}
                    className={`pb-1 transition ${
                      activeAdjustTab === 'adjust'
                        ? 'border-b-2 border-pink-500 text-pink-500'
                        : 'text-neutral-400'
                    }`}
                  >
                    Коррекция
                  </button>
                </div>

                {activeAdjustTab === 'presets' ? (
                  <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {FILTER_PRESETS.map((preset) => {
                      const isSelected = selectedFilterId === preset.id;
                      const presetStyle = `brightness(${preset.filterStyle.brightness}%) contrast(${preset.filterStyle.contrast}%) saturate(${preset.filterStyle.saturate}%) sepia(${preset.filterStyle.sepia}%) grayscale(${preset.filterStyle.grayscale}%)`;

                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleApplyPreset(preset.id)}
                          className={`flex flex-col items-center p-1.5 rounded-xl border transition ${
                            isSelected
                              ? 'border-pink-500 bg-pink-500/10'
                              : 'border-transparent hover:bg-neutral-800/20'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden mb-1">
                            <img
                              src={mediaUrls[0]}
                              alt={preset.name}
                              style={{ filter: presetStyle }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[11px] font-medium">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Яркость</span>
                        <span className="text-neutral-400">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Контраст</span>
                        <span className="text-neutral-400">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="160"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Насыщенность</span>
                        <span className="text-neutral-400">{saturate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturate}
                        onChange={(e) => setSaturate(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Сепия</span>
                        <span className="text-neutral-400">{sepia}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sepia}
                        onChange={(e) => setSepia(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: CAPTION & LOCATION */}
            {step === 'caption' && (
              <div className="space-y-3 flex-1 flex flex-col">
                {/* Author profile preview */}
                <div className="flex items-center space-x-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="font-semibold text-xs">{currentUser.username}</span>
                </div>

                {/* Caption Textarea */}
                <textarea
                  placeholder="Добавьте подпись..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent text-xs p-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-pink-500 resize-none placeholder-neutral-500"
                />

                {/* Quick Emoji suggestions */}
                <div className="flex items-center gap-1.5 text-base">
                  {['✨', '📸', '🌅', '🔥', '❤️', '✈️', '☕️'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCaption((prev) => prev + ' ' + em)}
                      className="hover:scale-125 transition-transform"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                {/* Location Input */}
                <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-neutral-700">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Укажите место..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-none placeholder-neutral-500"
                  />
                </div>

                {/* Quick Hashtag helper */}
                <div className="flex flex-wrap gap-1 text-[11px] text-blue-400">
                  {['#travel', '#art', '#nature', '#lifestyle', '#photography'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCaption((prev) => `${prev} ${tag}`)}
                      className="hover:underline"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Close */}
            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
