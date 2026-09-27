import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, RotateCcw, Sparkles } from 'lucide-react';
import { RoundData, PerformanceType } from '../types/game';
import { PERFORMANCES_INFO } from '../data/roundsData';
import { audioEngine } from '../services/audioEngine';

interface MusicalSceneViewerProps {
  round: RoundData;
  placedType: PerformanceType | null;
  isCorrect: boolean | null;
  onDropCard: (type: PerformanceType) => void;
  onAudioPlay?: () => void;
}

export const MusicalSceneViewer: React.FC<MusicalSceneViewerProps> = ({
  round,
  placedType,
  isCorrect,
  onDropCard,
  onAudioPlay,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Play audio when entering an audio-focused round
  useEffect(() => {
    let stopFn: (() => void) | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (round.mode === 'audio') {
      setIsPlayingAudio(true);
      stopFn = audioEngine.playTrack(round.audioTrackType);
      timer = setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (stopFn) {
        stopFn();
      }
      audioEngine.stopAllTracks();
    };
  }, [round.id, round.mode, round.audioTrackType]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      audioEngine.stopAllTracks();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if (onAudioPlay) onAudioPlay();
      const stopFn = audioEngine.playTrack(round.audioTrackType);
      setTimeout(() => {
        setIsPlayingAudio(false);
        stopFn();
      }, 4200);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData('text/plain') as PerformanceType;
    if (type && PERFORMANCES_INFO[type]) {
      onDropCard(type);
    }
  };

  const placedInfo = placedType ? PERFORMANCES_INFO[placedType] : null;

  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl border-2 border-amber-200/80 shadow-xl overflow-hidden flex flex-col relative transition-all duration-300">
      {/* Top Header of the Scene */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 px-5 py-3 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {round.mode === 'audio' ? '🔊' : round.mode === 'visual' ? '👁️' : '🌟'}
          </span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
              {round.title}
            </h3>
            <span className="text-xs text-amber-800/80 font-medium">
              {round.subtitle} · {round.instrumentOrPerformer}
            </span>
          </div>
        </div>

        {/* Audio Control Button (Always available to listen to the model) */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isPlayingAudio
              ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
              : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>جاري الاستماع...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>استمع للنموذج الصوتي 🎵</span>
            </>
          )}
        </button>
      </div>

      {/* Main Visual or Audio Stage Canvas */}
      <div className="relative min-h-[260px] sm:min-h-[300px] bg-gradient-to-b from-sky-50/60 via-amber-50/30 to-amber-100/40 p-4 sm:p-6 flex flex-col items-center justify-between overflow-hidden">
        {/* Floating animated musical notes background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
          <span className="absolute top-4 left-10 text-2xl animate-bounce delay-100">🎵</span>
          <span className="absolute top-16 right-12 text-xl animate-pulse delay-300">🎶</span>
          <span className="absolute bottom-12 left-1/4 text-2xl animate-bounce delay-500">🎹</span>
          <span className="absolute bottom-6 right-1/4 text-xl animate-pulse">✨</span>
        </div>

        {/* Scene Graphic based on type */}
        <div className="w-full flex-1 flex flex-col items-center justify-center py-2 relative z-10">
          {/* Audio Visualizer Waves if in audio mode or playing */}
          {isPlayingAudio && (
            <div className="flex items-center justify-center gap-1.5 mb-4 py-2 px-4 bg-amber-500/10 rounded-2xl border border-amber-300/40">
              <span className="text-xs font-bold text-amber-800 ml-2">موجات الصوت:</span>
              {[28, 45, 65, 85, 50, 95, 70, 40, 80, 60, 90, 45, 75, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-amber-500 to-orange-400 rounded-full animate-pulse"
                  style={{
                    height: `${h * 0.4}px`,
                    animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Render the specific visual illustration */}
          <div className="max-w-md w-full flex items-center justify-center">
            {round.visualSceneType === 'organ_solo' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-sky-200 shadow-md w-full">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-sky-300">
                    🎹
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 mb-1">
                      آلة أورج موسيقية واحدة
                    </span>
                    <p className="text-sm font-semibold text-slate-700">
                      عازف واحد يبدع على لوحة المفاتيح
                    </p>
                  </div>
                </div>
                {/* Simulated Piano Keyboard Graphic */}
                <div className="mt-4 flex rounded-lg overflow-hidden border-2 border-slate-700 shadow-md">
                  {['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'].map((keyType, i) => (
                    <div
                      key={i}
                      className={`${
                        keyType === 'white'
                          ? 'w-6 h-16 bg-white border-r border-slate-300 hover:bg-sky-50'
                          : 'w-4 h-10 bg-slate-900 -mx-2 z-10'
                      } transition-colors flex items-end justify-center pb-1 text-[9px] text-slate-400`}
                    />
                  ))}
                </div>
              </div>
            )}

            {round.visualSceneType === 'band_group' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-md w-full">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
                  مجموعة متكاملة من الآلات تعزف معًا
                </span>
                <div className="grid grid-cols-3 gap-3 w-full my-2">
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center flex flex-col items-center">
                    <span className="text-2xl mb-1">🎹</span>
                    <span className="text-xs font-bold text-amber-900">أورج كهربائي</span>
                  </div>
                  <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200 text-center flex flex-col items-center">
                    <span className="text-2xl mb-1">🎺</span>
                    <span className="text-xs font-bold text-orange-900">آلة البوق</span>
                  </div>
                  <div className="bg-yellow-50 p-2.5 rounded-xl border border-yellow-200 text-center flex flex-col items-center">
                    <span className="text-2xl mb-1">🥁</span>
                    <span className="text-xs font-bold text-yellow-900">طبل وإيقاع</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  عزف متزامن يجمع أكثر من آلة موسيقية في آن واحد
                </p>
              </div>
            )}

            {round.visualSceneType === 'singer_solo' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-purple-200 shadow-md w-full">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-purple-300">
                    🎤
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-1">
                      مؤدٍ غنائي واحد
                    </span>
                    <p className="text-sm font-semibold text-slate-700">
                      صوت بشري نقي يغني بمفرده على المسرح
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-purple-700 text-xs font-bold bg-purple-50 px-3 py-1.5 rounded-xl">
                  <span>✨</span>
                  <span>الصوت نابع من حنجرة مؤدٍ واحد فقط دون مشاركة أصوات أخرى</span>
                </div>
              </div>
            )}

            {round.visualSceneType === 'choir_group' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-md w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                    👥 مجموعة مؤدين = «الكورال»
                  </span>
                </div>
                <div className="flex justify-center items-end gap-3 my-2">
                  <div className="flex flex-col items-center bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center">
                    <span className="text-xl">👦🎤</span>
                    <span className="text-[11px] font-bold text-emerald-900">مؤدٍ 1</span>
                  </div>
                  <div className="flex flex-col items-center bg-emerald-100 p-2.5 rounded-xl border border-emerald-300 text-center scale-105">
                    <span className="text-2xl">👧🎤</span>
                    <span className="text-[11px] font-bold text-emerald-900">مؤدٍ 2</span>
                  </div>
                  <div className="flex flex-col items-center bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-center">
                    <span className="text-xl">🧒🎤</span>
                    <span className="text-[11px] font-bold text-emerald-900">مؤدٍ 3</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  أصوات بشرية متعددة تغني معًا بتوافق ونغم موحّد
                </p>
              </div>
            )}

            {round.visualSceneType === 'oud_solo' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-amber-300 shadow-md w-full">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-amber-300">
                    🪕
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1">
                      آلة العود التراثية المنفردة
                    </span>
                    <p className="text-sm font-semibold text-slate-700">
                      عازف عود عماني ماهر يعزف بمفرده
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-2 text-center">
                  آلة وترية أصيلة واحدة تؤدي النغمات بدون فرقة
                </p>
              </div>
            )}

            {round.visualSceneType === 'orchestra_group' && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-orange-200 shadow-md w-full">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 mb-2">
                  الأوركسترا الموسيقية المتكاملة
                </span>
                <div className="flex items-center justify-center gap-4 text-3xl py-2">
                  <span>🎻</span>
                  <span>🎺</span>
                  <span>🥁</span>
                  <span>🎹</span>
                </div>
                <p className="text-xs font-medium text-slate-600 text-center">
                  عشرات الآلات الوترية والهوائية والإيقاعية تعزف معًا
                </p>
              </div>
            )}

            {(round.visualSceneType === 'school_solo_singer' || round.visualSceneType === 'children_choir') && (
              <div className="flex flex-col items-center bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-md w-full">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
                  {round.visualSceneType === 'school_solo_singer' ? 'غناء فردي على خشبة المسرح 🎤' : 'كورال الأطفال الختامي 👥🎤'}
                </span>
                <div className="text-3xl my-2">
                  {round.visualSceneType === 'school_solo_singer' ? '👩‍🎓🎤' : '👦👧🧑👩‍🎓🎤'}
                </div>
                <p className="text-xs font-medium text-slate-600 text-center">
                  {round.scenarioDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Droppable Answer Placement Zone (منطقة وضع الإجابة الصحيحة) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-lg mt-3 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[90px] relative z-20 ${
            isDragOver
              ? 'border-dashed border-amber-500 bg-amber-100/90 scale-102 shadow-inner'
              : placedInfo
              ? isCorrect
                ? 'border-emerald-400 bg-emerald-50/95 shadow-md ring-2 ring-emerald-300'
                : 'border-amber-400 bg-amber-50/95 shadow-sm'
              : 'border-dashed border-slate-300 bg-white/80 hover:bg-white'
          }`}
        >
          {placedInfo ? (
            <div className="flex flex-col items-center text-center animate-scale-up w-full">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{placedInfo.icon}</span>
                <span className={`text-base sm:text-lg font-black ${placedInfo.textClass}`}>
                  {placedInfo.title}
                </span>
                {isCorrect && (
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              {/* Instant feedback summary */}
              <div className="mt-2 text-xs sm:text-sm font-bold text-slate-700">
                {isCorrect ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    {round.successMessage}
                  </span>
                ) : (
                  <span className="text-amber-800">
                    {round.hintMessage}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500">
                <span className="text-amber-500 text-lg">🎯</span>
                <span>اسحب البطاقة الصحيحة إلى هنا، أو انقر عليها بالأسفل</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">
                اختر من البطاقات الأربعة لتحديد نوع الأداء
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
