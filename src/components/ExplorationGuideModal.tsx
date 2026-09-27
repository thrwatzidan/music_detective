import React, { useState } from 'react';
import { X, Volume2, BookOpen, Music, Check } from 'lucide-react';
import { PERFORMANCES_INFO } from '../data/roundsData';
import { PerformanceType } from '../types/game';
import { audioEngine } from '../services/audioEngine';

interface ExplorationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplorationGuideModal: React.FC<ExplorationGuideModalProps> = ({ isOpen, onClose }) => {
  const [playingType, setPlayingType] = useState<PerformanceType | null>(null);

  if (!isOpen) return null;

  const handlePlaySample = (type: PerformanceType) => {
    if (playingType === type) {
      audioEngine.stopAllTracks();
      setPlayingType(null);
    } else {
      setPlayingType(type);
      let stopFn = () => {};
      if (type === 'instrumental_solo') stopFn = audioEngine.playSoloOrgan();
      if (type === 'instrumental_group') stopFn = audioEngine.playGroupEnsemble();
      if (type === 'vocal_solo') stopFn = audioEngine.playSoloVoice();
      if (type === 'vocal_group') stopFn = audioEngine.playChoirGroup();

      setTimeout(() => {
        setPlayingType(null);
        stopFn();
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-inner">
              📖
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                دليل الأنواع الأربعة للأداء الموسيقي
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                ملخص الدرس والأنشطة المدرسية مع نماذج صوتية حية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioEngine.stopAllTracks();
              audioEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 4 Cards List */}
        <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
          {Object.values(PERFORMANCES_INFO).map((info) => {
            const isPlaying = playingType === info.id;
            return (
              <div
                key={info.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-amber-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-slate-800">
                        {info.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${info.accentClass}`}>
                        البطاقة {info.colorName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {info.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      💡 {info.conceptRule}
                    </div>
                  </div>
                </div>

                {/* Sample Audio Button */}
                <button
                  type="button"
                  onClick={() => handlePlaySample(info.id)}
                  className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isPlaying
                      ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-amber-50'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>{isPlaying ? 'جاري الاستماع...' : 'عينة صوتية 🔊'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            تذكر: آلي = عزف آلات · غنائي = صوت بشري · منفرد = واحد · جماعي = مجموعة (الكورال)
          </span>
          <button
            type="button"
            onClick={() => {
              audioEngine.stopAllTracks();
              audioEngine.playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
