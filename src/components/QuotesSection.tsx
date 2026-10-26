import React, { useState } from 'react';
import { Quote, Copy, Check, Share2, Sparkles, Download, Eye } from 'lucide-react';
import { FAMOUS_QUOTES, BOOK_METADATA } from '../data/novelData';

export const QuotesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalQuote, setActiveModalQuote] = useState<typeof FAMOUS_QUOTES[0] | null>(null);

  const categories = [
    { id: 'all', label: 'كافة الاقتباسات' },
    { id: 'فلسفة الوجود', label: 'فلسفة الوجود' },
    { id: 'سيكولوجيا السعادة', label: 'سيكولوجيا السعادة' },
    { id: 'الطبيعة البشرية', label: 'الطبيعة البشرية' },
    { id: 'وهم الانتقام', label: 'وهم الانتقام' },
    { id: 'الرضا والعدم', label: 'الرضا والعدم' }
  ];

  const filteredQuotes = selectedCategory === 'all'
    ? FAMOUS_QUOTES
    : FAMOUS_QUOTES.filter((q) => q.category === selectedCategory);

  const handleCopy = (quote: string, id: string) => {
    navigator.clipboard.writeText(`"${quote}" — رواية: ${BOOK_METADATA.title}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-20 border-t border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بصائر وكلمات خالدة</span>
          </div>
          <h2 className="font-cairo font-black text-3xl sm:text-4xl text-neutral-100">
            مقتطفات واقتباسات الرواية
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            عبارات صيغت بمداد التجربة والوجع، تلخص الصراع الأزلي بين وهم السعادة وحقيقة الألم.
          </p>
        </div>

        {/* Category Filters (interactive functional segmented buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 max-w-3xl mx-auto p-1.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cairo transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-950/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quotes Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-600/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg text-right relative overflow-hidden"
            >
              {/* Subtle quote water-mark */}
              <Quote className="absolute top-4 left-4 w-12 h-12 text-neutral-800/40 pointer-events-none" />

              <div>
                {/* Meta header: Chapter & Category */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-sans mb-3">
                  <span className="text-amber-400/90 font-medium">{q.category}</span>
                  <span className="text-neutral-400">{q.chapter}</span>
                </div>

                {/* Quote Text */}
                <p className="font-amiri text-xl sm:text-2xl text-neutral-200 leading-relaxed italic mb-4">
                  "{q.quote}"
                </p>
              </div>

              {/* Author & Action buttons */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="font-cairo font-bold text-xs text-amber-500">
                  — {q.author}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveModalQuote(q)}
                    title="معاينة بطاقة الاقتباس الفنية"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(q.quote, q.id)}
                    title="نسخ النص"
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Visual Quote Card Preview Modal */}
      {activeModalQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-700 max-w-lg w-full rounded-3xl p-6 sm:p-8 text-right relative shadow-2xl">
            
            {/* Close */}
            <button
              onClick={() => setActiveModalQuote(null)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-xs font-cairo font-bold text-amber-400 mb-4">
              بطاقة اقتباس فنية للمشاركة
            </div>

            {/* Visual Card Canvas */}
            <div
              id="quote-card-element"
              className="p-8 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/40 border border-neutral-700/80 shadow-2xl relative overflow-hidden"
            >
              {/* Star dust effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-4">
                <Quote className="w-8 h-8 text-amber-500/60" />
                <p className="font-amiri text-2xl sm:text-3xl text-neutral-100 leading-relaxed italic text-right">
                  "{activeModalQuote.quote}"
                </p>
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-cairo font-bold text-amber-400">
                    — {activeModalQuote.author}
                  </span>
                  <span className="text-neutral-400 font-sans">
                    رواية البرد الذي اخترق الجدران
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopy(activeModalQuote.quote, 'modal')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-cairo font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedId === 'modal' ? (
                  <>
                    <Check className="w-4 h-4 text-neutral-950" />
                    <span>تم نسخ الاقتباس!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ النص مع النسبة</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModalQuote(null)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-cairo text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
