import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { UploadedDocument, QAHistoryItem } from '../types';

interface GroundedQAProps {
  documents: UploadedDocument[];
}

export const GroundedQA: React.FC<GroundedQAProps> = ({ documents }) => {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<QAHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const QUICK_QUESTIONS = [
    'What was the mAP50 score for YOLOv8n on the SOD dataset in Paper 2?',
    'How does YOLOv8 handle small objects compared to YOLOv5?',
    'What loss functions are used in YOLOv8 according to the papers?',
    'Does any paper mention quantum computing applications?',
  ];

  const handleAskQuestion = async (qText?: string) => {
    const textToAsk = qText || question;
    if (!textToAsk.trim() || documents.length === 0 || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents,
          question: textToAsk,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get answer');
      }

      const data = await res.json();
      const newQa: QAHistoryItem = {
        id: `qa-${Date.now()}`,
        question: textToAsk,
        answer: data.answer || 'Information not available in the uploaded documents.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourcesCited: documents.map((d, i) => `[Doc ${i + 1}: ${d.name}]`),
      };

      setHistory((prev) => [newQa, ...prev]);
      setQuestion('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while getting the answer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4" id="grounded-qa-card">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Grounded Q&A Assistant
          </h2>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Strict Source Guard</span>
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Ask specific questions across your uploaded knowledge base. Responses are strictly grounded in your files.
      </p>

      {/* Input Box */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
          placeholder="e.g. Which model achieved 92.4% precision on the SOD dataset?"
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          id="input-grounded-qa"
        />
        <button
          onClick={() => handleAskQuestion()}
          disabled={isLoading || !question.trim() || documents.length === 0}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm shrink-0"
          id="btn-ask-qa"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Questions */}
      <div className="space-y-1 pt-1">
        <p className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Suggested Questions:</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              disabled={isLoading || documents.length === 0}
              className="text-left text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
              id={`btn-quick-qa-${idx}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-800 max-h-80 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2"
            >
              <div className="flex items-start space-x-2 text-xs font-semibold text-slate-200">
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </div>

              <div className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="whitespace-pre-wrap leading-relaxed">{item.answer}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Answered at {item.timestamp} • Grounded in active documents
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
