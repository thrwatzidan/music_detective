import React from 'react';
import { SCHOOL_STATIONS } from '../data/roundsData';

interface MusicTrainProgressProps {
  currentRound: number;
  totalRounds: number;
  starsCount: number;
  currentStationIndex: number;
}

export const MusicTrainProgress: React.FC<MusicTrainProgressProps> = ({
  currentRound,
  totalRounds,
  starsCount,
  currentStationIndex,
}) => {
  return (
    <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/90 shadow-sm p-3 sm:p-4 mb-4">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚂</span>
          <span className="font-extrabold text-amber-900">
            القطار الموسيقي المدرسي
          </span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            (الجولة {currentRound} من {totalRounds})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Stars Counter */}
          <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-amber-900 font-black">
            <span className="text-amber-500 text-base">⭐</span>
            <span className="tabular-nums">{starsCount}</span>
            <span className="text-[11px] text-amber-700 font-bold">نجمة</span>
          </div>
        </div>
      </div>

      {/* Musical Track with 4 Stations */}
      <div className="relative pt-2 pb-1">
        {/* Track Line */}
        <div className="absolute top-6 left-6 right-6 h-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 rounded-full">
          {/* Animated Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((currentRound - 1) / (totalRounds - 1)) * 100)}%` }}
          />
        </div>

        {/* Stations Nodes */}
        <div className="relative flex justify-between items-center z-10 px-2">
          {SCHOOL_STATIONS.map((station, idx) => {
            const isCurrent = idx === currentStationIndex;
            const isPassed = idx < currentStationIndex;

            return (
              <div
                key={station.id}
                className="flex flex-col items-center group relative cursor-pointer"
                title={`${station.name}: ${station.description}`}
              >
                {/* Station Node Badge */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-base sm:text-xl transition-all duration-300 border-2 ${
                    isCurrent
                      ? 'bg-amber-400 border-amber-600 scale-125 shadow-lg ring-4 ring-amber-200 animate-pulse'
                      : isPassed
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCurrent ? '🚂' : station.icon}
                </div>

                {/* Station Label */}
                <span
                  className={`text-[10px] sm:text-xs font-bold mt-1.5 text-center transition-colors max-w-[70px] sm:max-w-none leading-tight ${
                    isCurrent
                      ? 'text-amber-900 font-extrabold'
                      : isPassed
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {station.shortName}
                </span>

                {/* Target milestone tag */}
                <span className="text-[9px] text-slate-400 font-mono hidden sm:block">
                  {station.targetStars} ⭐
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
