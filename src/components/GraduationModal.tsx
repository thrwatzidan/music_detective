import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Printer, Share2, Sparkles, Star } from 'lucide-react';
import { OmaniDetectiveBoy } from './OmaniDetectiveBoy';
import { PERFORMANCES_INFO } from '../data/roundsData';
import { audioEngine } from '../services/audioEngine';

interface GraduationModalProps {
  isOpen: boolean;
  starsCount: number;
  totalRounds: number;
  onRestart: () => void;
}

export const GraduationModal: React.FC<GraduationModalProps> = ({
  isOpen,
  starsCount,
  totalRounds,
  onRestart,
}) => {
  const [studentName, setStudentName] = useState<string>('طالب متميز');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      audioEngine.playVictoryFanfare();
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 300);
      } catch {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-2xl w-full p-5 sm:p-8 my-auto overflow-hidden animate-scale-up text-center">
        {/* Top Trophy Banner */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
            🏆
          </div>

          <span className="text-xs font-black tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase mb-1">
            حفلة التخرج الموسيقية الكبرى
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            مبارك! أصبحت الآن محققًا موسيقيًا معتمدًا 🎓🎉
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-md mt-1 font-medium">
            لقد أتممت بنجاح جميع محطات القطار الموسيقي وأتقنت التمييز بين أنواع الأداء الأربعة!
          </p>
        </div>

        {/* Character Guide Praise */}
        <div className="my-5 flex flex-col sm:flex-row items-center justify-center gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
          <OmaniDetectiveBoy
            expression="celebrating"
            size="sm"
            showSpeechBubble={false}
          />
          <div className="text-right sm:text-right text-center flex-1">
            <h4 className="font-extrabold text-amber-900 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>رسالة من رفيقك المحقق الموسيقي:</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-relaxed">
              "رائع جدًا يا بطل عُمان المبدع! أظهرت مهارة استثنائية في الاستماع والمشاهدة، وحصلت على {starsCount} نجمة موسيقية كاملة!"
            </p>
          </div>
        </div>

        {/* The 4 Performance Types Summary (مراجعة الأنواع الأربعة كما طلب الدرس) */}
        <div className="my-4 text-right">
          <h4 className="text-xs font-black text-slate-500 mb-2">
            حصيلة مهاراتك التي أصبحت خبيرًا بها الآن:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-200">
              <span className="font-extrabold text-sky-800 block text-xs sm:text-sm">
                🎹 أداء آلي منفرد
              </span>
              <span className="text-[11px] text-sky-700">آلة موسيقية واحدة فقط</span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="font-extrabold text-amber-800 block text-xs sm:text-sm">
                🎹🎺 أداء آلي جماعي
              </span>
              <span className="text-[11px] text-amber-700">مجموعة من الآلات تعزف معًا</span>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200">
              <span className="font-extrabold text-purple-800 block text-xs sm:text-sm">
                🎤 أداء غنائي منفرد
              </span>
              <span className="text-[11px] text-purple-700">مؤدٍ واحد يشدو بصوته بمفرده</span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <span className="font-extrabold text-emerald-800 block text-xs sm:text-sm">
                👥🎤 أداء غنائي جماعي
              </span>
              <span className="text-[11px] text-emerald-700">مجموعة مؤدين (الكورال)</span>
            </div>
          </div>
        </div>

        {/* Printable Certificate Preview Box */}
        <div
          ref={certificateRef}
          className="bg-amber-50/40 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 text-center relative overflow-hidden my-4"
        >
          <div className="absolute top-2 left-2 text-amber-300 text-4xl opacity-30 select-none">🎼</div>
          <div className="absolute bottom-2 right-2 text-amber-300 text-4xl opacity-30 select-none">🏆</div>

          <div className="text-xs font-bold text-amber-800 tracking-wider">سلطنة عُمان · التربية الموسيقية</div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            شهادة تفوق: وسام المحقق الموسيقي المعتمد
          </div>

          <div className="my-2.5 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-bold">تُمنح هذه الشهادة للبطل:</span>
            {isEditingName ? (
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
                autoFocus
                className="px-2 py-0.5 text-xs font-black text-amber-900 border border-amber-400 rounded-md bg-white text-center focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="font-black text-amber-900 border-b-2 border-dashed border-amber-400 hover:text-amber-700 text-xs sm:text-sm"
                title="اضغط لتعديل اسم الطالب"
              >
                {studentName} ✏️
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-600 max-w-sm mx-auto leading-relaxed">
            لإتمامه بنجاح كافة اختبارات التمييز السمعي والمرئي واكتشاف نوع الأداء الموسيقي بكفاءة وتميز بمجموع {starsCount} نجمة ⭐.
          </p>

          <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 font-bold px-4 border-t border-amber-200/80 pt-2">
            <span>التاريخ: {new Date().toLocaleDateString('ar-OM')}</span>
            <span>المرشد: المحقق الموسيقي العماني 🇴🇲</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 text-white font-extrabold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>العب جولة جديدة 🚀</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-700 border border-slate-300 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة الشهادة 🖨️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
