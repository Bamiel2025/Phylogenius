import React, { useState } from 'react';
import { Collection } from '../types';
import { HelpCircle, CheckCircle, XCircle, Home, ArrowRight } from 'lucide-react';

interface Props {
  collection: Collection;
  onHome: () => void;
}

export const QuizActivity: React.FC<Props> = ({ collection, onHome }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (id: string) => {
    if (showResult) return;
    setSelectedOption(id);
    setShowResult(true);
  };

  const isCorrect = selectedOption 
    ? collection.quiz.options.find(o => o.id === selectedOption)?.isCorrect 
    : false;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-full">
        <div className="bg-indigo-600 p-6 text-center text-white relative shrink-0">
          <div className="absolute top-4 right-4">
             <button onClick={onHome} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Quitter">
               <Home size={20} />
             </button>
          </div>
          <HelpCircle size={40} className="mx-auto mb-2 opacity-80" />
          <h2 className="text-2xl font-bold mb-1">Quiz Final</h2>
          <p className="opacity-90 text-sm">Testons tes connaissances sur {collection.name} !</p>
        </div>

        <div className="p-6 overflow-y-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center leading-snug">
            {collection.quiz.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {collection.quiz.options.map(option => {
              let btnClass = "p-4 rounded-xl border-2 text-lg font-bold transition-all text-left flex items-center justify-between ";
              if (showResult) {
                if (option.isCorrect) btnClass += "bg-emerald-100 border-emerald-500 text-emerald-800 ";
                else if (option.id === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800 ";
                else btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-50 ";
              } else {
                btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 text-slate-700 shadow-sm ";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <span>{option.label}</span>
                  {showResult && option.isCorrect && <CheckCircle className="shrink-0 ml-2" size={24} />}
                  {showResult && !option.isCorrect && option.id === selectedOption && <XCircle className="shrink-0 ml-2" size={24} />}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`rounded-xl p-5 mb-6 animate-in slide-in-from-bottom-5 fade-in ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
              <h4 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-emerald-800' : 'text-orange-800'}`}>
                {isCorrect ? "Excellente réponse !" : "Pas tout à fait..."}
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                <span className="font-bold">Justification : </span>
                {collection.quiz.explanation}
              </p>
            </div>
          )}

          {/* Bouton Accueil Principal (apparaît ou change d'état à la fin) */}
          <div className="flex justify-center mt-2">
            <button 
              onClick={onHome}
              className={`
                px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300
                ${showResult 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg scale-105 animate-bounce-subtle' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }
              `}
            >
              {showResult ? (
                <>Terminer <ArrowRight size={20} /></>
              ) : (
                <>Retour à l'accueil <Home size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};