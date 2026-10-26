import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Headphones,
  Play,
  Pause,
  Square,
  Bookmark,
  BookmarkCheck,
  Type,
  Palette,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  List,
  X,
  Volume2,
  Sliders,
  Share2
} from 'lucide-react';
import { CHAPTERS, NovelChapter, ParagraphItem } from '../data/novelData';
import { useTextToSpeech } from '../utils/useTextToSpeech';
import { ambienceManager } from '../utils/audioAmbience';

interface ReaderViewProps {
  initialChapterId?: string;
  onClose: () => void;
  bookmarks: string[];
  onToggleBookmark: (itemId: string, text: string, chapterTitle: string) => void;
}

type ReaderTheme = 'midnight' | 'sepia' | 'light' | 'frost';
type ReaderFont = 'amiri' | 'cairo' | 'tajawal';

export const ReaderView: React.FC<ReaderViewProps> = ({
  initialChapterId = 'intro',
  onClose,
  bookmarks,
  onToggleBookmark
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>('midnight');
  const [font, setFont] = useState<ReaderFont>('amiri');
  const [fontSize, setFontSize] = useState<number>(20);
  const [lineHeight, setLineHeight] = useState<number>(2.0);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Set initial chapter
  useEffect(() => {
    const idx = CHAPTERS.findIndex((c) => c.id === initialChapterId);
    if (idx !== -1) {
      setCurrentChapterIndex(idx);
    }
  }, [initialChapterId]);

  const currentChapter: NovelChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  // Text to Speech
  const {
    isPlaying,
    isPaused,
    currentParagraphIndex,
    rate,
    play,
    pause,
    stop,
    changeRate,
    speakParagraph
  } = useTextToSpeech(currentChapter.items);

  // Auto scroll to active speech paragraph
  useEffect(() => {
    if (currentParagraphIndex >= 0 && currentChapter.items[currentParagraphIndex]) {
      const activeItem = currentChapter.items[currentParagraphIndex];
      const el = paragraphRefs.current.get(activeItem.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentParagraphIndex, currentChapter.items]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current || document.documentElement;
      const totalScroll = el.scrollHeight - el.clientHeight;
      if (totalScroll > 0) {
        const currentProgress = (el.scrollTop / totalScroll) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    const target = containerRef.current;
    if (target) {
      target.addEventListener('scroll', handleScroll);
      return () => target.removeEventListener('scroll', handleScroll);
    }
  }, [currentChapterIndex]);

  const handleNextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      stop();
      ambienceManager.playPageTurnSound();
      setCurrentChapterIndex((prev) => prev + 1);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      stop();
      ambienceManager.playPageTurnSound();
      setCurrentChapterIndex((prev) => prev - 1);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }
  };

  const handleSelectChapter = (idx: number) => {
    stop();
    ambienceManager.playPageTurnSound();
    setCurrentChapterIndex(idx);
    setShowDrawer(false);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyParagraph = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Theme style mapping
  const themeStyles = {
    midnight: {
      bg: 'bg-neutral-950',
      text: 'text-neutral-200',
      proseText: 'text-neutral-200',
      navBg: 'bg-neutral-900/90 border-neutral-800',
      cardBg: 'bg-neutral-900/60 border-neutral-800',
      quoteBg: 'bg-neutral-900/90 border-amber-500/80 text-amber-100',
      dialogueBadge: 'text-amber-400 font-semibold',
      accent: 'amber',
      progressBar: 'bg-amber-500',
      highlightVoice: 'bg-amber-950/40 ring-1 ring-amber-500/50'
    },
    sepia: {
      bg: 'bg-[#f7f2e7]',
      text: 'text-[#2a2521]',
      proseText: 'text-[#2e2924]',
      navBg: 'bg-[#ece5d5]/95 border-[#d6ccb7]',
      cardBg: 'bg-[#efe8d8] border-[#dfd6c3]',
      quoteBg: 'bg-[#ede5d3] border-amber-800 text-[#3d2f23]',
      dialogueBadge: 'text-amber-900 font-bold',
      accent: 'amber',
      progressBar: 'bg-amber-800',
      highlightVoice: 'bg-amber-200/50 ring-1 ring-amber-800/40'
    },
    light: {
      bg: 'bg-[#fafafa]',
      text: 'text-neutral-900',
      proseText: 'text-neutral-800',
      navBg: 'bg-white/95 border-neutral-200 shadow-sm',
      cardBg: 'bg-white border-neutral-200',
      quoteBg: 'bg-neutral-100 border-neutral-700 text-neutral-900',
      dialogueBadge: 'text-neutral-950 font-bold',
      accent: 'neutral',
      progressBar: 'bg-neutral-900',
      highlightVoice: 'bg-amber-100/70 ring-1 ring-amber-600/40'
    },
    frost: {
      bg: 'bg-[#090d16]',
      text: 'text-slate-200',
      proseText: 'text-slate-100',
      navBg: 'bg-[#0f172a]/95 border-slate-800',
      cardBg: 'bg-[#0f172a]/70 border-slate-800',
      quoteBg: 'bg-[#0f172a] border-cyan-500 text-cyan-100',
      dialogueBadge: 'text-cyan-400 font-semibold',
      accent: 'cyan',
      progressBar: 'bg-cyan-500',
      highlightVoice: 'bg-cyan-950/50 ring-1 ring-cyan-500/50'
    }
  }[theme];

  // Font family mapping
  const fontClass = {
    amiri: 'font-amiri',
    cairo: 'font-cairo',
    tajawal: 'font-tajawal'
  }[font];

  // Search matches
  const searchResults = searchQuery.trim().length > 1
    ? CHAPTERS.flatMap((ch, chIdx) =>
        ch.items
          .filter((item) => item.text && item.text.includes(searchQuery.trim()))
          .map((item) => ({ chapter: ch, chapterIndex: chIdx, item }))
      )
    : [];

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} ${themeStyles.text} transition-colors duration-300 select-text`}
    >
      {/* Top Reading Progress Bar */}
      <div className="w-full h-1 bg-neutral-800/30 fixed top-0 left-0 right-0 z-50">
        <div
          className={`h-full ${themeStyles.progressBar} transition-all duration-150`}
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Reader Header / Navigation Bar */}
      <header className={`px-4 sm:px-6 py-3 border-b backdrop-blur-md z-40 flex items-center justify-between gap-3 ${themeStyles.navBg}`}>
        {/* Left: Drawer and Navigation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDrawer(true)}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-cairo font-medium"
            title="فهرس الفصول"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">الفهرس</span>
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs font-cairo flex items-center gap-1.5"
            title="بحث في الرواية"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">بحث</span>
          </button>
        </div>

        {/* Center: Current Chapter Title & Step navigation */}
        <div className="flex items-center gap-2 max-w-md truncate text-center">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="الفصل السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="truncate">
            <div className="font-cairo font-bold text-xs sm:text-sm truncate">
              {currentChapter.title}
            </div>
            <div className="text-[10px] text-neutral-400 font-sans truncate">
              {currentChapter.subtitle}
            </div>
          </div>

          <button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === CHAPTERS.length - 1}
            className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="الفصل التالي"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Tools & Close */}
        <div className="flex items-center gap-1.5">
          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-amber-600/20 text-amber-500' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
            title="إعدادات القراءة والخط"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors hidden sm:block"
            title={isFullscreen ? 'الخروج من الشاشة الكاملة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Reader */}
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
            title="العودة للواجهة الرئيسية"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Reader Settings Drawer/Modal */}
      {showSettings && (
        <div className={`p-4 border-b z-40 text-xs ${themeStyles.navBg} animate-in slide-in-from-top-2 duration-200`}>
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Theme selector */}
            <div className="space-y-2">
              <label className="font-cairo font-bold block text-neutral-400">
                مظهر القراءة
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTheme('midnight')}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
                    theme === 'midnight' ? 'border-amber-500 bg-neutral-900 text-amber-300 font-bold' : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
                  عتمة الليل
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
                    theme === 'sepia' ? 'border-amber-800 bg-[#ede5d3] text-amber-950 font-bold' : 'border-[#dfd6c3] bg-[#f7f2e7] text-neutral-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e8deca] border border-amber-700/40" />
                  ورق البردي
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
                    theme === 'light' ? 'border-neutral-900 bg-neutral-100 text-neutral-900 font-bold' : 'border-neutral-300 bg-white text-neutral-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-400" />
                  نهار ناصع
                </button>
                <button
                  onClick={() => setTheme('frost')}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 ${
                    theme === 'frost' ? 'border-cyan-500 bg-[#0f172a] text-cyan-300 font-bold' : 'border-slate-800 bg-[#090d16] text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-cyan-500/40" />
                  صقيع بارد
                </button>
              </div>
            </div>

            {/* Font family selector */}
            <div className="space-y-2">
              <label className="font-cairo font-bold block text-neutral-400">
                نوع الخط
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFont('amiri')}
                  className={`flex-1 p-2 rounded-lg border text-center font-amiri text-sm ${
                    font === 'amiri' ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'
                  }`}
                >
                  الأميري (أدبي)
                </button>
                <button
                  onClick={() => setFont('cairo')}
                  className={`flex-1 p-2 rounded-lg border text-center font-cairo text-xs ${
                    font === 'cairo' ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'
                  }`}
                >
                  كايرو (حديث)
                </button>
                <button
                  onClick={() => setFont('tajawal')}
                  className={`flex-1 p-2 rounded-lg border text-center font-tajawal text-xs ${
                    font === 'tajawal' ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'
                  }`}
                >
                  تجوال (مرن)
                </button>
              </div>
            </div>

            {/* Font size & Line height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-cairo font-bold text-neutral-400">
                <span>حجم الخط ({fontSize}px)</span>
                <span>التباعد ({lineHeight}x)</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="16"
                  max="28"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-neutral-700 rounded cursor-pointer"
                />
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setLineHeight(1.8)}
                    className={`flex-1 py-1 rounded border text-[11px] ${lineHeight === 1.8 ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'}`}
                  >
                    متوسط
                  </button>
                  <button
                    onClick={() => setLineHeight(2.1)}
                    className={`flex-1 py-1 rounded border text-[11px] ${lineHeight === 2.1 ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'}`}
                  >
                    مريح (موصى به)
                  </button>
                  <button
                    onClick={() => setLineHeight(2.4)}
                    className={`flex-1 py-1 rounded border text-[11px] ${lineHeight === 2.4 ? 'border-amber-500 bg-black/20 font-bold' : 'border-neutral-700'}`}
                  >
                    واسع
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Search Drawer */}
      {showSearch && (
        <div className={`p-4 border-b z-40 ${themeStyles.navBg} max-h-72 overflow-y-auto`}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="ابحث عن كلمة أو عبارة في الرواية (مثال: شوبنهاور، الكهف، الذئب، القمر، ميلود)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-black/10 dark:bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="p-1.5 rounded hover:bg-neutral-700 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {searchQuery.trim().length > 1 && (
              <div className="space-y-2">
                <div className="text-[11px] text-neutral-400">
                  تم العثور على {searchResults.length} نتيجة:
                </div>
                {searchResults.map(({ chapter, chapterIndex, item }, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => {
                      handleSelectChapter(chapterIndex);
                      setShowSearch(false);
                      setTimeout(() => {
                        const el = paragraphRefs.current.get(item.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 200);
                    }}
                    className="p-2.5 rounded-lg bg-black/10 dark:bg-neutral-800/60 hover:bg-amber-950/30 border border-neutral-800 hover:border-amber-600/40 cursor-pointer text-xs transition-colors"
                  >
                    <div className="font-cairo font-bold text-amber-400 mb-1">
                      {chapter.title}
                    </div>
                    <p className="line-clamp-2 text-neutral-300 font-sans">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chapters Drawer / TOC */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-sm h-full ${themeStyles.bg} border-l ${themeStyles.cardBg} p-5 flex flex-col justify-between overflow-y-auto`}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <h3 className="font-cairo font-bold text-lg">فهرس الرواية</h3>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {CHAPTERS.map((ch, idx) => {
                  const isCurrent = idx === currentChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChapter(idx)}
                      className={`w-full text-right p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'border-amber-600 bg-amber-950/30 text-amber-200 font-bold shadow-sm'
                          : 'border-neutral-800/80 hover:bg-neutral-900/60 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span>{ch.number === 0 ? 'المدخل' : `فصل 0${ch.number}`}</span>
                        <span>{ch.estimatedMinutes} دقيقة</span>
                      </div>
                      <div className="font-cairo font-semibold text-sm">
                        {ch.title}
                      </div>
                      <div className="text-xs text-neutral-400 font-sans mt-0.5 line-clamp-1">
                        {ch.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Bookmarks Link */}
            <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
              <span>الإشارات المحفوظة: {bookmarks.length}</span>
              <button
                onClick={() => {
                  setShowDrawer(false);
                  window.print();
                }}
                className="text-amber-400 hover:underline font-cairo"
              >
                طباعة الفصل
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* Main Reading Canvas */}
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-10 md:py-16 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto">
          
          {/* Chapter Header */}
          <div className="text-center mb-12 pb-8 border-b border-neutral-800/40">
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              {currentChapter.number === 0 ? 'مقدمة فلسفية' : `الفصل 0${currentChapter.number}`}
            </span>
            <h1 className="font-cairo font-black text-3xl sm:text-4xl lg:text-5xl mt-2 mb-3 tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="font-amiri text-lg sm:text-xl text-amber-400/90 italic">
              {currentChapter.subtitle}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-neutral-400 font-sans">
              <span>{currentChapter.wordCount} كلمة</span>
              <span aria-hidden="true">·</span>
              <span>{currentChapter.estimatedMinutes} دقائق قراءة متواصلة</span>
            </div>
          </div>

          {/* Chapter Content Items */}
          <div className={`space-y-6 text-justify ${fontClass}`}>
            {currentChapter.items.map((item, index) => {
              const isVoiceActive = currentParagraphIndex === index && isPlaying;
              const isBookmarked = bookmarks.includes(item.id);

              if (item.type === 'quote') {
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) paragraphRefs.current.set(item.id, el);
                    }}
                    className={`my-8 p-6 rounded-2xl border-r-4 shadow-sm transition-all duration-300 relative group ${themeStyles.quoteBg} ${
                      isVoiceActive ? themeStyles.highlightVoice : ''
                    }`}
                  >
                    <p
                      className="font-amiri italic text-xl sm:text-2xl leading-relaxed text-right"
                      style={{ fontSize: `${fontSize + 2}px`, lineHeight: lineHeight }}
                    >
                      "{item.text}"
                    </p>
                    {item.author && (
                      <footer className="mt-3 text-left font-cairo font-bold text-sm text-amber-500">
                        — {item.author}
                      </footer>
                    )}

                    {/* Action buttons on hover */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg p-1">
                      <button
                        onClick={() => speakParagraph(index)}
                        title="استمع لهذا الاقتباس"
                        className="p-1.5 rounded hover:bg-white/20 text-neutral-300"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyParagraph(item.text || '', item.id)}
                        title="نسخ الاقتباس"
                        className="p-1.5 rounded hover:bg-white/20 text-neutral-300"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onToggleBookmark(item.id, item.text || '', currentChapter.title)}
                        title="حفظ في الإشارات المرجعية"
                        className={`p-1.5 rounded hover:bg-white/20 ${isBookmarked ? 'text-amber-400' : 'text-neutral-300'}`}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              }

              if (item.type === 'dialogue') {
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) paragraphRefs.current.set(item.id, el);
                    }}
                    className={`pr-4 border-r-2 border-neutral-700/50 my-3 py-1.5 transition-all duration-300 relative group rounded-l-lg ${
                      isVoiceActive ? themeStyles.highlightVoice : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm ${themeStyles.dialogueBadge} font-cairo`}>
                        {item.speaker}
                      </span>
                      {item.emotion && (
                        <span className="text-[11px] text-neutral-400 font-sans italic">
                          ({item.emotion})
                        </span>
                      )}
                    </div>
                    <p
                      className={`${themeStyles.proseText} text-right`}
                      style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                    >
                      "{item.text}"
                    </p>

                    {/* Quick action tools on hover */}
                    <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg p-1">
                      <button
                        onClick={() => speakParagraph(index)}
                        title="استمع لهذا الحوار"
                        className="p-1 rounded hover:bg-white/20 text-neutral-300"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCopyParagraph(`${item.speaker}: "${item.text}"`, item.id)}
                        title="نسخ"
                        className="p-1 rounded hover:bg-white/20 text-neutral-300"
                      >
                        {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                );
              }

              if (item.type === 'break') {
                return (
                  <div key={item.id} className="text-center my-8 text-neutral-500 tracking-widest text-lg">
                    • • •
                  </div>
                );
              }

              if (item.type === 'date') {
                return (
                  <div
                    key={item.id}
                    className="font-cairo font-bold text-amber-500/90 text-sm mb-4 border-b border-amber-600/30 pb-1 inline-block"
                  >
                    {item.text}
                  </div>
                );
              }

              // Standard Paragraph
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) paragraphRefs.current.set(item.id, el);
                  }}
                  className={`relative group rounded-xl p-2 -mx-2 transition-all duration-300 ${
                    isVoiceActive ? themeStyles.highlightVoice : ''
                  }`}
                >
                  <p
                    className={`${themeStyles.proseText} leading-relaxed`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                  >
                    {item.text}
                  </p>

                  {/* Hover Tools: Audio, Bookmark, Copy */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-900/80 backdrop-blur-sm rounded-lg p-1 border border-neutral-700/60 shadow-lg z-10">
                    <button
                      onClick={() => speakParagraph(index)}
                      title="اقرأ هذا المقطع بصوت"
                      className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopyParagraph(item.text || '', item.id)}
                      title="نسخ المقطع"
                      className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onToggleBookmark(item.id, item.text || '', currentChapter.title)}
                      title="حفظ في الإشارات المرجعية"
                      className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${
                        isBookmarked ? 'text-amber-400' : 'text-neutral-300 hover:text-amber-400'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-16 pt-8 border-t border-neutral-800/80 flex items-center justify-between gap-4">
            {currentChapterIndex > 0 ? (
              <button
                onClick={handlePrevChapter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-amber-600/50 hover:bg-neutral-900/60 text-xs font-cairo transition-all group"
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 font-sans">الفصل السابق</div>
                  <div className="font-bold">{CHAPTERS[currentChapterIndex - 1].title}</div>
                </div>
              </button>
            ) : <div />}

            {currentChapterIndex < CHAPTERS.length - 1 ? (
              <button
                onClick={handleNextChapter}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-cairo font-bold text-xs transition-all shadow-md group"
              >
                <div className="text-right">
                  <div className="text-[10px] text-neutral-900/80 font-sans">الفصل التالي</div>
                  <div>{CHAPTERS[currentChapterIndex + 1].title}</div>
                </div>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>
            ) : (
              <div className="text-center font-cairo text-xs text-amber-400 font-semibold">
                نهاية الرواية · "السعادة في الرضا"
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Floating Audio Narrator Player Bar */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-950/95 border border-neutral-800 text-neutral-100 rounded-full px-4 py-2 shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-md w-[92%] sm:w-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isPlaying) {
                pause();
              } else {
                play(currentParagraphIndex >= 0 ? currentParagraphIndex : 0);
              }
            }}
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-transform hover:scale-105 shadow-md"
            title={isPlaying ? 'إيقاف مؤقت' : 'قراءة صوتية'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-neutral-950" /> : <Play className="w-4 h-4 fill-neutral-950 translate-x-[-1px]" />}
          </button>

          {isPlaying && (
            <button
              onClick={stop}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
              title="إيقاف كلي"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* TTS Info */}
        <div className="text-right min-w-[120px] max-w-[180px] truncate">
          <div className="text-xs font-cairo font-bold text-neutral-200 truncate">
            {isPlaying ? 'جاري القراءة الصوتية...' : 'القارئ الصوتي'}
          </div>
          <div className="text-[10px] text-neutral-400 font-sans truncate">
            {currentParagraphIndex >= 0
              ? `المقطع ${currentParagraphIndex + 1} من ${currentChapter.items.length}`
              : 'اضغط للبدء أو انقر أي فقرة'}
          </div>
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1 border-r border-neutral-800 pr-2">
          {[0.85, 1.0, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => changeRate(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                rate === s
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
