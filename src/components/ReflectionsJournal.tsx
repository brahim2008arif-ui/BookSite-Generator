import React, { useState, useEffect } from 'react';
import { PenTool, Bookmark, Trash2, Save, Share2, Sparkles, BookOpen } from 'lucide-react';
import { CHAPTERS } from '../data/novelData';

interface BookmarkItem {
  id: string;
  text: string;
  chapterTitle: string;
  savedAt: string;
}

interface UserNote {
  id: string;
  chapterTitle: string;
  content: string;
  date: string;
}

interface ReflectionsJournalProps {
  onOpenChapter: (chapterId: string) => void;
  bookmarksList: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
}

export const ReflectionsJournal: React.FC<ReflectionsJournalProps> = ({
  onOpenChapter,
  bookmarksList,
  onRemoveBookmark
}) => {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>(CHAPTERS[0].title);
  const [noteContent, setNoteContent] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('novel_user_notes');
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    const newNote: UserNote = {
      id: Date.now().toString(),
      chapterTitle: selectedChapter,
      content: noteContent.trim(),
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('novel_user_notes', JSON.stringify(updated));
    setNoteContent('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem('novel_user_notes', JSON.stringify(updated));
  };

  const thoughtPrompts = [
    {
      title: "عن وهم السعادة الفطري",
      prompt: "هل تعتقد حقاً أن الإنسان خُلق ليتألم، وأن السعادة ليست سوى استراحة قصيرة في حرب لا تهدأ؟"
    },
    {
      title: "عن مأساة الانتقام",
      prompt: "حين حقق الضائع انتقامه وأسقط الجدة؛ لماذا لم يشعر بالفرح بل تراجع وسقط من السطح؟"
    },
    {
      title: "عن حقيقة الرضا",
      prompt: "في رسالة أمير الظلام الأخيرة: 'السعادة تكون صغيرة، لكن إن رضي الإنسان تصبح بعرض السماوات والأرض'.. كيف تطبق ذلك على حياتك؟"
    }
  ];

  return (
    <section className="py-20 border-t border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans tracking-wide">
            <PenTool className="w-4 h-4" />
            <span>مساحة القارئ الفكرية</span>
          </div>
          <h2 className="font-cairo font-black text-3xl sm:text-4xl text-neutral-100">
            دفتر التأملات والإشارات المحفوظة
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            دوّن أفكارك حول فصول الرواية، وراجع المقاطع التي استوقفتك أثناء القراءة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Add Note & Prompts (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-right">
            
            {/* Thought Prompts */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-cairo font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>أسئلة تستحق التفكير</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {thoughtPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNoteContent((prev) => prev ? `${prev}\n\n[${p.title}]: ` : `[${p.title}]: `)}
                    className="p-3 rounded-xl bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800/80 text-right transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-cairo font-bold text-neutral-200 group-hover:text-amber-400 mb-1">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-sans line-clamp-2">
                      {p.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Editor */}
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <span className="font-cairo font-bold text-sm text-neutral-200">
                  كتابة خاطرة أو تأمل جديد
                </span>
                
                {/* Select Chapter */}
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1 text-xs text-neutral-300 font-sans focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {CHAPTERS.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="اكتب هنا ما خطر ببالك أثناء قراءة هذا الفصل... عن مشاعر الضائع، أو ألم الأب ميلود، أو صرخة أمير الظلام في الليل..."
                rows={5}
                className="w-full bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 text-sm text-neutral-100 placeholder-neutral-500 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleSaveNote}
                  disabled={!noteContent.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-neutral-950 font-cairo font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ الخاطرة في متصفحك</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-sans animate-in fade-in">
                    ✓ تم حفظ الخاطرة بنجاح
                  </span>
                )}
              </div>
            </div>

            {/* Past Notes List */}
            {notes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-cairo font-bold text-base text-neutral-200">
                  خواطرك المحفوظة ({notes.length})
                </h3>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex items-start justify-between gap-4 text-right"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
                          <span className="text-amber-400 font-cairo font-semibold">
                            {note.chapterTitle}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{note.date}</span>
                        </div>
                        <p className="font-sans text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                        title="حذف الخاطرة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Left Column: Saved Bookmarks from reading (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-right">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2 font-cairo font-bold text-sm text-neutral-200">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>الإشارات المرجعية المحفوظة</span>
                </div>
                <span className="text-xs text-neutral-400 font-sans">
                  {bookmarksList.length} مقطع
                </span>
              </div>

              {bookmarksList.length === 0 ? (
                <div className="text-center py-8 space-y-2 text-neutral-400">
                  <Bookmark className="w-8 h-8 mx-auto text-neutral-600" />
                  <p className="text-xs font-sans">
                    لم تحفظ أي مقطع بعد. أثناء قراءة الرواية، انقر على أيقونة الإشارة المرجعية بجانب أي فقرة لحفظها هنا للرجوع السريع.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {bookmarksList.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-amber-600/40 transition-colors group space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="text-amber-400 font-cairo font-semibold">
                          {bm.chapterTitle}
                        </span>
                        <button
                          onClick={() => onRemoveBookmark(bm.id)}
                          className="text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="إزالة الإشارة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="font-amiri text-sm text-neutral-200 italic line-clamp-3 leading-relaxed">
                        "{bm.text}"
                      </p>

                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            const found = CHAPTERS.find((c) => c.items.some((i) => i.id === bm.id));
                            if (found) onOpenChapter(found.id);
                          }}
                          className="text-[11px] text-amber-400 hover:underline font-cairo flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>فتح موضع القراءة</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
