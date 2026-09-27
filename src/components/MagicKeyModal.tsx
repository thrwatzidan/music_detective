import React, { useState } from 'react';
import { X, Sparkles, HelpCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface MagicKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MagicKeyModal: React.FC<MagicKeyModalProps> = ({ isOpen, onClose }) => {
  const [testSoundType, setTestSoundType] = useState<'instrumental' | 'vocal'>('instrumental');
  const [testCount, setTestCount] = useState<'solo' | 'group'>('solo');

  if (!isOpen) return null;

  // Compute calculated answer from the child's interactive exploration
  const getResult = () => {
    if (testSoundType === 'instrumental' && testCount === 'solo') {
      return {
        title: 'أداء آلي منفرد 🎹',
        color: 'bg-sky-500 text-white',
        border: 'border-sky-300',
        rule: 'عزف آلات + آلة واحدة فقط = أداء آلي منفرد (أزرق)',
      };
    }
    if (testSoundType === 'instrumental' && testCount === 'group') {
      return {
        title: 'أداء آلي جماعي 🎹🎺🥁',
        color: 'bg-amber-500 text-white',
        border: 'border-amber-300',
        rule: 'عزف آلات + مجموعة آلات = أداء آلي جماعي (برتقالي)',
      };
    }
    if (testSoundType === 'vocal' && testCount === 'solo') {
      return {
        title: 'أداء غنائي منفرد 🎤',
        color: 'bg-purple-600 text-white',
        border: 'border-purple-300',
        rule: 'غناء بشري + مؤدٍ واحد = أداء غنائي منفرد (بنفسجي)',
      };
    }
    return {
      title: 'أداء غنائي جماعي (الكورال) 👥🎤',
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-300',
      rule: 'غناء بشري + مجموعة مؤدين = أداء غنائي جماعي / الكورال (أخضر)',
    };
  };

  const result = getResult();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-xl w-full p-5 sm:p-6 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-inner">
              🔑
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-900">
                المفتاح السحري للتفكير الموسيقي
              </h3>
              <p className="text-xs text-amber-700 font-medium">
                تعلّم كيف يفكّر المحقق الموسيقي للوصول للإجابة الصحيحة دائمًا!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Decision Tree (خريطة التفكير الذكية) */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
            <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block mb-1">
              الخطوة 1: مصدر الصوت
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-xl">🎹</span>
                <p className="text-xs font-bold text-slate-800 mt-1">هل هو عزف آلات؟</p>
                <span className="text-[11px] font-black text-blue-600 block mt-0.5">
                  ⬅️ فكّر في: «آلي»
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-xl">🎤</span>
                <p className="text-xs font-bold text-slate-800 mt-1">هل هو غناء بشري؟</p>
                <span className="text-[11px] font-black text-purple-600 block mt-0.5">
                  ⬅️ فكّر في: «غنائي»
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
            <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md inline-block mb-1">
              الخطوة 2: عدد المؤدين أو الآلات
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-xl">👤</span>
                <p className="text-xs font-bold text-slate-800 mt-1">شخص أو آلة واحدة؟</p>
                <span className="text-[11px] font-black text-emerald-600 block mt-0.5">
                  ⬅️ فكّر في: «منفرد»
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-xl">👥</span>
                <p className="text-xs font-bold text-slate-800 mt-1">مجموعة آلات أو مؤدين؟</p>
                <span className="text-[11px] font-black text-orange-600 block mt-0.5">
                  ⬅️ فكّر في: «جماعي / الكورال»
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Tester Box for kids to experiment */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-amber-300">
            <h4 className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>جرّب المفتاح السحري بنفسك الآن:</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-1 text-[11px]">1. نوع النشاط:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClickSound();
                      setTestSoundType('instrumental');
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                      testSoundType === 'instrumental'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    🎹 عزف آلات
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClickSound();
                      setTestSoundType('vocal');
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                      testSoundType === 'vocal'
                        ? 'bg-purple-600 text-white border-purple-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    🎤 غناء
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 text-[11px]">2. العدد:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClickSound();
                      setTestCount('solo');
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                      testCount === 'solo'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    👤 واحد (منفرد)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playClickSound();
                      setTestCount('group');
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                      testCount === 'group'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    👥 مجموعة (جماعي)
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Result */}
            <div className={`mt-3 p-2.5 rounded-xl ${result.color} text-center font-bold text-xs sm:text-sm shadow-sm transition-all`}>
              <div>النتيجة: {result.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5">{result.rule}</div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => {
              audioEngine.playClickSound();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
          >
            فهمت الفكرة، لنكمل اللعب! 👍
          </button>
        </div>
      </div>
    </div>
  );
};
