import React from 'react';
import { X, FileText, Calendar, Hash, BookOpen } from 'lucide-react';
import { UploadedDocument } from '../types';

interface DocumentPreviewModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3 overflow-hidden pr-2">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate" title={document.name}>
                {document.name}
              </h3>
              {document.authors && (
                <p className="text-xs text-slate-400 truncate">{document.authors}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            id="btn-close-preview-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Strip */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
            <span>Format: {document.type.toUpperCase()}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Words: ~{document.wordCount || (document.content ? document.content.split(/\s+/).length : 'N/A')}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Indexed: {new Date(document.uploadDate).toLocaleDateString()}</span>
          </span>
        </div>

        {/* Text Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 select-text">
          {document.content || (
            <p className="italic text-slate-500 text-center py-8">
              Binary PDF stored as inline data for Gemini processing. Raw extracted plain text preview is currently unavailable for this binary stream.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
