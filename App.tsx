import React, { useState } from 'react';
import { ActivityState, Collection } from './types';
import { COLLECTIONS } from './constants';
import { MatrixActivity } from './components/MatrixActivity';
import { TreeActivity } from './components/TreeActivity';
import { BoxActivity } from './components/BoxActivity';
import { QuizActivity } from './components/QuizActivity';
import { ImageZoom } from './components/ImageZoom';
import { Network, Box, ArrowRight } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<ActivityState>(ActivityState.HOME);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string, alt: string } | null>(null);

  const startCollection = (c: Collection) => {
    setActiveCollection(c);
    setState(ActivityState.MATRIX);
  };

  const renderContent = () => {
    switch (state) {
      case ActivityState.HOME:
        return (
          <div className="max-w-5xl mx-auto py-12 px-4">
            <header className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 tracking-tight">Phylo<span className="text-emerald-500">Genius</span></h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Explore la biodiversité, compare les espèces et construis toi-même leur arbre de parenté. Prêt pour l'aventure scientifique ?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COLLECTIONS.map(c => (
                <div key={c.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-100 group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={c.thumbnail} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white leading-none">{c.name}</h3>
                      {c.subtitle && <span className="block text-sm font-medium text-slate-200 mt-1">{c.subtitle}</span>}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 mb-6 leading-relaxed">{c.description}</p>
                    <button
                      onClick={() => startCollection(c)}
                      className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-500"
                    >
                      Commencer l'enquête <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Coming Soon Placeholder */}
              <div className="bg-slate-50 rounded-2xl shadow-inner border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 opacity-75">
                <span className="text-4xl mb-4">🌿</span>
                <h3 className="text-xl font-bold text-slate-400">Collection Végétaux</h3>
                <p className="text-slate-400 text-sm mt-2">Bientôt disponible...</p>
              </div>
            </div>
          </div>
        );

      case ActivityState.MATRIX:
        return activeCollection && (
          <div className="h-screen p-4 md:p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setState(ActivityState.HOME)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">← Accueil</button>
              <h2 className="text-xl font-bold text-slate-700">
                {activeCollection.name}
                {activeCollection.subtitle && <span className="text-slate-400 font-normal ml-2">({activeCollection.subtitle})</span>}
              </h2>
            </div>
            <MatrixActivity
              collection={activeCollection}
              onComplete={() => setState(ActivityState.CHOICE)}
              onZoom={(src, alt) => setZoomedImage({ src, alt })}
            />
          </div>
        );

      case ActivityState.CHOICE:
        return (
          <div className="h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Comment veux-tu représenter l'évolution ?</h2>
              <p className="text-xl text-slate-600 mb-12">Les deux méthodes racontent la même histoire !</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                  onClick={() => setState(ActivityState.TREE)}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-500 group text-left"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                    <Network size={32} className="text-indigo-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Arbre Phylogénétique</h3>
                  <p className="text-slate-500">Place les espèces sur les branches pour voir qui partage un ancêtre commun.</p>
                </button>

                <button
                  onClick={() => setState(ActivityState.BOXES)}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-emerald-500 group text-left"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                    <Box size={32} className="text-emerald-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Groupes Emboîtés</h3>
                  <p className="text-slate-500">Range les espèces dans des boîtes. Une petite boîte dans une grande partage ses caractères.</p>
                </button>
              </div>

              <button
                onClick={() => setState(ActivityState.MATRIX)}
                className="mt-12 text-slate-400 hover:text-slate-600 underline"
              >
                Revenir au tableau
              </button>
            </div>
          </div>
        );

      case ActivityState.TREE:
        return activeCollection && (
          <div className="h-screen p-4 md:p-8 flex flex-col">
            <TreeActivity
              collection={activeCollection}
              onBack={() => setState(ActivityState.CHOICE)}
              onHome={() => setState(ActivityState.HOME)}
              onQuiz={() => setState(ActivityState.QUIZ)}
              onZoom={(src, alt) => setZoomedImage({ src, alt })}
            />
          </div>
        );

      case ActivityState.BOXES:
        return activeCollection && (
          <div className="h-screen p-4 md:p-8 flex flex-col">
            <BoxActivity
              collection={activeCollection}
              onBack={() => setState(ActivityState.CHOICE)}
              onHome={() => setState(ActivityState.HOME)}
              onQuiz={() => setState(ActivityState.QUIZ)}
              onZoom={(src, alt) => setZoomedImage({ src, alt })}
            />
          </div>
        );

      case ActivityState.QUIZ:
        return activeCollection && (
          <div className="h-screen p-4 md:p-8 flex flex-col">
            <QuizActivity
              collection={activeCollection}
              onHome={() => setState(ActivityState.HOME)}
            />
          </div>
        );

      default:
        return <div>Erreur</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 relative">
      {renderContent()}
      {zoomedImage && (
        <ImageZoom
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </div>
  );
}