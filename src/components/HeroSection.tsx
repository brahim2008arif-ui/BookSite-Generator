import React, { useState } from 'react';
import { BookOpen, Headphones, ArrowLeft, Clock, Sparkles, Quote, ChevronRight, FileText } from 'lucide-react';
import { BOOK_METADATA, CHAPTERS, FAMOUS_QUOTES } from '../data/novelData';

interface HeroSectionProps {
  onStartReading: (chapterId?: string) => void;
  onOpenAudioReader: () => void;
  onExploreThemes: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartReading,
  onOpenAudioReader,
  onExploreThemes
}) => {
  const [pendulumState, setPendulumState] = useState<'pain' | 'neutral' | 'boredom'>('neutral');

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-neutral-900/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle frost grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Right Column (Arabic RTL: Leading Content) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Clean unboxed metadata (anti-pill compliant) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-sans tracking-wide">
              <span className="text-amber-400 font-medium">رواية فلسفية</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>دراما نفسية</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>الطبعة الرقمية الأولى</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {BOOK_METADATA.totalEstimatedMinutes} دقيقة قراءة
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="font-cairo font-black text-4xl sm:text-5xl lg:text-6xl text-neutral-100 tracking-tight leading-[1.15] drop-shadow-sm">
                البرد الذي <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 via-amber-200 to-neutral-100">اخترق الجدران</span>
              </h1>
              <p className="font-amiri text-xl sm:text-2xl text-amber-100/80 italic font-medium leading-relaxed">
                عن أوهام السعادة وحقيقة الألم الممتدة
              </p>
            </div>

            {/* Book Hook / Narrative Summary */}
            <p className="font-sans text-neutral-300 text-base sm:text-lg leading-relaxed text-justify max-w-2xl font-light">
              رحلة أدبية ونفسية تفكك وهم السعادة الفطري؛ من طفل أُلقي به في زمهرير الشارع
              في سنوات العشرية السوداء ليتعلم القسوة من أنثى ذئب، إلى أب أمضى ثلاثين عاماً
              يبحث عن طفله في المشارح والمشافي، وصولاً إلى طفل وُلد محروماً من ضوء الشمس
              يعيش حبيس الليل وأوهام الرضا.
            </p>

            {/* Famous Quote Highlight */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border-r-4 border-amber-600 border border-neutral-800/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-amber-400/70 shrink-0 mt-1" />
                <div>
                  <p className="font-amiri text-lg text-neutral-200 leading-relaxed italic">
                    "الحياة تتأرجح كالبندول، ذهاباً وإياباً، بين الألم والملل... والسعادة ليست سوى هدنة قصيرة يمنحها لنا القدر."
                  </p>
                  <p className="text-xs text-amber-400/90 font-cairo font-semibold mt-2">
                    — آرثر شوبنهاور &amp; تأملات الرواية
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartReading()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-cairo font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-950/40 flex items-center gap-2 group cursor-pointer"
              >
                <span>ابدأ القراءة الآن</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>

              <button
                onClick={onOpenAudioReader}
                className="px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 font-cairo font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-amber-400" />
                <span>القارئ الصوتي التفاعلي</span>
              </button>

              <button
                onClick={onExploreThemes}
                className="px-4 py-3.5 text-xs text-neutral-400 hover:text-amber-300 font-sans transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>المحاور الفلسفية</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-3 gap-4 max-w-lg text-right">
              <div>
                <div className="text-2xl font-black font-cairo text-amber-300">4 + 1</div>
                <div className="text-xs text-neutral-400 font-sans">فصول مع المدخل الفلسفي</div>
              </div>
              <div>
                <div className="text-2xl font-black font-cairo text-neutral-200">3,850+</div>
                <div className="text-xs text-neutral-400 font-sans">كلمة من السرد المكثف</div>
              </div>
              <div>
                <div className="text-2xl font-black font-cairo text-neutral-200">100%</div>
                <div className="text-xs text-neutral-400 font-sans">نص كامل غير مقتطع</div>
              </div>
            </div>

          </div>

          {/* Left Column: 3D Book Presentation & Schopenhauer Pendulum */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* 3D Realistic Book Card */}
            <div className="relative group cursor-pointer perspective-1000 mb-8" onClick={() => onStartReading()}>
              
              {/* Soft ambient back glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 via-neutral-600/10 to-cyan-700/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-70 group-hover:opacity-100" />

              {/* Book Container with 3D spine and depth */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border border-neutral-700/60 transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1 bg-neutral-900 max-w-[320px] sm:max-w-[360px]">
                
                {/* Book Cover Image */}
                <img
                  src={BOOK_METADATA.coverImage}
                  alt={BOOK_METADATA.title}
                  className="w-full h-auto object-cover block select-none"
                  loading="eager"
                />

                {/* Subtle Book Spine Highlight on left edge */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 via-white/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-3 w-1 bg-black/40 pointer-events-none" />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center mb-3 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="font-cairo font-bold text-lg text-white">انقر لفتح الكتاب</span>
                  <span className="text-xs text-neutral-300 font-sans mt-1">تصفح النص الكامل مع الخطوط المريحة</span>
                </div>
              </div>

              {/* Book Base Shadow */}
              <div className="w-3/4 h-4 bg-black/60 blur-md rounded-full mx-auto mt-3" />
            </div>

            {/* Schopenhauer Pendulum Interactive Widget */}
            <div className="w-full max-w-[380px] p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md text-right">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-semibold text-neutral-300 font-cairo">
                  بندول شوبنهاور في الرواية
                </span>
                <span className="text-[11px] text-amber-400 font-sans">تأمل تفاعلي</span>
              </div>

              {/* Pendulum Animation Container */}
              <div className="relative h-24 flex flex-col items-center justify-start overflow-hidden">
                {/* Pendulum String & Bob */}
                <div className="w-full flex justify-between items-center px-4 text-xs font-cairo text-neutral-400">
                  <span className={`transition-colors ${pendulumState === 'pain' ? 'text-red-400 font-bold' : ''}`}>
                    الألم (المحرومية)
                  </span>
                  <span className={`transition-colors ${pendulumState === 'neutral' ? 'text-amber-300 font-bold' : ''}`}>
                    السعادة (هدنة خاطفة)
                  </span>
                  <span className={`transition-colors ${pendulumState === 'boredom' ? 'text-neutral-300 font-bold' : ''}`}>
                    الملل (الشبع)
                  </span>
                </div>

                {/* Animated swinging bar */}
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-3 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-neutral-400 rounded-full transition-all duration-1000 animate-pulse"
                  />
                </div>

                {/* Pendulum quote explanation */}
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed text-center mt-3">
                  "السعادة ليست سوى هدنة قصيرة يمنحها لنا القدر بين ألم ناتج عن المحرومية، وملل ناتج عن الشبع."
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => onStartReading('intro')}
                  className="text-amber-400 hover:text-amber-300 font-cairo flex items-center gap-1 cursor-pointer"
                >
                  <span>اقرأ المدخل الفلسفي</span>
                  <ChevronRight className="w-3 h-3 rotate-180" />
                </button>
                <span className="text-neutral-400 font-sans">شوبنهاور &amp; الرواية</span>
              </div>
            </div>

          </div>

        </div>

        {/* Chapters Overview Grid */}
        <div className="mt-20 pt-12 border-t border-neutral-800/80">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="font-cairo font-bold text-2xl sm:text-3xl text-neutral-100">
              فهرس فصول الرواية
            </h2>
            <p className="text-sm text-neutral-400 font-sans">
              خمس محطات تأخذك من وحشة التشرد إلى ذروة الانتقام ونهاية العدم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                onClick={() => onStartReading(ch.id)}
                className="p-5 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-600/40 transition-all duration-200 group cursor-pointer text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-neutral-400">
                      {ch.number === 0 ? 'مقدمة' : `فصل 0${ch.number}`}
                    </span>
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3" />
                      {ch.estimatedMinutes} دقيقة
                    </span>
                  </div>
                  <h3 className="font-cairo font-bold text-lg text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-sans mt-0.5 mb-2">
                    {ch.subtitle}
                  </p>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-3">
                    {ch.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 group-hover:text-amber-400 transition-colors">
                  <span className="font-cairo font-medium">قراءة الفصل</span>
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            ))}

            {/* Quick printable edition card */}
            <div
              onClick={() => window.print()}
              className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900/80 to-amber-950/20 border border-neutral-800 hover:border-amber-600/40 transition-all duration-200 group cursor-pointer text-right flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-cairo font-bold text-lg text-neutral-100 group-hover:text-amber-300 transition-colors">
                  النسخة الورقية للطباعة
                </h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">
                  تنسيق مصمم خصيصاً للتصدير والطباعة الورقية المباشرة أو الحفظ كملف PDF رقمي متكامل بصفحات مرقمة وغلاف فاخر.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-amber-400">
                <span className="font-cairo font-medium">فتح نافذة الطباعة</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
