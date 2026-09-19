import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { 
  RiCodeBoxLine, 
  RiFileCopyLine, 
  RiTerminalLine, 
  RiBugLine, 
  RiBookOpenLine, 
  RiPulseLine, 
  RiListCheck 
} from 'react-icons/ri';
import { FiCheck, FiCheckSquare } from 'react-icons/fi';

const MonacoPanel = ({ code, onChange, onAction, onSendToChat }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="w-[500px] h-full flex flex-col border-l border-slate-900 bg-slate-950/45 backdrop-blur-xl shrink-0">
      {/* Editor Panel Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <RiCodeBoxLine className="text-indigo-400 text-lg" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Monaco Workspace</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-900 rounded-md transition-colors cursor-pointer"
            title="Copy editor contents"
          >
            {copied ? <FiCheck className="text-emerald-400 text-sm" /> : <RiFileCopyLine className="text-sm" />}
          </button>
          
          {/* Send context to Chat */}
          <button
            onClick={onSendToChat}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            title="Import code snippet to Chat console as context"
          >
            <RiTerminalLine className="text-xs" />
            <span>Send to Chat</span>
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          defaultLanguage="python"
          language="python"
          value={code}
          onChange={onChange}
          theme={isDark ? 'vs-dark' : 'light'}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Code Tools Fast Actions */}
      <div className="p-3 bg-slate-950 border-t border-slate-900 flex flex-wrap gap-2 justify-center select-none">
        <button
          onClick={() => onAction('explain')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-800 transition-colors cursor-pointer"
        >
          <RiBookOpenLine className="text-indigo-400 text-xs shrink-0" />
          <span>Explain</span>
        </button>

        <button
          onClick={() => onAction('debug')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-800 transition-colors cursor-pointer"
        >
          <RiBugLine className="text-indigo-400 text-xs shrink-0" />
          <span>Debug</span>
        </button>

        <button
          onClick={() => onAction('complexity')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-800 transition-colors cursor-pointer"
        >
          <RiPulseLine className="text-indigo-400 text-xs shrink-0" />
          <span>Complexity</span>
        </button>

        <button
          onClick={() => onAction('tests')}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-800 transition-colors cursor-pointer"
        >
          <FiCheckSquare className="text-indigo-400 text-xs shrink-0" />
          <span>Tests</span>
        </button>
      </div>
    </div>
  );
};

export default MonacoPanel;
