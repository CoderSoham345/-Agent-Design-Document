export type WritingStyle = 
  | 'Academic'
  | 'Professional'
  | 'Technical'
  | 'Simple'
  | 'Executive'
  | 'Student Notes';

export type OutputLength = 
  | 'Short'
  | 'Medium'
  | 'Detailed'
  | 'Comprehensive';

export type TaskType = 
  | 'Literature Review'
  | 'Research Report'
  | 'Technical Report'
  | 'Study Notes'
  | 'Executive Summary'
  | 'Paper Comparison'
  | 'Research Gap Analysis'
  | 'Methodology Comparison';

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string; // 'pdf' | 'docx' | 'txt'
  content: string; // Extracted plain text or text summary
  base64?: string; // Optional raw base64 data for PDFs
  uploadDate: string;
  pageCount?: number;
  wordCount?: number;
  authors?: string;
  title?: string;
}

export interface ReportGenerationRequest {
  documents: UploadedDocument[];
  objective: string;
  taskType: TaskType;
  writingStyle: WritingStyle;
  outputLength: OutputLength;
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface GroundedReportResponse {
  markdown: string;
  structuredSections?: {
    objective?: string;
    executiveSummary?: string;
    keyFindings?: string;
    evidence?: string;
    comparison?: string;
    statistics?: string;
    methodologies?: string;
    limitations?: string;
    researchGaps?: string;
    finalDraft?: string;
    references?: string;
  };
  citationMap?: Record<string, string>;
  isGrounded: boolean;
  missingEvidenceNotes?: string[];
}

export interface QAHistoryItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  sourcesCited: string[];
}
