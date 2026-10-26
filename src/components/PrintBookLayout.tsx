import React from 'react';
import { BOOK_METADATA, CHAPTERS } from '../data/novelData';

export const PrintBookLayout: React.FC = () => {
  return (
    <div dir="rtl" className="hidden print:block print-book text-neutral-900 bg-white p-0">
      
      {/* Cover Page */}
      <div className="print-page-break min-h-screen flex flex-col justify-between items-center text-center p-16 border-8 border-neutral-900">
        <div className="pt-20">
          <h1 className="font-cairo text-5xl font-black text-neutral-900 leading-tight mb-4">
            {BOOK_METADATA.title}
          </h1>
          <p className="font-cairo text-2xl text-neutral-700 font-light">
            {BOOK_METADATA.subtitle}
          </p>
        </div>

        <div className="my-10">
          <div className="w-16 h-1 bg-neutral-900 mx-auto mb-6" />
          <p className="font-amiri italic text-xl text-neutral-800">
            "الحياة تتأرجح كالبندول، ذهاباً وإياباً، بين الألم والملل."
          </p>
          <p className="font-cairo text-sm text-neutral-600 mt-2">
            — آرثر شوبنهاور
          </p>
        </div>

        <div className="pb-10 font-cairo text-base text-neutral-600 tracking-wider">
          {BOOK_METADATA.genre} · {BOOK_METADATA.edition}
        </div>
      </div>

      {/* Title Page */}
      <div className="print-page-break min-h-screen flex flex-col justify-center items-center text-center p-16">
        <h2 className="font-cairo text-4xl font-bold text-neutral-900 mb-4">
          {BOOK_METADATA.title}
        </h2>
        <p className="font-sans text-xl text-neutral-600 mb-8">
          عمل أدبي روائي ودراما نفسية
        </p>
        <div className="w-24 h-0.5 bg-neutral-300 mx-auto mb-8" />
        <p className="text-sm text-neutral-500 font-sans">
          نسخة القراءة الكاملة المطبوعة
        </p>
      </div>

      {/* Chapters Output */}
      {CHAPTERS.map((ch, idx) => (
        <div key={ch.id} className="print-page-break p-12 text-justify">
          <div className="text-center mb-8 border-b-2 border-neutral-200 pb-6">
            <span className="text-xs uppercase font-sans tracking-widest text-neutral-500">
              {ch.number === 0 ? 'المدخل الفلسفي' : `الفصل 0${ch.number}`}
            </span>
            <h2 className="font-cairo text-3xl font-black text-neutral-900 mt-2 mb-2">
              {ch.title}
            </h2>
            <p className="font-amiri text-lg text-neutral-700 italic">
              {ch.subtitle}
            </p>
          </div>

          <div className="space-y-4 font-amiri text-lg text-neutral-900 leading-loose">
            {ch.items.map((item) => {
              if (item.type === 'quote') {
                return (
                  <div key={item.id} className="my-6 p-6 bg-neutral-50 border-r-4 border-neutral-900 text-right">
                    <p className="font-amiri italic text-xl">"{item.text}"</p>
                    {item.author && (
                      <p className="font-cairo text-sm font-bold text-neutral-700 mt-2">
                        — {item.author}
                      </p>
                    )}
                  </div>
                );
              }
              if (item.type === 'dialogue') {
                return (
                  <div key={item.id} className="pr-4 border-r-2 border-neutral-400 my-2">
                    <span className="font-cairo font-bold text-base text-neutral-900">
                      {item.speaker} {item.emotion && `(${item.emotion})`}:
                    </span>{' '}
                    <span>"{item.text}"</span>
                  </div>
                );
              }
              if (item.type === 'break') {
                return (
                  <div key={item.id} className="text-center my-6 text-neutral-400">
                    • • •
                  </div>
                );
              }
              return (
                <p key={item.id} className="indent-8 text-justify">
                  {item.text}
                </p>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
};
