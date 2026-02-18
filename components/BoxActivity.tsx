import React, { useState } from 'react';
import { Collection, BoxGroup } from '../types';
import { CheckCircle2, RefreshCw, Home, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  collection: Collection;
  onBack: () => void;
  onHome: () => void;
  onQuiz: () => void;
  onZoom: (src: string, alt: string) => void;
}

export const BoxActivity: React.FC<Props> = ({ collection, onBack, onHome, onQuiz, onZoom }) => {
  const [placedSpecies, setPlacedSpecies] = useState<Record<string, string>>({}); // speciesId -> boxId
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to find all leaf box IDs (where species can go)
  const getAllBoxIds = (boxes: BoxGroup[]): string[] => {
    let ids: string[] = [];
    boxes.forEach(b => {
      ids.push(b.id);
      const childBoxes = b.children.filter(c => typeof c !== 'string') as BoxGroup[];
      ids.push(...getAllBoxIds(childBoxes));
    });
    return ids;
  };

  // Recursively find the correct box for a species in the solution structure
  const findCorrectBoxForSpecies = (speciesId: string, boxes: BoxGroup[]): string | null => {
    for (const box of boxes) {
      // Check immediate children strings
      if (box.children.includes(speciesId)) return box.id;
      // Check sub-boxes
      const childBoxes = box.children.filter(c => typeof c !== 'string') as BoxGroup[];
      const res = findCorrectBoxForSpecies(speciesId, childBoxes);
      if (res) return res;
    }
    return null;
  };

  const handleDragStart = (e: React.DragEvent, speciesId: string) => {
    e.dataTransfer.setData('speciesId', speciesId);
  };

  const handleDrop = (e: React.DragEvent, boxId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to parent box
    const sId = e.dataTransfer.getData('speciesId');
    if (!sId) return;
    setPlacedSpecies(prev => ({ ...prev, [sId]: boxId }));
    setSuccess(false); // Reset success on change
    setErrorMsg(null);
  };

  const checkSolution = () => {
    let correct = true;
    collection.species.forEach(s => {
      const targetBox = findCorrectBoxForSpecies(s.id, collection.boxStructure);
      if (placedSpecies[s.id] !== targetBox) correct = false;
    });

    if (correct) {
      setSuccess(true);
      setErrorMsg(null);
    } else {
      setSuccess(false);
      setErrorMsg("Certains animaux ne sont pas dans la bonne boîte !");
    }
  };

  const reset = () => {
    setPlacedSpecies({});
    setSuccess(false);
    setErrorMsg(null);
  };

  const renderBox = (box: BoxGroup) => {
    // Prefer treeLabel for combined characters (e.g. Occipital + Prognathisme)
    const char = collection.characters.find(c => c.id === box.expectedCharacterId);
    const charName = char?.treeLabel || char?.name || 'Groupe';

    // Filter static children that are boxes (recursive)
    const childBoxes = box.children.filter(c => typeof c !== 'string') as BoxGroup[];

    // Find species placed in THIS box specifically
    const speciesInThisBox = collection.species.filter(s => placedSpecies[s.id] === box.id);

    return (
      <div
        key={box.id}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => handleDrop(e, box.id)}
        className={`border-4 rounded-xl p-4 m-2 shadow-sm transition-colors relative flex flex-wrap content-start gap-4 min-w-[200px] min-h-[150px]
          ${box.rect.color} border-white/50
        `}
      >
        <div className="absolute top-0 left-0 bg-white/90 px-3 py-1 rounded-br-lg font-bold text-sm shadow-sm border-b border-r border-slate-200">
          {charName}
        </div>

        <div className="w-full mt-6 flex flex-wrap gap-4">
          {/* Render Species placed here */}
          {speciesInThisBox.map(s => (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, s.id)}
              className="bg-white p-2 rounded shadow-lg border border-slate-200 cursor-grab active:cursor-grabbing w-20 flex flex-col items-center animate-in zoom-in"
            >
              <img
                src={s.image}
                className="w-10 h-10 rounded-full mb-1 cursor-zoom-in hover:opacity-80 transition-opacity"
                alt=""
                onClick={() => onZoom(s.image, s.name)}
              />
              <span className="text-[10px] font-bold text-center leading-tight">{s.name}</span>
            </div>
          ))}

          {/* Render Nested Boxes */}
          {childBoxes.map(b => renderBox(b))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-4 shrink-0 gap-4">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-4 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">2. Classification en Groupes Emboîtés</h2>

            {/* Feedback Section positioned next to title */}
            {success && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shadow-sm">
                  <CheckCircle2 size={18} />
                  <span className="font-bold text-sm">Bravo !</span>
                </div>
                <button onClick={onQuiz} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 animate-bounce">
                  Quiz Final <ArrowRight size={16} />
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full border border-red-300 shadow-sm animate-in fade-in slide-in-from-left-4">
                <AlertCircle size={18} />
                <span className="font-bold text-sm">{errorMsg}</span>
              </div>
            )}
          </div>
          <p className="text-slate-600 text-sm">Glisse les espèces dans les boîtes correspondantes. Une boîte "dans" une autre possède aussi les caractères de la grande boîte !</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg">
            <RefreshCw size={20} />
          </button>
          <button onClick={onHome} className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-2">
            <Home size={20} /> <span className="hidden sm:inline">Accueil</span>
          </button>
          <button onClick={onBack} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg font-bold hover:bg-slate-200">
            Retour
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4 items-start">
        {/* Sidebar Species */}
        <div className="w-full lg:w-40 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2 min-h-[150px] overflow-y-auto shrink-0">
          <h3 className="font-bold text-slate-500 text-xs uppercase mb-2">Espèces à classer</h3>
          {collection.species.filter(s => !placedSpecies[s.id]).map(s => (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, s.id)}
              className="bg-white p-2 rounded shadow border border-slate-200 cursor-grab active:cursor-grabbing flex items-center gap-2"
            >
              <img
                src={s.image}
                className="w-8 h-8 rounded-full cursor-zoom-in hover:opacity-80 transition-opacity"
                alt=""
                onClick={() => onZoom(s.image, s.name)}
              />
              <span className="text-xs font-bold">{s.name}</span>
            </div>
          ))}
          {Object.keys(placedSpecies).length === collection.species.length && (
            <div className="text-center text-green-600 font-bold text-sm mt-4">Tout est classé !</div>
          )}
        </div>

        {/* Box Canvas */}
        <div className="flex-1 bg-slate-100 rounded-xl border border-slate-300 p-8 overflow-auto relative h-full">

          <div className="absolute bottom-4 right-4 z-40">
            <button onClick={checkSolution} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg font-bold transition-transform active:scale-95">
              Vérifier le Classement
            </button>
          </div>

          {collection.boxStructure.map(box => renderBox(box))}
        </div>
      </div>
    </div>
  );
};