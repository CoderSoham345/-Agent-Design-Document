import React from 'react';
import { X, ShieldCheck, FileCheck, Layers, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">
              Agent Design & Operational Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            id="btn-close-help-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>9-Step Core Agent Workflow</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li><strong>Step 1:</strong> Understand user research objective</li>
              <li><strong>Step 2:</strong> Read all uploaded PDF, DOCX, TXT documents</li>
              <li><strong>Step 3:</strong> Extract key concepts, stats, methodologies, & references</li>
              <li><strong>Step 4:</strong> Cross-compare findings across all sources</li>
              <li><strong>Step 5:</strong> Identify agreements, contradictions, gaps, & limitations</li>
              <li><strong>Step 6:</strong> Generate structured research outline</li>
              <li><strong>Step 7:</strong> Write complete professional draft</li>
              <li><strong>Step 8:</strong> Audit draft against evidence for strict source grounding</li>
              <li><strong>Step 9:</strong> Deliver final report with citations</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Knowledge Source & Citation Rules</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Uploaded documents are the primary knowledge base.</li>
              <li>No invented facts or fabricated citations.</li>
              <li>If evidence does not exist in uploaded files, the assistant explicitly states: <em className="text-amber-300">"Information not available in the uploaded documents."</em></li>
              <li>Every major claim cites the supporting uploaded document <code className="text-indigo-300">[Doc X]</code>.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Required Output Structure</span>
            </h4>
            <p className="text-slate-400">
              Every report automatically includes 11 standard sections:
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-200">
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Research Objective</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Executive Summary</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Key Findings</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Evidence From Sources</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Comparison Between Docs</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Important Statistics</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Methodologies</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Limitations</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Research Gaps</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800"># Final Draft</div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 font-bold text-indigo-400"># References</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
