import React, { useState } from 'react';
import { Header } from './components/Header';
import { DocumentUploader } from './components/DocumentUploader';
import { ResearchForm } from './components/ResearchForm';
import { WorkflowProgress } from './components/WorkflowProgress';
import { ReportViewer } from './components/ReportViewer';
import { GroundedQA } from './components/GroundedQA';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { HelpModal } from './components/HelpModal';

import {
  UploadedDocument,
  TaskType,
  WritingStyle,
  OutputLength,
  WorkflowStep,
} from './types';
import { SAMPLE_YOLO_PAPERS } from './data/samplePapers';
import { FileSpreadsheet, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

const INITIAL_WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 1, title: 'Objective Analysis', description: 'Understand research goals and required scope', status: 'pending' },
  { id: 2, title: 'Document Ingestion', description: 'Read every uploaded PDF, DOCX, and TXT document', status: 'pending' },
  { id: 3, title: 'Information Extraction', description: 'Extract concepts, statistics, methodologies, and references', status: 'pending' },
  { id: 4, title: 'Cross-Document Comparison', description: 'Compare findings across all uploaded sources', status: 'pending' },
  { id: 5, title: 'Gap & Contradiction Identification', description: 'Identify agreements, conflicts, limitations, and research gaps', status: 'pending' },
  { id: 6, title: 'Outline Generation', description: 'Construct a structured research report outline', status: 'pending' },
  { id: 7, title: 'Draft Synthesis', description: 'Write complete draft in selected style and length', status: 'pending' },
  { id: 8, title: 'Source Grounding Audit', description: 'Verify every claim against uploaded evidence', status: 'pending' },
  { id: 9, title: 'Final Report & Citations', description: 'Format 11 required sections with explicit source citations', status: 'pending' },
];

export default function App() {
  // Knowledge Base State
  const [documents, setDocuments] = useState<UploadedDocument[]>(SAMPLE_YOLO_PAPERS);

  // Form State
  const [objective, setObjective] = useState<string>(
    'Using the uploaded research papers, create a literature review on YOLO object detection. Compare all uploaded papers, explain similarities and differences, identify research gaps, mention limitations, and cite every claim strictly without outside knowledge.'
  );
  const [taskType, setTaskType] = useState<TaskType>('Literature Review');
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('Academic');
  const [outputLength, setOutputLength] = useState<OutputLength>('Detailed');

  // Generation & Workflow State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(INITIAL_WORKFLOW_STEPS);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generationError, setErrorMessage] = useState<string | null>(null);

  // UI Modal & Tab State
  const [activeTab, setActiveTab] = useState<'report-generator' | 'grounded-qa'>('report-generator');
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Document Handlers
  const handleAddDocuments = (newDocs: UploadedDocument[]) => {
    setDocuments((prev) => {
      const existingIds = new Set(prev.map((d) => d.name));
      const filtered = newDocs.filter((d) => !existingIds.has(d.name));
      return [...prev, ...filtered];
    });
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllDocuments = () => {
    setDocuments([]);
  };

  // Report Generation Process
  const handleGenerateReport = async () => {
    if (documents.length === 0 || !objective.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedReport(null);
    setCurrentStepIndex(0);

    // Simulate animated step progression to visualize the agent sequence
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < 7) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents,
          objective,
          taskType,
          writingStyle,
          outputLength,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report from server.');
      }

      const data = await response.json();
      setCurrentStepIndex(8); // Complete final step
      setGeneratedReport(data.report);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during report generation.');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedReport(null);
    setErrorMessage(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        documentCount={documents.length}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('report-generator')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'report-generator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              id="tab-report-generator"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Report & Synthesis Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('grounded-qa')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                activeTab === 'grounded-qa'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              id="tab-grounded-qa"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Grounded Q&A Assistant</span>
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-400 font-medium">
            Strict Source Grounding Active • Zero Outside Knowledge
          </div>
        </div>

        {/* Tab 1: Report Generator */}
        {activeTab === 'report-generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Knowledge Base & Form Controls */}
            <div className="lg:col-span-5 space-y-6">
              <DocumentUploader
                documents={documents}
                onAddDocuments={handleAddDocuments}
                onRemoveDocument={handleRemoveDocument}
                onPreviewDocument={(doc) => setPreviewDoc(doc)}
                onClearAllDocuments={handleClearAllDocuments}
              />

              <ResearchForm
                objective={objective}
                setObjective={setObjective}
                taskType={taskType}
                setTaskType={setTaskType}
                writingStyle={writingStyle}
                setWritingStyle={setWritingStyle}
                outputLength={outputLength}
                setOutputLength={setOutputLength}
                onGenerate={handleGenerateReport}
                isGenerating={isGenerating}
                documentCount={documents.length}
              />
            </div>

            {/* Right Column: Workflow Steps or Final Generated Report */}
            <div className="lg:col-span-7 space-y-6">
              {isGenerating && (
                <WorkflowProgress
                  steps={workflowSteps}
                  currentStepIndex={currentStepIndex}
                />
              )}

              {generationError && (
                <div className="bg-rose-950/50 border border-rose-800/60 rounded-2xl p-5 text-xs text-rose-200 space-y-3 shadow-lg">
                  <div className="flex items-center space-x-2 font-bold text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    <span>Report Generation Error</span>
                  </div>
                  <p>{generationError}</p>
                  <button
                    onClick={handleGenerateReport}
                    className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Report Generation</span>
                  </button>
                </div>
              )}

              {generatedReport && !isGenerating && (
                <ReportViewer
                  reportMarkdown={generatedReport}
                  onReset={handleReset}
                  documentNames={documents.map((d) => d.name)}
                />
              )}

              {!isGenerating && !generatedReport && !generationError && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
                  <div className="inline-flex p-4 bg-indigo-600/10 text-indigo-400 rounded-full border border-indigo-500/20">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-base font-bold text-slate-100">
                      Ready to Generate Research Report
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Select your research request and options on the left, then click <strong>Generate Source-Grounded Report</strong> to run the automated 9-step evidence synthesis agent.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center space-x-4 text-[11px] text-slate-400 font-mono">
                    <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      ✓ 11 Required Sections
                    </span>
                    <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      ✓ Inline Source Citations
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Grounded Q&A Assistant */}
        {activeTab === 'grounded-qa' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DocumentUploader
              documents={documents}
              onAddDocuments={handleAddDocuments}
              onRemoveDocument={handleRemoveDocument}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
              onClearAllDocuments={handleClearAllDocuments}
            />

            <GroundedQA documents={documents} />
          </div>
        )}
      </main>

      {/* Modals */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
