import React from 'react';
import { PerformanceType } from '../types/game';
import { PERFORMANCES_INFO } from '../data/roundsData';
import { audioEngine } from '../services/audioEngine';

interface ClassificationCardsProps {
  selectedType: PerformanceType | null;
  onSelectCard: (type: PerformanceType) => void;
  disabled?: boolean;
}

export const ClassificationCards: React.FC<ClassificationCardsProps> = ({
  selectedType,
  onSelectCard,
  disabled = false,
}) => {
  const cards: { type: PerformanceType; title: string; subtitle: string; icon: string; bgGradient: string; border: string; shadow: string }[] = [
    {
      type: 'instrumental_solo',
      title: 'أداء آلي منفرد',
      subtitle: 'آلة موسيقية واحدة',
      icon: '🎹',
      bgGradient: 'from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
      border: 'border-sky-300 ring-sky-400',
      shadow: 'shadow-sky-500/25',
    },
    {
      type: 'instrumental_group',
      title: 'أداء آلي جماعي',
      subtitle: 'مجموعة آلات موسيقية',
      icon: '🎹🎺',
      bgGradient: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
      border: 'border-amber-300 ring-amber-400',
      shadow: 'shadow-amber-500/25',
    },
    {
      type: 'vocal_solo',
      title: 'أداء غنائي منفرد',
      subtitle: 'مؤدٍ غنائي واحد',
      icon: '🎤',
      bgGradient: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      border: 'border-purple-300 ring-purple-400',
      shadow: 'shadow-purple-500/25',
    },
    {
      type: 'vocal_group',
      title: 'أداء غنائي جماعي',
      subtitle: 'مجموعة مؤدين (الكورال)',
      icon: '👥🎤',
      bgGradient: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      border: 'border-emerald-300 ring-emerald-400',
      shadow: 'shadow-emerald-500/25',
    },
  ];

  const handleDragStart = (e: React.DragEvent, type: PerformanceType) => {
    e.dataTransfer.setData('text/plain', type);
    audioEngine.playClickSound();
  };

  const handleCardClick = (type: PerformanceType) => {
    if (disabled) return;
    audioEngine.playClickSound();
    onSelectCard(type);
  };

  return (
    <div className="w-full max-w-3xl mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const isSelected = selectedType === card.type;
          return (
            <div
              key={card.type}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, card.type)}
              onClick={() => handleCardClick(card.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.type);
                }
              }}
              className={`group relative select-none rounded-2xl p-3.5 sm:p-4 text-white text-center cursor-grab active:cursor-grabbing transition-all duration-200 transform border-2 flex flex-col items-center justify-between min-h-[120px] sm:min-h-[140px] shadow-lg ${
                card.shadow
              } bg-gradient-to-b ${card.bgGradient} ${
                isSelected
                  ? `ring-4 ${card.border} scale-105 brightness-110 -translate-y-1`
                  : 'hover:-translate-y-1 hover:shadow-xl hover:brightness-105 border-white/30'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Drag Handle Tag on Desktop */}
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/80 bg-white/20 px-2 py-0.5 rounded-full mb-1">
                {card.type === 'vocal_group' ? 'الكورال' : 'اسحب أو انقر'}
              </div>

              {/* Icon */}
              <div className="text-3xl sm:text-4xl my-1 drop-shadow-sm group-hover:scale-110 transition-transform">
                {card.icon}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-black text-sm sm:text-base leading-tight drop-shadow-sm">
                  {card.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>

              {/* Subtle Indicator check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
