import React, { useState, useEffect } from 'react';
import { Collection, MatrixData } from '../types';
import { CheckCircle2, AlertCircle, PlayCircle, Info, KeyRound } from 'lucide-react';
import { AIHelper } from './AIHelper';

interface Props {
  collection: Collection;
  onComplete: () => void;
  onZoom: (src: string, alt: string) => void;
}

export const MatrixActivity: React.FC<Props> = ({ collection, onComplete, onZoom }) => {
  const [matrix, setMatrix] = useState<MatrixData>({});
  const [hoveredItem, setHoveredItem] = useState<{ name: string, img: string, desc: string } | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' | 'neutral' } | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize matrix
  useEffect(() => {
    const init: MatrixData = {};
    collection.species.forEach(s => {
      init[s.id] = {};
      collection.characters.forEach(c => {
        // Init with false for boolean-type, or empty string for option-type
        init[s.id][c.id] = c.options ? '' : false;
      });
    });
    setMatrix(init);
    setIsCorrect(false); // Reset correct state on collection change
    setFeedback(null);
  }, [collection]);

  const toggleCell = (sId: string, cId: string) => {
    if (isCorrect) return;

    const char = collection.characters.find(c => c.id === cId);
    if (!char) return;

    setMatrix(prev => {
      const currentVal = prev[sId][cId];
      let newVal: boolean | string;

      if (char.options) {
        // Cycle behavior: Empty -> Option 1 -> Option 2 ... -> Empty
        if (currentVal === '') {
          newVal = char.options[0];
        } else {
          const idx = char.options.indexOf(currentVal as string);
          if (idx >= 0 && idx < char.options.length - 1) {
            newVal = char.options[idx + 1];
          } else {
            newVal = ''; // Cycle back to empty
          }
        }
      } else {
        // Boolean toggle
        newVal = !currentVal;
      }

      return {
        ...prev,
        [sId]: {
          ...prev[sId],
          [cId]: newVal
        }
      };
    });
    setFeedback(null);
  };

  const checkMatrix = () => {
    let errors = 0;
    for (const s of collection.species) {
      for (const c of collection.characters) {
        if (matrix[s.id][c.id] !== collection.correctMatrix[s.id][c.id]) {
          errors++;
        }
      }
    }

    if (errors === 0) {
      setFeedback({ msg: "Bravo ! Le tableau est parfaitement rempli.", type: 'success' });
      setIsCorrect(true);
    } else {
      setFeedback({ msg: `Il y a ${errors} erreur(s) dans le tableau. Vérifie bien les animaux !`, type: 'error' });
    }
  };

  const showSolution = () => {
    const solved: MatrixData = {};
    collection.species.forEach(s => {
      solved[s.id] = {};
      collection.characters.forEach(c => {
        solved[s.id][c.id] = collection.correctMatrix[s.id][c.id];
      });
    });
    setMatrix(solved);
    setIsCorrect(true);
    setFeedback({ msg: "Voici la correction. Observe bien les caractères.", type: 'success' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Info */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">1. Observation et Collecte de Données</h2>
        <p className="text-slate-600">
          Survole les noms des espèces pour voir les détails.
          {collection.characters.some(c => c.options)
            ? " Clique plusieurs fois dans les cases pour choisir la bonne caractéristique."
            : " Clique dans les cases pour indiquer si un caractère est présent."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* The Matrix */}
        <div className="flex-1 overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200 p-4">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="p-2 text-left bg-slate-50 rounded-tl-lg"></th>
                {collection.characters.map(c => (
                  <th
                    key={c.id}
                    className="p-2 text-center w-32 bg-slate-50 border-b border-slate-100 align-top"
                  >
                    <div className="flex flex-col items-center gap-2 pt-4">
                      <span className="text-xs font-semibold text-slate-700 leading-tight block h-12 flex items-center justify-center">{c.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collection.species.map(s => (
                <tr key={s.id} className="border-t border-slate-100">
                  <th
                    className="p-2 text-left cursor-help hover:bg-slate-100 transition-colors rounded-l-lg"
                    onMouseEnter={() => setHoveredItem({ name: s.name, img: s.image, desc: s.description })}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 cursor-zoom-in hover:border-indigo-400 transition-colors"
                        onClick={() => onZoom(s.image, s.name)}
                      />
                      <span className="font-bold text-slate-700 text-sm">{s.name}</span>
                    </div>
                  </th>
                  {collection.characters.map(c => {
                    const active = matrix[s.id]?.[c.id];
                    const isOptionType = !!c.options;

                    return (
                      <td key={c.id} className="p-2 text-center">
                        <button
                          onClick={() => toggleCell(s.id, c.id)}
                          className={`
                            rounded-lg transition-all duration-200 border-2 flex items-center justify-center text-[10px] font-bold leading-none p-1
                            ${isOptionType ? 'w-24 h-12' : 'w-12 h-12 mx-auto'}
                            ${active && active !== ''
                              ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-400'
                            }
                          `}
                        >
                          {isOptionType ? (active || '—') : (active && <div className="w-3 h-3 bg-blue-500 rounded-full" />)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg flex-1 min-w-[250px] ${feedback?.type === 'success' ? 'bg-green-100 text-green-800' : feedback?.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'}`}>
              {feedback?.type === 'success' ? <CheckCircle2 size={20} /> : feedback?.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
              <span className="font-medium text-sm">{feedback ? feedback.msg : "Remplis le tableau puis vérifie."}</span>
            </div>

            <div className="flex gap-4">
              {!isCorrect && (
                <button
                  onClick={showSolution}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                  title="Afficher la correction"
                >
                  <KeyRound size={18} /> Correction
                </button>
              )}

              {!isCorrect ? (
                <button
                  onClick={checkMatrix}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-transform active:scale-95"
                >
                  Vérifier
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2 animate-bounce"
                >
                  Construire <PlayCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-80 h-auto bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-6">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">Informations</h3>
          {hoveredItem ? (
            <div className="animate-in fade-in duration-200">
              <div className="w-full h-48 bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={hoveredItem.img}
                  alt={hoveredItem.name}
                  className="max-w-full max-h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                  onClick={() => onZoom(hoveredItem.img, hoveredItem.name)}
                />
              </div>
              <h4 className="text-xl font-bold text-indigo-900 mb-2">{hoveredItem.name}</h4>
              <p className="text-slate-600 leading-relaxed">{hoveredItem.desc}</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200">
              {collection.hoverImage ? (
                <>
                  <div className="w-full h-48 bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                    <img
                      src={collection.hoverImage}
                      alt={collection.name}
                      className="max-w-full max-h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                      onClick={() => onZoom(collection.hoverImage!, collection.name)}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-indigo-900 mb-2">{collection.name}</h4>
                  <p className="text-slate-600 leading-relaxed">{collection.description}</p>
                </>
              ) : (
                <div className="text-center text-slate-400 py-10">
                  <div className="mb-3 mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <Info size={24} />
                  </div>
                  <p>Survole le nom d'un animal pour afficher sa fiche descriptive.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AIHelper collectionId={collection.id} matrixState={matrix} />
    </div>
  );
};