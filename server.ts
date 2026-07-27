import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser configuration for handling uploaded document payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy getter for Gemini AI client with required User-Agent
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set in Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Extract Document Content (DOCX / TXT / PDF metadata)
app.post('/api/extract-text', async (req: Request, res: Response) => {
  try {
    const { base64, mimeType, filename } = req.body;
    
    if (!base64) {
      return res.status(400).json({ error: 'Missing base64 document payload' });
    }

    const buffer = Buffer.from(base64, 'base64');

    if (mimeType.includes('wordprocessingml') || filename.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      return res.json({ text: result.value });
    }

    if (mimeType.includes('text/plain') || filename.endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      return res.json({ text });
    }

    // For PDFs, send inline base64 to Gemini to summarize/extract raw structured text
    const ai = getGeminiClient();
    const prompt = `Extract all text, sections, main findings, metrics, and author details from this uploaded document into clean readable plain text for research indexing. Maintain key statistics, tables, and citations accurately.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64,
            },
          },
          { text: prompt },
        ],
      },
    });

    return res.json({ text: response.text || 'Unable to extract text from PDF.' });
  } catch (err: any) {
    console.error('Error extracting document text:', err);
    return res.status(500).json({ error: err.message || 'Failed to extract text from document' });
  }
});

// Generate Source-Grounded Research Report
app.post('/api/generate-report', async (req: Request, res: Response) => {
  try {
    const { documents, objective, writingStyle, outputLength, taskType } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'At least one uploaded document is required.' });
    }

    const ai = getGeminiClient();

    // Prepare document context strings and inline parts
    let docContextPrompt = `You are a world-class Source-Grounded AI Research & Writing Assistant.
Your absolute mandate is STRICT FACTUAL ACCURACY grounded ONLY in the uploaded documents provided below.

CRITICAL GROUNDING & KNOWLEDGE RULES:
1. READ ALL UPLOADED DOCUMENTS CAREFULLY.
2. USE ONLY THE UPLOADED DOCUMENTS AS EVIDENCE unless explicitly instructed otherwise.
3. NEVER INVENT FACTS.
4. NEVER FABRICATE REFERENCES OR AUTHORS.
5. NEVER GENERATE UNSUPPORTED CLAIMS.
6. IF EVIDENCE FOR A CLAIM OR DETAIL IS NOT AVAILABLE IN THE UPLOADED DOCUMENTS, YOU MUST EXPLICITLY STATE:
   "Information not available in the uploaded documents."
7. MENTION CONFLICTING OR CONTRADICTORY FINDINGS BETWEEN DOCUMENTS WHEREVER THEY OCCUR.
8. CITE THE SPECIFIC SUPPORTING DOCUMENT FOR EVERY IMPORTANT STATEMENT AND CLAIM using explicit inline tags like [Doc 1: Document Name] or [Doc 2: Title].

TASK SPECIFICATIONS:
- Primary Task: ${taskType || 'Literature Review'}
- User Research Objective / Prompt: "${objective}"
- Target Writing Style: ${writingStyle || 'Academic'} (e.g. Academic, Professional, Technical, Simple, Executive, Student Notes)
- Output Depth/Length: ${outputLength || 'Detailed'} (e.g. Short, Medium, Detailed, Comprehensive)

MANDATORY OUTPUT FORMAT:
You MUST structure your response into the exact 11 standard markdown sections listed below. Do NOT omit any section! If evidence is missing for a section, state "Information not available in the uploaded documents."

# Research Objective
[State the exact research question and scope based on user prompt and uploaded document context]

# Executive Summary
[High-level executive summary tailored to the requested writing style and length]

# Key Findings
[Core findings extracted across uploaded sources with inline citations [Doc ID: Name]]

# Evidence From Uploaded Sources
[Detailed supporting evidence, direct quotes, and exact data points from uploaded papers]

# Comparison Between Documents
[In-depth cross-document comparison matrix and comparative discussion explaining similarities, differences, and performance variations]

# Important Statistics
[Key statistical metrics, benchmarks, precision, recall, mAP, speed, FLOPs, or exact dataset numbers]

# Methodologies
[Detailed methodology comparison across the uploaded documents]

# Limitations
[Specific limitations, boundary conditions, and weaknesses acknowledged in the uploaded documents]

# Research Gaps
[Unanswered research questions, missing evidence, or future research directions noted in the sources]

# Final Draft
[A complete, beautifully formatted, professional draft written according to the specified Task Type and Writing Style with exhaustive citations]

# References
[Clear numbered reference list mapping [Doc 1], [Doc 2], etc. to document names, authors, and year]

--- UPLOADED DOCUMENTS KNOWLEDGE BASE ---
`;

    const contentsParts: any[] = [];

    // Add inline files or plain text to contents
    documents.forEach((doc: any, index: number) => {
      const docHeader = `\n--- DOCUMENT [Doc ${index + 1}]: "${doc.name}" (Title: ${doc.title || doc.name}) ---\n`;
      
      if (doc.content && doc.content.length > 0) {
        docContextPrompt += `${docHeader}${doc.content.slice(0, 50000)}\n`;
      } else if (doc.base64 && doc.type === 'pdf') {
        docContextPrompt += `${docHeader}[Binary PDF Attached as Inline Data below]\n`;
        contentsParts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: doc.base64,
          },
        });
      }
    });

    contentsParts.unshift({ text: docContextPrompt });
    contentsParts.push({ text: `Generate the full, complete source-grounded report now adhering strictly to the required 11 markdown sections and citation rules.` });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: contentsParts },
    });

    const reportText = response.text || 'Failed to generate report.';

    return res.json({
      report: reportText,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate research report.' });
  }
});

// Interactive Grounded Q&A
app.post('/api/answer-question', async (req: Request, res: Response) => {
  try {
    const { documents, question } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'No documents available for question answering.' });
    }

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getGeminiClient();

    let contextText = `You are a strict source-grounded Q&A assistant. Answer the user's question using ONLY the evidence contained in the uploaded documents below.

RULES:
1. If the answer is present in the uploaded documents, answer accurately and cite the exact supporting document [Doc X: Title].
2. If the answer is NOT available in the uploaded documents, respond EXACTLY with:
   "Information not available in the uploaded documents."
3. Do NOT guess or draw on external knowledge.

USER QUESTION: "${question}"

UPLOADED DOCUMENTS:
`;

    documents.forEach((doc: any, idx: number) => {
      contextText += `\n[Doc ${idx + 1}]: "${doc.name}"\n${doc.content}\n`;
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contextText,
    });

    return res.json({
      answer: response.text || 'Information not available in the uploaded documents.',
    });
  } catch (err: any) {
    console.error('Error answering question:', err);
    return res.status(500).json({ error: err.message || 'Failed to process question.' });
  }
});

// Server Initialization
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
