import React, { useState } from 'react';
import { Compass, BookOpen, Quote, ChevronDown, ChevronUp, CheckCircle2, RefreshCw } from 'lucide-react';
import { PHILOSOPHICAL_THEMES, PhilosophicalTopic } from '../data/novelData';

export const PhilosophySection: React.FC = () => {
  const [expandedTopic, setExpandedTopic] = useState<string>(PHILOSOPHICAL_THEMES[0].id);

  // Interactive Philosophical Questionnaire
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: "حين تتذكر ذكرى حزينة قديمة، وذكرى سعيدة من نفس الفترة؛ أيهما يترك أثراً شعورياً أقوى في حاضرك؟",
      options: [
        { label: "الحزن يعود بثقله كاملاً وكأنه حدث بالأمس (قاعدة الألم)", score: 2 },
        { label: "كلاهما يتلاشى مع الزمن بالتساوي", score: 1 },
        { label: "السعادة تدوم ذكراها وتمنحني أملاً متجدداً", score: 0 }
      ]
    },
    {
      q: "عندما تبلغ هدفاً كبيراً طالما سعيت خلفه وسهرت لأجله؛ كيف يكون شعورك بعد بضعة أسابيع من تحقيقه؟",
      options: [
        { label: "أشعر بالملل والفراغ، وأبدأ فوراً في القلق بحثاً عن هدف آخر (فخ الدوبامين)", score: 2 },
        { label: "أشعر بالرضا لفترة لكن الحياة تستأنف روتينها", score: 1 },
        { label: "أبقى سعيداً وفخوراً باستمرار دون شعور بالنقص", score: 0 }
      ]
    },
    {
      q: "ما رأيك في مفهوم الرضا الذي انتهت إليه رسالة أمير الظلام في الفصل الأخير؟",
      options: [
        { label: "هو الملاذ الإنساني الحقيقي الوحيد؛ لأن الطمع والمطالبة بالمزيد يقودان للعدم", score: 2 },
        { label: "فكرة جميلة لكنها صعبة التحقق في عالم قاسٍ", score: 1 },
        { label: "استسلام سلبي للواقع وكان عليه أن يستمر في المقاومة", score: 0 }
      ]
    }
  ];

  const handleSelectQuiz = (qIdx: number, optScore: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optScore }));
  };

  const calculateResult = () => {
    const total = Object.values(quizAnswers).reduce((a, b) => a + b, 0);
    if (total >= 5) {
      return {
        title: "رؤية شوبنهاورية عميقة (تدرك حقيقة البندول)",
        desc: "تتفق نظرتك تماماً مع منطلق الرواية وفلسفة شوبنهاور؛ ترى أن السعادة استثناء خاطف في قاعدة الألم الممتدة، وتدرك أن فهم هذا الوهم هو أولى درجات الحكمة لتجنب الخيبات العظمى."
      };
    } else if (total >= 3) {
      return {
        title: "نظرة واقعية متأرجحة (بين الوعي والرجاء)",
        desc: "تختبر أحياناً ثقل الحزن وفراغ الأهداف بعد تحقيقها، لكنك لا تزال تحتفظ بمساحة أمل في أن الرضا والتصالح مع الذات يمكن أن يكسرا حلقة البرد الدائم."
      };
    } else {
      return {
        title: "رؤية متفائلة مقاومة للعدم",
        desc: "تميل إلى مقاومة التشاؤم الوجودي، وترى في المعاناة محطة عابرة وليست أصلاً دائماً، وهي نظرة تخالف سردية 'الضائع' لكنها تتقاطع مع حنينه المكبوت لحنان أمه المفقود."
      };
    }
  };

  return (
    <section className="py-20 border-t border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans tracking-wide">
            <Compass className="w-4 h-4" />
            <span>العمق الفكري والأطروحات الوجودية</span>
          </div>
          <h2 className="font-cairo font-black text-3xl sm:text-4xl text-neutral-100">
            المحاور الفلسفية للرواية
          </h2>
          <p className="font-sans text-sm text-neutral-400 leading-relaxed">
            الرواية ليست مجرد حكاية درامية؛ بل هي تشريح فلسفي صارم لطبيعة الرغبة الإنسانية وأوهام السعادة.
          </p>
        </div>

        {/* Accordion / Cards of Philosophical Themes */}
        <div className="space-y-4 max-w-4xl mx-auto mb-16">
          {PHILOSOPHICAL_THEMES.map((theme) => {
            const isExpanded = expandedTopic === theme.id;
            return (
              <div
                key={theme.id}
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800 transition-all duration-300 overflow-hidden text-right"
              >
                <button
                  onClick={() => setExpandedTopic(isExpanded ? '' : theme.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-right cursor-pointer hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-cairo font-bold text-base sm:text-lg text-neutral-100">
                        {theme.title}
                      </h3>
                      {theme.philosopher && (
                        <div className="text-xs text-amber-400 font-sans mt-0.5">
                          تأصيل: {theme.philosopher}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-1 rounded-full text-neutral-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-800/80 space-y-4 animate-in fade-in duration-200">
                    {/* Philosophical Quote */}
                    <div className="p-4 rounded-xl bg-neutral-950/70 border-r-4 border-amber-600 text-right">
                      <p className="font-amiri text-lg text-amber-200 italic leading-relaxed">
                        "{theme.quote}"
                      </p>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-cairo font-bold text-neutral-400">
                        الأصل الفلسفي والعلمي:
                      </h4>
                      <p className="font-sans text-sm text-neutral-300 leading-relaxed text-justify">
                        {theme.explanation}
                      </p>
                    </div>

                    {/* Novel reflection */}
                    <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800/80 space-y-1">
                      <h4 className="text-xs font-cairo font-bold text-amber-400">
                        تجسيد الفكرة في مسار الرواية:
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed text-justify">
                        {theme.bookReflection}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Philosophical Test / Questionnaire */}
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-xl text-right">
          <div className="border-b border-neutral-800 pb-4 mb-6">
            <span className="text-xs font-cairo font-bold text-amber-400">
              تجربة فكرية تفاعلية
            </span>
            <h3 className="font-cairo font-bold text-xl sm:text-2xl text-neutral-100 mt-1">
              أين يقف عقلك بين وهم السعادة وبندول الألم؟
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              أجب عن هذه التساؤلات الوجودية الثلاثة المستوحاة من الرواية لتقيس تطابق رؤيتك مع فلسفتها:
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((qItem, qIdx) => (
              <div key={qIdx} className="space-y-2.5">
                <p className="font-cairo font-semibold text-sm sm:text-base text-neutral-200">
                  {qIdx + 1}. {qItem.q}
                </p>
                <div className="space-y-2">
                  {qItem.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === opt.score;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuiz(qIdx, opt.score)}
                        className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm font-sans transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-950/40 text-amber-200 font-semibold'
                            : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mr-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Action / Result */}
          <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setShowQuizResult(true)}
              disabled={Object.keys(quizAnswers).length < 3}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-neutral-950 font-cairo font-bold text-xs transition-all cursor-pointer"
            >
              عرض قراءة الفيلسوف
            </button>

            {showQuizResult && (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setShowQuizResult(false);
                }}
                className="text-xs text-neutral-400 hover:text-amber-300 font-sans flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة الاختبار</span>
              </button>
            )}
          </div>

          {/* Result Card */}
          {showQuizResult && Object.keys(quizAnswers).length === 3 && (
            <div className="mt-6 p-5 rounded-2xl bg-amber-950/30 border border-amber-600/50 space-y-2 animate-in fade-in duration-300">
              <h4 className="font-cairo font-bold text-base text-amber-300">
                {calculateResult().title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {calculateResult().desc}
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
