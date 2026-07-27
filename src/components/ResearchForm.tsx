import React from 'react';
import { Search, Sparkles, FileSpreadsheet, AlignLeft, Sliders, Zap } from 'lucide-react';
import { TaskType, WritingStyle, OutputLength } from '../types';

interface ResearchFormProps {
  objective: string;
  setObjective: (val: string) => void;
  taskType: TaskType;
  setTaskType: (val: TaskType) => void;
  writingStyle: WritingStyle;
  setWritingStyle: (val: WritingStyle) => void;
  outputLength: OutputLength;
  setOutputLength: (val: OutputLength) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  documentCount: number;
}

const PRESET_PROMPTS = [
  'Create a comprehensive literature review on YOLO object detection, comparing methodologies, mAP scores, and model sizes.',
  'Compare all uploaded papers, explaining architectural similarities, performance differences, and execution speed.',
  'Analyze limitations and research gaps in small object detection and multi-scale object detection models.',
  'Generate student revision study notes with key formulas, backbone definitions, loss functions, and benchmark results.',
];

const TASK_TYPES: TaskType[] = [
  'Literature Review',
  'Research Report',
  'Technical Report',
  'Study Notes',
  'Executive Summary',
  'Paper Comparison',
  'Research Gap Analysis',
  'Methodology Comparison',
];

const WRITING_STYLES: WritingStyle[] = [
  'Academic',
  'Professional',
  'Technical',
  'Simple',
  'Executive',
  'Student Notes',
];

const OUTPUT_LENGTHS: OutputLength[] = [
  'Short',
  'Medium',
  'Detailed',
  'Comprehensive',
];

export const ResearchForm: React.FC<ResearchFormProps> = ({
  objective,
  setObjective,
  taskType,
  setTaskType,
  writingStyle,
  setWritingStyle,
  outputLength,
  setOutputLength,
  onGenerate,
  isGenerating,
  documentCount,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5" id="research-form-card">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <Search className="w-5 h-5 text-indigo-400" />
        <h2 className="text-base font-semibold text-slate-100">Research Objective & Settings</h2>
      </div>

      {/* Objective Input */}
      <div className="space-y-2">
        <label htmlFor="input-research-question" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Research Question / Writing Request <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="input-research-question"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="e.g. Using the uploaded research papers, create a literature review on YOLO object detection. Compare all uploaded papers, explain similarities, differences, research gaps, limitations, and cite every claim."
          rows={4}
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
        />

        {/* Presets */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Example Prompts:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setObjective(preset)}
                className="text-left text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors truncate max-w-full"
                id={`btn-preset-prompt-${idx}`}
              >
                "{preset.substring(0, 60)}..."
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
        {/* Task Type */}
        <div className="space-y-1.5">
          <label htmlFor="select-task-type" className="block text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
            <span>Primary Task</span>
          </label>
          <select
            id="select-task-type"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskType)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Writing Style */}
        <div className="space-y-1.5">
          <label htmlFor="select-writing-style" className="block text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Writing Style</span>
          </label>
          <select
            id="select-writing-style"
            value={writingStyle}
            onChange={(e) => setWritingStyle(e.target.value as WritingStyle)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {WRITING_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Output Length */}
        <div className="space-y-1.5">
          <label htmlFor="select-output-length" className="block text-xs font-semibold text-slate-300 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Detail Level</span>
          </label>
          <select
            id="select-output-length"
            value={outputLength}
            onChange={(e) => setOutputLength(e.target.value as OutputLength)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {OUTPUT_LENGTHS.map((len) => (
              <option key={len} value={len}>
                {len}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || documentCount === 0 || !objective.trim()}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
          isGenerating || documentCount === 0 || !objective.trim()
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.99]'
        }`}
        id="btn-generate-report"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Running Agent Research Workflow...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Generate Source-Grounded Report</span>
          </>
        )}
      </button>

      {documentCount === 0 && (
        <p className="text-[11px] text-amber-400 text-center font-medium">
          ⚠️ Please upload or load at least one research paper above before generating a report.
        </p>
      )}
    </div>
  );
};
