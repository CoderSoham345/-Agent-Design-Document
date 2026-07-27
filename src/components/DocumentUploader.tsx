import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Eye, Sparkles, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { UploadedDocument } from '../types';
import { SAMPLE_YOLO_PAPERS } from '../data/samplePapers';

interface DocumentUploaderProps {
  documents: UploadedDocument[];
  onAddDocuments: (docs: UploadedDocument[]) => void;
  onRemoveDocument: (id: string) => void;
  onPreviewDocument: (doc: UploadedDocument) => void;
  onClearAllDocuments: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  onAddDocuments,
  onRemoveDocument,
  onPreviewDocument,
  onClearAllDocuments,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (fileList: FileList) => {
    setIsUploading(true);
    setErrorMessage(null);
    const newDocs: UploadedDocument[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        if (!['pdf', 'docx', 'txt'].includes(ext)) {
          setErrorMessage(`Unsupported file format: ${file.name}. Please upload PDF, DOCX, or TXT.`);
          continue;
        }

        const base64 = await readFileAsBase64(file);
        let extractedText = '';

        // Extract text if TXT or DOCX, or ask backend server endpoint
        if (ext === 'txt') {
          extractedText = await file.text();
        } else {
          try {
            const res = await fetch('/api/extract-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                base64,
                mimeType: file.type || (ext === 'pdf' ? 'application/pdf' : 'application/docx'),
                filename: file.name,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              extractedText = data.text || '';
            }
          } catch (e) {
            console.warn('Server text extraction fallback:', e);
          }
        }

        const newDoc: UploadedDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: ext,
          content: extractedText,
          base64: ext === 'pdf' ? base64 : undefined,
          uploadDate: new Date().toISOString(),
          wordCount: extractedText ? extractedText.split(/\s+/).length : undefined,
          pageCount: Math.ceil(file.size / 30000) || 1,
        };

        newDocs.push(newDoc);
      }

      if (newDocs.length > 0) {
        onAddDocuments(newDocs);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing files.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleLoadSamplePapers = () => {
    onAddDocuments(SAMPLE_YOLO_PAPERS);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4" id="document-uploader-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-slate-100">Document Knowledge Base</h2>
        </div>
        
        {documents.length > 0 && (
          <button
            onClick={onClearAllDocuments}
            className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center space-x-1"
            id="btn-clear-all-docs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All ({documents.length})</span>
          </button>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 relative ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/30'
            : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-800/40'
        }`}
        id="dropzone-upload"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          id="file-input-hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Drag & drop research papers here, or <span className="text-indigo-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, DOCX, TXT, Research Papers, Technical Reports, Whitepapers
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-slate-900/90 rounded-xl flex items-center justify-center space-x-2 text-indigo-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
            <span className="text-sm font-medium">Processing & Indexing Documents...</span>
          </div>
        )}
      </div>

      {/* Sample Papers Trigger Button */}
      <div className="flex items-center justify-between bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-xs font-semibold text-indigo-200">Need sample papers to test?</p>
            <p className="text-[11px] text-slate-400">Load 3 real peer-reviewed YOLOv8 research papers</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLoadSamplePapers}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-sm transition-colors flex items-center space-x-1"
          id="btn-load-sample-papers"
        >
          <span>Load YOLO Papers</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Active Sources ({documents.length})
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
                id={`doc-item-${doc.id}`}
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className="p-2 bg-indigo-900/40 text-indigo-400 rounded-lg shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-indigo-400 shrink-0">
                        [Doc {idx + 1}]
                      </span>
                      <p className="text-xs font-medium text-slate-100 truncate" title={doc.name}>
                        {doc.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>{formatSize(doc.size)}</span>
                      <span>•</span>
                      <span className="uppercase">{doc.type}</span>
                      {doc.wordCount && (
                        <>
                          <span>•</span>
                          <span>~{doc.wordCount} words</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => onPreviewDocument(doc)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-700/60 rounded-lg transition-colors"
                    title="Preview Document Content"
                    id={`btn-preview-doc-${doc.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                    title="Remove Document"
                    id={`btn-remove-doc-${doc.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-slate-500 italic">
          No documents uploaded yet. Add PDFs, DOCX, or TXT papers to begin grounded research.
        </div>
      )}
    </div>
  );
};
