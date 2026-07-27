import React from 'react';
import { BookOpen, ShieldCheck, FileText, Info, HelpCircle } from 'lucide-react';

interface HeaderProps {
  documentCount: number;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ documentCount, onOpenHelp }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Source-Grounded Research & Writing Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Evidence Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero-Hallucination Research Engine • Evidence-backed Report Generator
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">Knowledge Base:</span>
            <span className="font-semibold text-white bg-slate-700 px-2 py-0.5 rounded-md">
              {documentCount} {documentCount === 1 ? 'Doc' : 'Docs'}
            </span>
          </div>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="View Workflow & Guidelines"
            id="btn-help-guide"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
