import React, { useState } from 'react';
import { Collection, TreeNode } from '../types';
import { RefreshCw, CheckCircle2, KeyRound, Home, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  collection: Collection;
  onBack: () => void;
  onHome: () => void;
  onQuiz: () => void;
  onZoom: (src: string, alt: string) => void;
}

export const TreeActivity: React.FC<Props> = ({ collection, onBack, onHome, onQuiz, onZoom }) => {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<{ id: string, type: 'species' | 'character' } | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Flatten expected slots for validation
  const getSlots = (node: TreeNode): { id: string, type: 'node' | 'leaf', expected: string, x: number, y: number }[] => {
    let slots = [];
    if (node.expectedItemId) {
      slots.push({ id: node.id, type: node.type, expected: node.expectedItemId, x: node.x, y: node.y });
    }
    if (node.children) {
      node.children.forEach(c => slots.push(...getSlots(c)));
    }
    return slots;
  };

  const slots = getSlots(collection.treeStructure);

  // Identify which characters are actually used in the tree
  const usedCharacterIds = new Set(slots.filter(s => s.type === 'node').map(s => s.expected));
  const availableCharacters = collection.characters.filter(c => usedCharacterIds.has(c.id));

  const handleDragStart = (id: string, type: 'species' | 'character') => {
    setDraggedItem({ id, type });
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    // Strict validation: Leaves for Species, Nodes for Characters
    if (slot.type === 'leaf' && draggedItem.type !== 'species') return;
    if (slot.type === 'node' && draggedItem.type !== 'character') return;

    setPlacements(prev => ({ ...prev, [slotId]: draggedItem.id }));
    setDraggedItem(null);
    setSuccess(false); // Reset success on modification
    setErrorMsg(null); // Clear errors
  };

  const checkSolution = () => {
    const isCorrect = slots.every(s => placements[s.id] === s.expected);
    if (isCorrect) {
      setSuccess(true);
      setErrorMsg(null);
    } else {
      setSuccess(false);
      setErrorMsg("Attention, il y a des erreurs. Vérifie les positions !");
    }
  };

  const showSolution = () => {
    const solution: Record<string, string> = {};
    slots.forEach(slot => {
      solution[slot.id] = slot.expected;
    });
    setPlacements(solution);
    setSuccess(true);
    setErrorMsg(null);
  };

  const reset = () => {
    setPlacements({});
    setSuccess(false);
    setErrorMsg(null);
  };

  const isPlaced = (id: string) => Object.values(placements).includes(id);

  const getCharName = (id: string) => {
    const c = collection.characters.find(char => char.id === id);
    return c?.treeLabel || c?.name || '';
  };

  // --- Rendering Logic ---

  // Calculate the "Hub" (Common Ancestor Square position) for a branching node
  const getHubPosition = (node: TreeNode) => {
    if (!node.children || node.children.length === 0) return null;

    // Determine direction (Up or Down tree) based on children Y
    const avgChildY = node.children.reduce((acc, c) => acc + c.y, 0) / node.children.length;
    const isInverted = avgChildY < node.y; // Bottom-up tree

    // The stem length (distance from Innovation Dot to Ancestor Square)
    const offset = isInverted ? -10 : 10;

    // Only draw hub if branching (more than 1 child) or if explicitly needed structure
    // Ideally, "Ancestor" exists at the split.
    if (node.children.length === 1) return null;

    return { x: node.x, y: node.y + offset };
  };

  const renderTreeStructure = (node: TreeNode, parentCoords?: { x: number, y: number }) => {
    const hub = getHubPosition(node);

    // Line from Parent to Current Node (Innovation Slot)
    let incomingLine = null;
    if (parentCoords) {
      incomingLine = (
        <line
          key={`line-to-${node.id}`}
          x1={`${parentCoords.x}%`} y1={`${parentCoords.y}%`}
          x2={`${node.x}%`} y2={`${node.y}%`}
          stroke="#475569" strokeWidth="4"
          strokeLinecap="round"
        />
      );
    }

    // Lines from Current Node to Children (or to Hub then Children)
    let outgoingLines = [];
    let ancestorSquare = null;

    if (hub) {
      // 1. Draw Stem: Node -> Hub
      outgoingLines.push(
        <line
          key={`stem-${node.id}`}
          x1={`${node.x}%`} y1={`${node.y}%`}
          x2={`${hub.x}%`} y2={`${hub.y}%`}
          stroke="#475569" strokeWidth="4"
        />
      );

      // 2. Draw Ancestor Square at Hub
      ancestorSquare = (
        <g key={`ancestor-${node.id}`}>
          <rect
            x={`${hub.x - 1.5}%`} y={`${hub.y - 1.5}%`}
            width="3%" height="3.5%"
            fill="#fbbf24" stroke="#d97706" strokeWidth="2"
            rx="1"
            className="shadow-sm"
          />
        </g>
      );

      // 3. Draw Lines: Hub -> Children
      node.children?.forEach(child => {
        outgoingLines.push(
          <line
            key={`hub-to-${child.id}`}
            x1={`${hub.x}%`} y1={`${hub.y}%`}
            x2={`${child.x}%`} y2={`${child.y}%`}
            stroke="#475569" strokeWidth="4"
            strokeLinecap="round"
          />
        );
        outgoingLines.push(renderTreeStructure(child, hub));
      });

    } else {
      // Direct connection to children (no branching square)
      node.children?.forEach(child => {
        outgoingLines.push(
          <line
            key={`node-to-${child.id}`}
            x1={`${node.x}%`} y1={`${node.y}%`}
            x2={`${child.x}%`} y2={`${child.y}%`}
            stroke="#475569" strokeWidth="4"
            strokeLinecap="round"
          />
        );
        outgoingLines.push(renderTreeStructure(child, { x: node.x, y: node.y }));
      });
    }

    return (
      <React.Fragment key={`group-${node.id}`}>
        {incomingLine}
        {outgoingLines}
        {ancestorSquare}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-4 shrink-0 gap-4">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-4 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">2. Construction de l'Arbre de Parenté</h2>

            {/* Feedback Section positioned next to title */}
            {success && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shadow-sm">
                  <CheckCircle2 size={18} />
                  <span className="font-bold text-sm">Excellent !</span>
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

          <p className="text-slate-600 text-sm flex items-center gap-2">
            Légende :
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full border border-red-700"></span> Innovation</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-sm border border-yellow-600"></span> Ancêtre commun</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={reset} className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg" title="Réinitialiser">
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

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4">
        {/* Sidebar Tools */}
        <div className="w-full lg:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-y-auto flex flex-col gap-6 shrink-0">
          <div>
            <h3 className="font-bold text-slate-500 text-xs uppercase mb-3">Espèces</h3>
            <div className="grid grid-cols-2 gap-2">
              {collection.species.map(s => (
                <div
                  key={s.id}
                  draggable={!isPlaced(s.id)}
                  onDragStart={() => handleDragStart(s.id, 'species')}
                  className={`p-2 bg-white border border-slate-200 rounded shadow-sm text-center text-xs font-bold ${isPlaced(s.id) ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:border-indigo-400'}`}
                >
                  <img
                    src={s.image}
                    className="w-8 h-8 mx-auto mb-1 rounded-full bg-slate-200 cursor-zoom-in hover:opacity-80 transition-opacity"
                    alt=""
                    onClick={() => onZoom(s.image, s.name)}
                  />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-500 text-xs uppercase mb-3">Caractères (Innovations)</h3>
            <div className="flex flex-col gap-2">
              {availableCharacters.map(c => (
                <div
                  key={c.id}
                  draggable={!isPlaced(c.id)}
                  onDragStart={() => handleDragStart(c.id, 'character')}
                  className={`p-2 bg-white border border-slate-300 rounded shadow-sm flex items-center gap-2 text-xs font-medium ${isPlaced(c.id) ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:border-slate-500'}`}
                >
                  {/* Visual representation of the "Dot" */}
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-red-700 shadow-sm shrink-0"></div>
                  {c.treeLabel || c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tree Canvas */}
        <div className="flex-1 bg-white rounded-xl shadow-inner border border-slate-200 relative overflow-hidden select-none">
          <div className="absolute bottom-4 right-4 z-40 flex gap-2">
            {!success && (
              <button
                onClick={showSolution}
                className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 transition-transform active:scale-95"
              >
                <KeyRound size={20} />
                Correction
              </button>
            )}
            <button onClick={checkSolution} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg font-bold transition-transform active:scale-95">
              Vérifier l'Arbre
            </button>
          </div>

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Render the lines and squares */}
            {renderTreeStructure(collection.treeStructure)}
          </svg>

          {/* Render Drop Zones over SVG */}
          {slots.map(slot => (
            <div
              key={slot.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, slot.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300
                ${slot.type === 'node' ? 'w-10 h-10' : 'w-24 h-12 rounded-lg'}
                ${placements[slot.id] ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
              `}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              {placements[slot.id] ? (
                // CONTENT WHEN FILLED
                slot.type === 'node' ? (
                  // Filled Innovation (Dot + Tooltip/Label)
                  <div className="relative group flex flex-col items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md z-10"></div>
                    <div className="absolute top-5 bg-white/90 px-2 py-1 rounded shadow text-[9px] font-bold border border-slate-200 whitespace-nowrap z-20">
                      {getCharName(placements[slot.id])}
                    </div>
                  </div>
                ) : (
                  // Filled Species
                  <div className="bg-white p-1 rounded-lg border-2 border-indigo-500 shadow-md flex items-center gap-1 z-10">
                    <img
                      src={collection.species.find(s => s.id === placements[slot.id])?.image}
                      className="w-6 h-6 rounded-full bg-slate-200 cursor-zoom-in hover:opacity-80 transition-opacity"
                      alt=""
                      onClick={() => {
                        const s = collection.species.find(sp => sp.id === placements[slot.id]);
                        if (s) onZoom(s.image, s.name);
                      }}
                    />
                    <span className="font-bold text-[9px] truncate max-w-[60px]">
                      {collection.species.find(s => s.id === placements[slot.id])?.name}
                    </span>
                  </div>
                )
              ) : (
                // EMPTY STATE
                slot.type === 'node' ? (
                  // Empty Innovation Slot (Dot placeholder)
                  <div className="w-5 h-5 bg-slate-200 rounded-full border-2 border-dashed border-slate-400 hover:bg-red-100 hover:border-red-300 transition-colors shadow-inner"></div>
                ) : (
                  // Empty Species Slot
                  <div className="w-full h-full bg-slate-50 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                    ?
                  </div>
                )
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};