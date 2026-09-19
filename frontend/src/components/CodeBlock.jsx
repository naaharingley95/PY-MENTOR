import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { RiPlayListAddLine } from 'react-icons/ri';

const CodeBlock = ({ code, language = 'python', onApply }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 font-mono text-sm group shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-850 text-xs text-slate-400 font-sans select-none">
        <span className="font-semibold uppercase tracking-wider text-indigo-400 font-mono">{language}</span>
        <div className="flex items-center gap-3">
          {onApply && (
            <button
              onClick={() => onApply(code)}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 rounded-md transition-all cursor-pointer font-medium"
              title="Insert this code into Monaco Editor"
            >
              <RiPlayListAddLine />
              <span>Apply Code</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 px-2 hover:bg-slate-800 rounded-md"
          >
            {copied ? (
              <>
                <FiCheck className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: '13.5px',
            lineHeight: '1.5',
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
