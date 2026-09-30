import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Parse lines into tokens: headings, code blocks, bullet lists, numbered lists, blockquotes, paragraphs
  const elements: React.ReactNode[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let codeBlockIndex = 0;
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type === 'ul' ? 'ul' : 'ol';
    const listClasses = listBuffer.type === 'ul'
      ? 'list-disc list-inside space-y-1 my-3 text-slate-700 pl-2'
      : 'list-decimal list-inside space-y-1 my-3 text-slate-700 pl-2';

    elements.push(
      <ListTag key={`list-${elements.length}`} className={listClasses}>
        {listBuffer.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Regex for bold **text**, inline code `code`, italic *text*
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/);
      // Bold
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

      let firstMatch: { type: 'code' | 'bold'; index: number; match: RegExpMatchArray } | null = null;

      if (codeMatch && codeMatch.index !== undefined) {
        firstMatch = { type: 'code', index: codeMatch.index, match: codeMatch };
      }
      if (boldMatch && boldMatch.index !== undefined) {
        if (!firstMatch || boldMatch.index < firstMatch.index) {
          firstMatch = { type: 'bold', index: boldMatch.index, match: boldMatch };
        }
      }

      if (!firstMatch) {
        parts.push(<span key={keyIdx++}>{remaining}</span>);
        break;
      }

      if (firstMatch.index > 0) {
        parts.push(<span key={keyIdx++}>{remaining.slice(0, firstMatch.index)}</span>);
      }

      if (firstMatch.type === 'code') {
        parts.push(
          <code key={keyIdx++} className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">
            {firstMatch.match[1]}
          </code>
        );
      } else if (firstMatch.type === 'bold') {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-slate-900">
            {firstMatch.match[1]}
          </strong>
        );
      }

      remaining = remaining.slice(firstMatch.index + firstMatch.match[0].length);
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushList();
        const codeText = codeBuffer.join('\n');
        const currentIndex = codeBlockIndex++;
        elements.push(
          <div key={`code-${currentIndex}`} className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/80 text-xs text-slate-400 font-mono border-b border-slate-800">
              <span>{codeLang || 'code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeText, currentIndex)}
                className="flex items-center gap-1.5 hover:text-slate-200 transition-colors py-0.5 px-2 rounded hover:bg-slate-800 cursor-pointer"
                title="Copy code"
              >
                {copiedCodeIndex === currentIndex ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-sans">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h3-${i}`} className="text-lg font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">
          {renderInline(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h2-${i}`} className="text-xl font-bold text-slate-900 mt-6 mb-2.5 pb-1 border-b border-slate-200/80">
          {renderInline(line.slice(3))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h1-${i}`} className="text-2xl font-extrabold text-slate-900 mt-6 mb-3">
          {renderInline(line.slice(2))}
        </h2>
      );
      continue;
    }

    // Bullet lists
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)/);
    if (bulletMatch) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(bulletMatch[2]);
      continue;
    }

    // Numbered lists
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (numberMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(numberMatch[2]);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 py-2 my-3 rounded-r-lg text-slate-700 italic">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Standard paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="my-2.5 text-slate-700 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className={`text-slate-800 ${className}`}>{elements}</div>;
};
