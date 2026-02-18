import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { askPhyloGuide } from '../services/geminiService';

interface AIHelperProps {
  collectionId: string;
  matrixState: any;
}

export const AIHelper: React.FC<AIHelperProps> = ({ collectionId, matrixState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Bonjour ! Je suis ton assistant scientifique. Bloqué sur un caractère ? Demande-moi !" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const response = await askPhyloGuide(userMsg, collectionId, matrixState);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center gap-2"
      >
        <Sparkles size={24} />
        <span className="font-bold hidden md:inline">Aide IA</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-indigo-100 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <h3 className="font-bold">Professeur IA</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 text-slate-500 text-xs p-2 rounded-lg animate-pulse">
              Réflexion en cours...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ta question..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
