import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Props {
    src: string;
    alt: string;
    onClose: () => void;
}

export const ImageZoom: React.FC<Props> = ({ src, alt, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>
                <div className="overflow-auto max-h-[90vh]">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto object-contain"
                    />
                </div>
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-700">{alt}</span>
                    <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                        <ZoomIn size={16} /> Cliquez sur l'image pour fermer
                    </div>
                </div>
            </div>
        </div>
    );
};
