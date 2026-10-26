import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuotesSection } from './components/QuotesSection';
import { CharactersSection } from './components/CharactersSection';
import { PhilosophySection } from './components/PhilosophySection';
import { ReflectionsJournal } from './components/ReflectionsJournal';
import { Footer } from './components/Footer';
import { ReaderView } from './components/ReaderView';
import { PrintBookLayout } from './components/PrintBookLayout';

interface BookmarkItem {
  id: string;
  text: string;
  chapterTitle: string;
  savedAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [readerInitialChapter, setReaderInitialChapter] = useState<string>('intro');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('novel_bookmarks');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleToggleBookmark = (itemId: string, text: string, chapterTitle: string) => {
    let updated: BookmarkItem[];
    const exists = bookmarks.some((b) => b.id === itemId);

    if (exists) {
      updated = bookmarks.filter((b) => b.id !== itemId);
    } else {
      const newItem: BookmarkItem = {
        id: itemId,
        text,
        chapterTitle,
        savedAt: new Date().toLocaleDateString('ar-EG')
      };
      updated = [newItem, ...bookmarks];
    }

    setBookmarks(updated);
    try {
      localStorage.setItem('novel_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem('novel_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleOpenReader = (chapterId = 'intro') => {
    setReaderInitialChapter(chapterId);
    setIsReaderOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-100">
      
      {/* Printable Book Layout (hidden on screen, active in print mode) */}
      <PrintBookLayout />

      {/* Screen Website Interface */}
      <div className="no-print flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReader={handleOpenReader}
          bookmarksCount={bookmarks.length}
        />

        {/* Dynamic Section Rendering */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <>
              <HeroSection
                onStartReading={handleOpenReader}
                onOpenAudioReader={() => handleOpenReader('intro')}
                onExploreThemes={() => setActiveTab('philosophy')}
              />
              <PhilosophySection />
              <CharactersSection onReadChapterWithCharacter={handleOpenReader} />
              <QuotesSection />
              <ReflectionsJournal
                onOpenChapter={handleOpenReader}
                bookmarksList={bookmarks}
                onRemoveBookmark={handleRemoveBookmark}
              />
            </>
          )}

          {activeTab === 'characters' && (
            <div className="pt-24">
              <CharactersSection onReadChapterWithCharacter={handleOpenReader} />
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div className="pt-24">
              <PhilosophySection />
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="pt-24">
              <QuotesSection />
            </div>
          )}

          {activeTab === 'reflections' && (
            <div className="pt-24">
              <ReflectionsJournal
                onOpenChapter={handleOpenReader}
                bookmarksList={bookmarks}
                onRemoveBookmark={handleRemoveBookmark}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer
          onOpenReader={handleOpenReader}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* Immersive Reader Modal */}
      {isReaderOpen && (
        <ReaderView
          initialChapterId={readerInitialChapter}
          onClose={() => setIsReaderOpen(false)}
          bookmarks={bookmarks.map((b) => b.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

    </div>
  );
}
