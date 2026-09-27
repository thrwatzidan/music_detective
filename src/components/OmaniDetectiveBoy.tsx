import React from 'react';
import { Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export type BoyExpression = 'greeting' | 'listening' | 'celebrating' | 'thinking' | 'guiding';

interface OmaniDetectiveBoyProps {
  expression?: BoyExpression;
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  className?: string;
  onSpeechBubbleClick?: () => void;
}

export const OmaniDetectiveBoy: React.FC<OmaniDetectiveBoyProps> = ({
  expression = 'greeting',
  speechText = 'مرحبًا! أنا المحقق الموسيقي، هل تساعدني في اكتشاف نوع الأداء؟',
  size = 'md',
  showSpeechBubble = true,
  className = '',
  onSpeechBubbleClick,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeak = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSpeaking(true);
    audioEngine.speakArabic(speechText, () => {
      setIsSpeaking(false);
    });
  };

  // Dimensions based on size
  const sizeMap = {
    sm: { width: 110, height: 160 },
    md: { width: 160, height: 230 },
    lg: { width: 220, height: 320 },
    hero: { width: 280, height: 400 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center select-none relative ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div
          onClick={() => {
            handleSpeak();
            if (onSpeechBubbleClick) onSpeechBubbleClick();
          }}
          className="relative max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm border-2 border-amber-300 rounded-2xl p-3.5 shadow-lg shadow-amber-900/5 mb-3 cursor-pointer group hover:border-amber-400 transition-all duration-200 text-center animate-fade-in"
        >
          {/* Bubble Pointer Arrow */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-amber-300 rotate-45"></div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <span>المحقق الموسيقي</span>
            </span>

            <button
              type="button"
              onClick={handleSpeak}
              aria-label="استمع للصوت"
              className={`p-1 rounded-full transition-colors ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
              title="انقر للاستماع بصوت المحقق"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="mt-1.5 text-sm sm:text-base font-bold text-slate-800 leading-relaxed text-right">
            {speechText}
          </p>

          <span className="text-[10px] text-amber-600 block mt-1 text-center font-medium opacity-75 group-hover:opacity-100">
            💡 اضغط هنا لسماع صوت المحقق
          </span>
        </div>
      )}

      {/* High-Fidelity 3D-Styled Omani Boy Character Illustration */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => handleSpeak()}
        title="أنا المحقق الموسيقي الذكي!"
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 280 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
        >
          <defs>
            {/* Gradients for Dishdasha and Skin */}
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffdfc4" />
              <stop offset="60%" stopColor="#f7c8a4" />
              <stop offset="100%" stopColor="#e4aa80" />
            </linearGradient>

            <linearGradient id="dishdashaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="40%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            <linearGradient id="kummahGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="60%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#372418" />
              <stop offset="100%" stopColor="#1a110a" />
            </linearGradient>

            <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5c381c" />
              <stop offset="100%" stopColor="#2c1a0e" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Shadow on Floor */}
          <ellipse cx="140" cy="385" rx="75" ry="12" fill="#000000" fillOpacity="0.15" />

          {/* Legs & Traditional Blue Sandals (نعال) */}
          <g id="feet">
            {/* Left Leg */}
            <rect x="115" y="340" width="16" height="28" rx="8" fill="url(#skinGrad)" />
            {/* Right Leg */}
            <rect x="149" y="340" width="16" height="28" rx="8" fill="url(#skinGrad)" />

            {/* Left Sandal */}
            <rect x="106" y="362" width="28" height="15" rx="6" fill="#1e3a8a" />
            <path d="M106 368 C115 362 125 362 134 368" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="120" cy="374" rx="4" ry="2" fill="#ffdfc4" />

            {/* Right Sandal */}
            <rect x="146" y="362" width="28" height="15" rx="6" fill="#1e3a8a" />
            <path d="M146 368 C155 362 165 362 174 368" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="160" cy="374" rx="4" ry="2" fill="#ffdfc4" />
          </g>

          {/* Traditional Omani Dishdasha Body */}
          <g id="dishdasha" filter="url(#shadowFilter)">
            {/* Main Robe */}
            <path
              d="M102 145 
                 C85 200, 78 280, 75 350 
                 C115 356, 165 356, 205 350 
                 C202 280, 195 200, 178 145 
                 Z"
              fill="url(#dishdashaGrad)"
            />

            {/* Subtle Fabric Folds */}
            <path d="M140 185 Q135 270 138 352" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M115 220 Q112 280 108 348" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            <path d="M165 220 Q168 280 172 348" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

            {/* Dishdasha Collar and Neck Opening */}
            <path d="M126 142 L126 195 L154 195 L154 142" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
            <line x1="140" y1="145" x2="140" y2="195" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

            {/* Traditional Omani Tassel (الفراخة / الكركوشة) */}
            <g id="faraka_tassel">
              <line x1="140" y1="156" x2="140" y2="168" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="140" cy="170" rx="3.5" ry="3" fill="#1d4ed8" />
              {/* Tassel threads */}
              <path d="M136 172 Q140 184 140 186 Q140 184 144 172 Z" fill="#2563eb" />
              <path d="M138 186 L142 186" stroke="#1e40af" strokeWidth="1" />
            </g>

            {/* Navy Blue School Backpack Straps */}
            <path d="M102 148 C95 180 94 220 96 245" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
            <rect x="92" y="195" width="8" height="6" rx="2" fill="#93c5fd" />

            <path d="M178 148 C185 180 186 220 184 245" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
            <rect x="180" y="195" width="8" height="6" rx="2" fill="#93c5fd" />
          </g>

          {/* Arms and Hands */}
          <g id="arms">
            {expression === 'greeting' && (
              <>
                {/* Right Arm Greeting Wave */}
                <path d="M96 150 C75 160 55 140 50 115" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                {/* Waving Hand */}
                <circle cx="48" cy="108" r="10" fill="url(#skinGrad)" />
                <rect x="42" y="98" width="5" height="10" rx="2.5" fill="url(#skinGrad)" transform="rotate(-15 42 98)" />
                <rect x="48" y="96" width="5" height="11" rx="2.5" fill="url(#skinGrad)" />
                <rect x="54" y="98" width="5" height="10" rx="2.5" fill="url(#skinGrad)" transform="rotate(15 54 98)" />

                {/* Left Arm at side */}
                <path d="M184 150 C195 190 200 230 202 260" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="204" cy="265" r="9" fill="url(#skinGrad)" />
              </>
            )}

            {expression === 'listening' && (
              <>
                {/* Right Hand to Ear to Listen */}
                <path d="M96 150 C80 140 70 125 76 95" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="78" cy="90" r="10" fill="url(#skinGrad)" />
                {/* Sound waves near ear */}
                <path d="M52 80 A12 12 0 0 1 52 100" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M44 74 A20 20 0 0 1 44 106" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />

                {/* Left Hand down */}
                <path d="M184 150 C195 190 200 230 202 260" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="204" cy="265" r="9" fill="url(#skinGrad)" />
              </>
            )}

            {expression === 'celebrating' && (
              <>
                {/* Both Arms raised with Stars / Magnifying Glass */}
                <path d="M96 150 C70 135 55 105 50 80" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="48" cy="74" r="10" fill="url(#skinGrad)" />

                <path d="M184 150 C210 135 225 105 230 80" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="232" cy="74" r="10" fill="url(#skinGrad)" />

                {/* Golden Treble Clef / Star Badge in hand */}
                <g transform="translate(225, 45)">
                  <circle cx="12" cy="12" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                  <text x="12" y="18" fontSize="16" textAnchor="middle" fill="#78350f">⭐</text>
                </g>
              </>
            )}

            {(expression === 'thinking' || expression === 'guiding') && (
              <>
                {/* Right Hand under chin pondering */}
                <path d="M96 150 C80 155 88 135 110 120" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="118" cy="115" r="9" fill="url(#skinGrad)" />

                {/* Left Hand guiding forward */}
                <path d="M184 150 C205 170 215 195 220 215" stroke="url(#dishdashaGrad)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="222" cy="220" r="9" fill="url(#skinGrad)" />
                {/* Magnifying Glass in hand */}
                <g transform="translate(222, 205)">
                  <circle cx="8" cy="8" r="10" stroke="#b45309" strokeWidth="3" fill="#bae6fd" fillOpacity="0.5" />
                  <line x1="16" y1="16" x2="24" y2="24" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                  <text x="8" y="12" fontSize="9" textAnchor="middle" fill="#0369a1">🎵</text>
                </g>
              </>
            )}
          </g>

          {/* Neck */}
          <rect x="128" y="125" width="24" height="22" rx="6" fill="url(#skinGrad)" />

          {/* Ears */}
          <ellipse cx="90" cy="98" rx="10" ry="14" fill="url(#skinGrad)" />
          <ellipse cx="90" cy="98" rx="6" ry="9" fill="#e4aa80" />

          <ellipse cx="190" cy="98" rx="10" ry="14" fill="url(#skinGrad)" />
          <ellipse cx="190" cy="98" rx="6" ry="9" fill="#e4aa80" />

          {/* Head & Face */}
          <g id="face">
            {/* Cute rounded face */}
            <path
              d="M92 90 
                 C90 128, 105 142, 140 142 
                 C175 142, 190 128, 188 90 
                 C186 65, 175 52, 140 52 
                 C105 52, 94 65, 92 90 
                 Z"
              fill="url(#skinGrad)"
            />

            {/* Rosy Cheeks */}
            <ellipse cx="108" cy="108" rx="9" ry="6" fill="#f43f5e" fillOpacity="0.22" />
            <ellipse cx="172" cy="108" rx="9" ry="6" fill="#f43f5e" fillOpacity="0.22" />

            {/* Expressive Eyes */}
            {/* Left Eye */}
            <g id="left_eye">
              <ellipse cx="118" cy="92" rx="12" ry="14" fill="#ffffff" />
              <ellipse cx="120" cy="92" rx="9" ry="10" fill="url(#eyeGrad)" />
              <ellipse cx="121" cy="92" rx="5" ry="6" fill="#0f0905" />
              {/* Eye Catchlight */}
              <circle cx="118" cy="88" r="3.5" fill="#ffffff" />
              <circle cx="123" cy="94" r="1.5" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <g id="right_eye">
              <ellipse cx="162" cy="92" rx="12" ry="14" fill="#ffffff" />
              <ellipse cx="160" cy="92" rx="9" ry="10" fill="url(#eyeGrad)" />
              <ellipse cx="159" cy="92" rx="5" ry="6" fill="#0f0905" />
              {/* Eye Catchlight */}
              <circle cx="158" cy="88" r="3.5" fill="#ffffff" />
              <circle cx="163" cy="94" r="1.5" fill="#ffffff" />
            </g>

            {/* Eyebrows */}
            <path d="M106 76 Q118 70 128 75" stroke="#372418" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M174 76 Q162 70 152 75" stroke="#372418" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Cute Nose */}
            <path d="M137 100 Q140 105 143 100" stroke="#d97706" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Warm Smiling Mouth */}
            <g id="mouth">
              <path
                d="M120 114 
                   Q140 134 160 114 
                   Z"
                fill="#881337"
              />
              {/* Neat White Teeth */}
              <path
                d="M125 115 
                   Q140 120 155 115 
                   L155 119 
                   Q140 123 125 119 
                   Z"
                fill="#ffffff"
              />
              {/* Tongue */}
              <path
                d="M132 125 
                   Q140 122 148 125 
                   Q140 132 132 125 
                   Z"
                fill="#fb7185"
              />
            </g>
          </g>

          {/* Curly Dark Hair framing the face and Kummah */}
          <g id="curls">
            <circle cx="88" cy="74" r="10" fill="url(#hairGrad)" />
            <circle cx="84" cy="88" r="9" fill="url(#hairGrad)" />
            <circle cx="95" cy="65" r="9" fill="url(#hairGrad)" />
            <circle cx="106" cy="58" r="8" fill="url(#hairGrad)" />

            <circle cx="192" cy="74" r="10" fill="url(#hairGrad)" />
            <circle cx="196" cy="88" r="9" fill="url(#hairGrad)" />
            <circle cx="185" cy="65" r="9" fill="url(#hairGrad)" />
            <circle cx="174" cy="58" r="8" fill="url(#hairGrad)" />

            {/* Little Forehead Curls */}
            <path d="M120 62 Q125 68 120 72" stroke="#1a110a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M160 62 Q155 68 160 72" stroke="#1a110a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Authentic Embroidered Omani Kummah Cap (الكمة العمانية الأصيلة) */}
          <g id="omani_kummah" filter="url(#shadowFilter)">
            {/* Kummah Base Cylinder & Dome */}
            <path
              d="M94 58 
                 C94 28, 110 14, 140 14 
                 C170 14, 186 28, 186 58 
                 C186 64, 94 64, 94 58 
                 Z"
              fill="url(#kummahGrad)"
            />

            {/* Intricate Traditional Omani White/Blue Embroidery (نقوش التطريز العماني الأصيل) */}
            {/* Top curved stitching line */}
            <path d="M102 32 Q140 22 178 32" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            <path d="M98 44 Q140 36 182 44" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 3" fill="none" />
            <path d="M96 55 Q140 48 184 55" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />

            {/* Geometric diamond & star embroidery motifs */}
            {[108, 124, 140, 156, 172].map((cx, i) => (
              <g key={i}>
                <polygon
                  points={`${cx},28 ${cx + 4},33 ${cx},38 ${cx - 4},33`}
                  fill="#ffffff"
                  stroke="#93c5fd"
                  strokeWidth="0.8"
                />
                <circle cx={cx} cy={48} r="2.5" fill="#ffffff" />
                <path
                  d={`M${cx - 3} 48 L${cx + 3} 48 M${cx} 45 L${cx} 51`}
                  stroke="#1e3a8a"
                  strokeWidth="0.8"
                />
              </g>
            ))}

            {/* Kummah Rim */}
            <path
              d="M94 58 Q140 52 186 58"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Little Detective Magnifying Glass Icon Badge on Dishdasha */}
          <g transform="translate(152, 172)">
            <circle cx="8" cy="8" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <text x="8" y="11" fontSize="9" textAnchor="middle" fill="#78350f">🔍</text>
          </g>
        </svg>

        {/* Pulsing indicator when speaking */}
        {isSpeaking && (
          <div className="absolute -top-1 right-2 flex gap-1 items-center bg-amber-500 text-white text-[11px] px-2 py-0.5 rounded-full shadow-md animate-bounce">
            <Volume2 className="w-3 h-3 animate-spin" />
            <span>يتحدث...</span>
          </div>
        )}
      </div>
    </div>
  );
};
