import React, { useState } from 'react';
import { Users, Sparkles, Quote, ChevronLeft } from 'lucide-react';
import { CHARACTERS, Character } from '../data/novelData';

interface CharactersSectionProps {
  onReadChapterWithCharacter?: (chapterId: string) => void;
}

export const CharactersSection: React.FC<CharactersSectionProps> = ({
  onReadChapterWithCharacter
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);

  return (
    <section className="py-20 border-t border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans tracking-wide">
            <Users className="w-4 h-4" />
            <span>دراسة الشخصيات والدراما النفسية</span>
          </div>
          <h2 className="font-cairo font-black text-3xl sm:text-4xl text-neutral-100">
            أبطال المأساة وضحايا القدر
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            شخصيات تتأرجح في عوالم الظلام والذنب والبحث عن الذات؛ لكل منهم قيده ومأساته الوجودية الخاصة.
          </p>
        </div>

        {/* Character Navigation / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-950/40 text-amber-200 font-bold shadow-lg shadow-amber-950/30'
                    : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="text-[10px] text-neutral-400 font-mono truncate mb-1">
                  {char.role.split(' ')[0]}
                </div>
                <div className="font-cairo text-xs sm:text-sm truncate">
                  {char.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Character Deep Profile Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md relative overflow-hidden">
          {/* Subtle back ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 text-right">
            
            {/* Right: Character Info (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-cairo font-semibold text-amber-400">
                  {selectedCharacter.role}
                </span>
                <h3 className="font-cairo font-black text-2xl sm:text-3xl text-neutral-100 mt-1">
                  {selectedCharacter.name}
                </h3>
              </div>

              {/* Psychological Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-cairo">
                  السيرة والسيكولوجيا
                </h4>
                <p className="font-sans text-neutral-300 text-sm sm:text-base leading-relaxed text-justify">
                  {selectedCharacter.description}
                </p>
              </div>

              {/* Philosophical Symbolism */}
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-cairo font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>البعد الفلسفي والرمزي للشخصية</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed text-justify">
                  {selectedCharacter.symbolism}
                </p>
              </div>
            </div>

            {/* Left: Key Quotes for this character (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-cairo">
                أبرز ما نطق به في الرواية
              </h4>

              <div className="space-y-3">
                {selectedCharacter.keyQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-950/80 border-r-3 border-amber-600 border border-neutral-800/60 space-y-2"
                  >
                    <Quote className="w-4 h-4 text-amber-500/70" />
                    <p className="font-amiri text-base sm:text-lg text-neutral-200 italic leading-relaxed">
                      "{q}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Jump Action */}
              {onReadChapterWithCharacter && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (selectedCharacter.id === 'lost-one') onReadChapterWithCharacter('chapter-1');
                      else if (selectedCharacter.id === 'moon-child') onReadChapterWithCharacter('chapter-3');
                      else onReadChapterWithCharacter('chapter-2');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-cairo text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>قراءة الفصول المرتبطة بهذه الشخصية</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
