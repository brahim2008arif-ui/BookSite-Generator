import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, VolumeX, Wind, Moon, Printer, Bookmark, Compass } from 'lucide-react';
import { ambienceManager } from '../utils/audioAmbience';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReader: (chapterId?: string) => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReader,
  bookmarksCount
}) => {
  const [ambientMode, setAmbientMode] = useState<'off' | 'wind' | 'night'>('off');
  const [volume, setVolume] = useState(35);
  const [scrolled, setScrolled] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = (mode: 'wind' | 'night') => {
    if (ambientMode === mode) {
      ambienceManager.stop();
      setAmbientMode('off');
    } else {
      ambienceManager.setVolume(volume / 100);
      if (mode === 'wind') ambienceManager.startWind();
      else ambienceManager.startNight();
      setAmbientMode(mode);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    ambienceManager.setVolume(val / 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'reader', label: 'قراءة الرواية' },
    { id: 'characters', label: 'الشخصيات' },
    { id: 'philosophy', label: 'الفلسفة والأفكار' },
    { id: 'quotes', label: 'مقتطفات' },
    { id: 'reflections', label: 'تأملات القارئ' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        scrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 text-right group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-800 to-amber-950/40 border border-neutral-700/60 flex items-center justify-center text-amber-200/90 group-hover:border-amber-600/60 transition-colors shadow-inner">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="font-cairo font-bold text-base sm:text-lg text-neutral-100 group-hover:text-amber-300 transition-colors leading-tight">
              البرد الذي اخترق الجدران
            </div>
            <div className="text-[11px] text-neutral-400 font-sans tracking-wide">
              رواية فلسفية · دراما نفسية
            </div>
          </div>
        </button>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === 'reader') {
                    onOpenReader();
                  } else {
                    setActiveTab(link.id);
                  }
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-amber-300 font-semibold bg-neutral-900/80 border border-neutral-800'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Ambient Sound Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              title="أصوات الأجواء (الزمهرير والليل)"
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                ambientMode !== 'off'
                  ? 'bg-amber-950/50 border-amber-600/50 text-amber-300 shadow-sm shadow-amber-950'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              {ambientMode === 'off' ? (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              ) : ambientMode === 'wind' ? (
                <Wind className="w-4 h-4 text-cyan-300 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 animate-pulse" />
              )}
              <span className="hidden sm:inline font-cairo text-xs">
                {ambientMode === 'off' ? 'المؤثرات الصوتية' : ambientMode === 'wind' ? 'زمهرير الشتاء' : 'سكون الليل'}
              </span>
            </button>

            {/* Audio Dropdown */}
            {showAudioMenu && (
              <div
                dir="rtl"
                className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-64 p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="text-xs font-semibold text-neutral-300 mb-2 border-b border-neutral-800 pb-1.5">
                  أجواء الرواية الصوتية
                </div>
                <div className="space-y-1.5 mb-3">
                  <button
                    onClick={() => handleToggleSound('wind')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      ambientMode === 'wind'
                        ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/60'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span>زمهرير البرد والريح</span>
                    </span>
                    {ambientMode === 'wind' && <span className="text-[10px] text-cyan-400 font-sans">يعمل</span>}
                  </button>

                  <button
                    onClick={() => handleToggleSound('night')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      ambientMode === 'night'
                        ? 'bg-amber-950/60 text-amber-200 border border-amber-800/60'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                      <span>سكون الليل وعتمة الغرفة</span>
                    </span>
                    {ambientMode === 'night' && <span className="text-[10px] text-amber-400 font-sans">يعمل</span>}
                  </button>

                  {ambientMode !== 'off' && (
                    <button
                      onClick={() => {
                        ambienceManager.stop();
                        setAmbientMode('off');
                      }}
                      className="w-full text-center py-1 text-[11px] text-neutral-400 hover:text-red-300 transition-colors"
                    >
                      إيقاف المؤثرات
                    </button>
                  )}
                </div>

                {ambientMode !== 'off' && (
                  <div className="pt-2 border-t border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span>مستوى الصوت</span>
                      <span>{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bookmarks Counter */}
          {bookmarksCount > 0 && (
            <button
              onClick={() => onOpenReader()}
              title={`${bookmarksCount} إشارات مرجعية محفوظة`}
              className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-amber-400 hover:bg-neutral-800 transition-colors relative"
            >
              <Bookmark className="w-4 h-4 fill-amber-500/20 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
                {bookmarksCount}
              </span>
            </button>
          )}

          {/* Print Button */}
          <button
            onClick={handlePrint}
            title="طباعة / حفظ كـ PDF"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-400" />
            <span>طباعة</span>
          </button>

          {/* Read CTA */}
          <button
            onClick={() => onOpenReader()}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 text-xs font-semibold transition-all shadow-md shadow-amber-950/40 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>ابدأ القراءة</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-900/80 bg-neutral-950/95 px-2 py-1.5 mt-2 overflow-x-auto">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              if (link.id === 'reader') onOpenReader();
              else setActiveTab(link.id);
            }}
            className={`px-2.5 py-1 text-xs whitespace-nowrap transition-colors rounded ${
              activeTab === link.id
                ? 'text-amber-300 font-bold bg-neutral-900'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
