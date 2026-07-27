import React from 'react';
import { CheckCircle2, Loader2, Circle, Cpu } from 'lucide-react';
import { WorkflowStep } from '../types';

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  currentStepIndex: number;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  steps,
  currentStepIndex,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4" id="workflow-progress-card">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h2 className="text-base font-semibold text-slate-100">
            Automated Agent Research Sequence
          </h2>
        </div>
        <span className="text-xs font-mono font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/50">
          Step {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-indigo-950/40 border border-indigo-500/40 shadow-sm'
                  : isDone
                  ? 'bg-slate-950/30 border border-slate-800/40 opacity-90'
                  : 'bg-slate-950/10 border border-transparent opacity-40'
              }`}
              id={`workflow-step-${idx + 1}`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-indigo-300'
                        : isDone
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    Step {step.id}: {step.title}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider animate-pulse">
                      Executing...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
