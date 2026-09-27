/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { OmaniDetectiveBoy, BoyExpression } from './components/OmaniDetectiveBoy';
import { MusicalSceneViewer } from './components/MusicalSceneViewer';
import { ClassificationCards } from './components/ClassificationCards';
import { MusicTrainProgress } from './components/MusicTrainProgress';
import { MagicKeyModal } from './components/MagicKeyModal';
import { ExplorationGuideModal } from './components/ExplorationGuideModal';
import { GraduationModal } from './components/GraduationModal';
import { ROUNDS_DATA, PERFORMANCES_INFO, SCHOOL_STATIONS } from './data/roundsData';
import { PerformanceType, GameMode } from './types/game';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('mixed');
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [starsCount, setStarsCount] = useState<number>(0);
  const [placedType, setPlacedType] = useState<PerformanceType | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [boyExpression, setBoyExpression] = useState<BoyExpression>('greeting');
  const [boySpeech, setBoySpeech] = useState<string>(
    'مرحبًا! أنا المحقق الموسيقي، هل تساعدني في اكتشاف نوع الأداء؟'
  );
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isMagicKeyOpen, setIsMagicKeyOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isGraduationOpen, setIsGraduationOpen] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Filter rounds according to mode
  const filteredRounds = React.useMemo(() => {
    if (gameMode === 'visual') {
      return ROUNDS_DATA.filter((r) => r.mode === 'visual' || r.mode === 'mixed');
    }
    if (gameMode === 'audio') {
      return ROUNDS_DATA.filter((r) => r.mode === 'audio' || r.mode === 'mixed');
    }
    return ROUNDS_DATA;
  }, [gameMode]);

  const currentRound = filteredRounds[currentRoundIndex] || filteredRounds[0];

  // Station calculation
  const currentStationIndex = Math.min(
    SCHOOL_STATIONS.length - 1,
    Math.floor((currentRoundIndex / filteredRounds.length) * SCHOOL_STATIONS.length)
  );

  // Initial welcome voice on game start
  useEffect(() => {
    if (hasStarted) {
      setBoyExpression(currentRound.mode === 'audio' ? 'listening' : 'guiding');
      setBoySpeech(currentRound.boyPrompt);
    }
  }, [hasStarted, currentRoundIndex, currentRound]);

  const handleStartGame = () => {
    audioEngine.playClickSound();
    setHasStarted(true);
    setBoyExpression(currentRound.mode === 'audio' ? 'listening' : 'guiding');
    setBoySpeech(currentRound.boyPrompt);
  };

  // Toggle Sound Mute
  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audioEngine.isMuted = nextMuted;
    if (nextMuted) {
      audioEngine.stopAllTracks();
    }
  };

  // Switch Game Mode
  const handleModeChange = (mode: GameMode) => {
    audioEngine.playClickSound();
    setGameMode(mode);
    setCurrentRoundIndex(0);
    setPlacedType(null);
    setIsCorrect(null);
    setStarsCount(0);
    setHasStarted(true);
  };

  // Evaluate card placement / selection
  const handleSelectCard = (type: PerformanceType) => {
    if (isCorrect) return; // already solved

    setPlacedType(type);

    if (type === currentRound.type) {
      // Correct!
      setIsCorrect(true);
      setStarsCount((prev) => prev + 1);
      setBoyExpression('celebrating');
      setBoySpeech(currentRound.successMessage);
      audioEngine.playCorrectChime();

      // Check if finished all rounds
      if (currentRoundIndex === filteredRounds.length - 1) {
        setTimeout(() => {
          setIsGraduationOpen(true);
        }, 1600);
      } else {
        // Auto advance after brief celebration
        setTimeout(() => {
          handleNextRound();
        }, 2200);
      }
    } else {
      // Not quite correct - gentle, encouraging educational feedback
      setIsCorrect(false);
      setBoyExpression('thinking');
      setBoySpeech(currentRound.hintMessage);
      audioEngine.playHintTone();
    }
  };

  const handleNextRound = () => {
    if (currentRoundIndex < filteredRounds.length - 1) {
      const nextIndex = currentRoundIndex + 1;
      const nextStation = Math.floor((nextIndex / filteredRounds.length) * SCHOOL_STATIONS.length);
      if (nextStation > currentStationIndex) {
        audioEngine.playTrainWhistle();
      }
      setCurrentRoundIndex(nextIndex);
      setPlacedType(null);
      setIsCorrect(null);
      const nextRound = filteredRounds[nextIndex];
      setBoyExpression(nextRound.mode === 'audio' ? 'listening' : 'guiding');
      setBoySpeech(nextRound.boyPrompt);
    } else {
      setIsGraduationOpen(true);
    }
  };

  const handlePreviousRound = () => {
    if (currentRoundIndex > 0) {
      const prevIndex = currentRoundIndex - 1;
      setCurrentRoundIndex(prevIndex);
      setPlacedType(null);
      setIsCorrect(null);
      const prevRound = filteredRounds[prevIndex];
      setBoyExpression(prevRound.mode === 'audio' ? 'listening' : 'guiding');
      setBoySpeech(prevRound.boyPrompt);
    }
  };

  const handleRestart = () => {
    setIsGraduationOpen(false);
    setCurrentRoundIndex(0);
    setStarsCount(0);
    setPlacedType(null);
    setIsCorrect(null);
    setHasStarted(false);
    setBoyExpression('greeting');
    setBoySpeech('مرحبًا! أنا المحقق الموسيقي، هل تساعدني في اكتشاف نوع الأداء؟');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-sky-50/50 flex flex-col justify-between selection:bg-amber-200">
      {/* Top Bar Contract (Single Row, 3 Zones) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-amber-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg font-black shadow-xs">
              🎵
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              المحقق الموسيقي
            </span>
          </div>

          {/* Zone 2: Navigation / Mode Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-amber-100/60 p-1 rounded-xl border border-amber-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleModeChange('mixed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                gameMode === 'mixed'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 مغامرة المحقق
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('visual')}
              className={`px-3 py-1 rounded-lg transition-all ${
                gameMode === 'visual'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👁️ الوضع المرئي
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('audio')}
              className={`px-3 py-1 rounded-lg transition-all ${
                gameMode === 'audio'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔊 الوضع السمعي
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Magic Key, Guide, Mute, Stars) */}
          <div className="flex items-center gap-2">
            {/* Guide Button */}
            <button
              type="button"
              onClick={() => {
                audioEngine.playClickSound();
                setIsGuideOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs"
              title="دليل الأنواع الأربعة"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دليل الأنواع</span>
            </button>

            {/* Magic Key Button */}
            <button
              type="button"
              onClick={() => {
                audioEngine.playClickSound();
                setIsMagicKeyOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black hover:bg-amber-600 transition-colors shadow-xs shadow-amber-500/20 active:scale-95"
              title="المفتاح السحري للمساعدة"
            >
              <Key className="w-3.5 h-3.5" />
              <span>المفتاح السحري 🔍</span>
            </button>

            {/* Audio Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-colors ${
                isAudioMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-300'
                  : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
              }`}
              title={isAudioMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col items-center">
        {!hasStarted ? (
          /* Welcome Screen (شاشة البداية أمام المدرسة الموسيقية مع الفتى العماني) */
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl border-2 border-amber-300 shadow-xl p-6 sm:p-8 flex flex-col items-center text-center my-auto animate-scale-up">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 mb-3 border border-amber-300">
              🏫 مدرسة الموسيقى والتمييز السمعي والتربية الفنية
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              المحقق الموسيقي 🎵
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-md mt-2 font-medium">
              رحلة استكشافية مشوقة لاكتشاف أنواع الأداء الموسيقي (الآلي والغنائي، المنفرد والجماعي).
            </p>

            {/* Omani Detective Boy Character Showcase */}
            <div className="my-6">
              <OmaniDetectiveBoy
                expression="greeting"
                speechText="مرحبًا! أنا المحقق الموسيقي، هل تساعدني في اكتشاف نوع الأداء؟"
                size="lg"
                showSpeechBubble={true}
              />
            </div>

            {/* Mode Selection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6 text-right">
              <button
                type="button"
                onClick={() => setGameMode('mixed')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 cursor-pointer ${
                  gameMode === 'mixed'
                    ? 'border-amber-500 bg-amber-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🌟</span>
                  <span className="text-xs font-bold text-amber-900">المغامرة الكاملة</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  12 جولة تجمع بين المشاهدة والاستماع
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('visual')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 cursor-pointer ${
                  gameMode === 'visual'
                    ? 'border-blue-500 bg-blue-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">👁️</span>
                  <span className="text-xs font-bold text-blue-900">المستوى 1: شاهد وصنّف</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  الاعتماد على النماذج المرئية
                </span>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('audio')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 cursor-pointer ${
                  gameMode === 'audio'
                    ? 'border-purple-500 bg-purple-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">🔊</span>
                  <span className="text-xs font-bold text-purple-900">المستوى 2: اسمع واكتشف</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  التمييز السمعي للنغمات والهارموني
                </span>
              </button>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-500/30 transition-all cursor-pointer transform hover:scale-102 active:scale-98"
            >
              ابدأ المغامرة الموسيقية الآن 🚀
            </button>
          </div>
        ) : (
          /* Active Playing Canvas */
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* The Casual Game Train Progress (القطار الموسيقي) */}
            <MusicTrainProgress
              currentRound={currentRoundIndex + 1}
              totalRounds={filteredRounds.length}
              starsCount={starsCount}
              currentStationIndex={currentStationIndex}
            />

            {/* Middle Section: Omani Boy Guide + Musical Scene */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 my-2">
              {/* Character Guide Avatar (الفتى العماني المحقق) */}
              <div className="shrink-0 flex flex-col items-center">
                <OmaniDetectiveBoy
                  expression={boyExpression}
                  speechText={boySpeech}
                  size="md"
                  showSpeechBubble={true}
                />
              </div>

              {/* Central Musical Situation Scene & Drop Zone */}
              <div className="flex-1 w-full max-w-2xl flex flex-col items-center">
                <MusicalSceneViewer
                  round={currentRound}
                  placedType={placedType}
                  isCorrect={isCorrect}
                  onDropCard={handleSelectCard}
                  onAudioPlay={() => setBoyExpression('listening')}
                />
              </div>
            </div>

            {/* The 4 Classification Cards (البطاقات الأربعة) */}
            <ClassificationCards
              selectedType={placedType}
              onSelectCard={handleSelectCard}
              disabled={isCorrect === true}
            />

            {/* Round Controls Footer */}
            <div className="w-full max-w-3xl mt-4 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={handlePreviousRound}
                disabled={currentRoundIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الجولة السابقة</span>
              </button>

              <span className="font-mono font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-full">
                الجولة {currentRoundIndex + 1} من {filteredRounds.length}
              </span>

              <button
                type="button"
                onClick={handleNextRound}
                disabled={!isCorrect && currentRoundIndex === filteredRounds.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-amber-900"
              >
                <span>الجولة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Educational Footer */}
      <footer className="mt-8 border-t border-amber-200/80 bg-white/70 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            🎵 المحقق الموسيقي · لعبة تعليمية تفاعلية لتصنيف الأداء الموسيقي
          </span>
          <div className="flex items-center gap-3">
            <span>آلي ↔ غنائي</span>
            <span>·</span>
            <span>منفرد ↔ جماعي</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MagicKeyModal
        isOpen={isMagicKeyOpen}
        onClose={() => setIsMagicKeyOpen(false)}
      />

      <ExplorationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <GraduationModal
        isOpen={isGraduationOpen}
        starsCount={starsCount}
        totalRounds={filteredRounds.length}
        onRestart={handleRestart}
      />
    </div>
  );
}
