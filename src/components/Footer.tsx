import React from 'react';
import { BookOpen, Printer, ArrowUp, Heart } from 'lucide-react';
import { BOOK_METADATA } from '../data/novelData';

interface FooterProps {
  onOpenReader: (chapterId?: string) => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReader, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-16 text-right no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cairo font-bold text-lg text-neutral-100">
                  {BOOK_METADATA.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  {BOOK_METADATA.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm text-justify">
              موقع مخصص لهذا العمل الأدبي والدرامي النفسي، يجمع بين تجربة القراءة الهادئة، والتحليل الفلسفي المستفيض لأوهام السعادة وحقيقة الألم.
            </p>

            <div className="text-[11px] text-neutral-400 font-sans">
              رواية فلسفية · دراما نفسية · الطبعة الرقمية الأولى
            </div>
          </div>

          {/* Quick links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-cairo font-bold text-sm text-neutral-200">
              أقسام الموقع
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-neutral-400">
              <button
                onClick={() => onNavigate('home')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الصفحة الرئيسية
              </button>
              <button
                onClick={() => onOpenReader('intro')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                المدخل الفلسفي
              </button>
              <button
                onClick={() => onOpenReader('chapter-1')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الفصل 1: الضائع
              </button>
              <button
                onClick={() => onOpenReader('chapter-2')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الفصل 2: الانتقام
              </button>
              <button
                onClick={() => onOpenReader('chapter-3')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الفصل 3: أمير الظلام
              </button>
              <button
                onClick={() => onOpenReader('chapter-4')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الفصل 4: النهاية والعدم
              </button>
              <button
                onClick={() => onNavigate('characters')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                شخصيات الرواية
              </button>
              <button
                onClick={() => onNavigate('philosophy')}
                className="text-right hover:text-amber-300 transition-colors cursor-pointer"
              >
                الأطروحات الفلسفية
              </button>
            </div>
          </div>

          {/* Actions & Print (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-cairo font-bold text-sm text-neutral-200">
              أدوات القراءة
            </h4>
            
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-500" />
              <span>طباعة الكتاب كاملاً (PDF)</span>
            </button>

            <button
              onClick={scrollToTop}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>العودة لأعلى الصفحة</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 font-sans gap-3">
          <div>
            جميع الحقوق محفوظة للمؤلف © {new Date().getFullYear()} · عمل أدبي درامي وفلسفي
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>"الحياة تتأرجح كالبندول بين الألم والملل"</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
