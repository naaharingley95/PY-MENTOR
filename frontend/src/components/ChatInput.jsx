import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { 
  HelpCircle, 
  Code2, 
  Bug, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  Lightbulb 
} from 'lucide-react';

const MODES = [
  { id: 'ask', label: 'Ask Question', icon: HelpCircle, desc: 'General programming query' },
  { id: 'generate', label: 'Generate Code', icon: Code2, desc: 'Produce fresh Python scripts' },
  { id: 'debug', label: 'Debug Errors', icon: Bug, desc: 'Find and fix runtime bugs' },
  { id: 'explain', label: 'Explain Code', icon: BookOpen, desc: 'Detailed code walkthrough' },
  { id: 'complexity', label: 'Complexity Analysis', icon: Clock, desc: 'Analyze Time/Space complexity' },
  { id: 'tests', label: 'Generate Tests', icon: CheckSquare, desc: 'Write pytest test suites' },
  { id: 'hint', label: 'Get Hint', icon: Lightbulb, desc: 'Progressive problem solving hints' },
];

const ChatInput = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('ask');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Auto-resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];
  const ActiveIcon = activeMode.icon;

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSendMessage(content, mode);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-slate-900 bg-slate-950/60 backdrop-blur-xl relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 relative">
        <div className="flex gap-2 items-end bg-slate-900/80 border border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-inner">
          
          {/* Mode Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-950/50 hover:bg-slate-950 text-indigo-400 hover:text-indigo-300 rounded-xl transition-all text-sm border border-slate-800/60 font-semibold cursor-pointer shrink-0"
              title="Select Assistant Mode"
            >
              <ActiveIcon className="text-lg shrink-0" />
              <span className="hidden sm:inline">{activeMode.label}</span>
            </button>

            {showModeDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-850 bg-slate-950/40">
                  <span className="text-xs font-semibold text-slate-400">MENTORING MODE</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {MODES.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setMode(item.id);
                          setShowModeDropdown(false);
                        }}
                        className={`w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-850 text-left transition-all cursor-pointer ${
                          mode === item.id ? 'bg-indigo-600/10 text-white' : 'text-slate-300'
                        }`}
                      >
                        <ItemIcon className={`text-lg mt-0.5 shrink-0 ${mode === item.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <div>
                          <div className={`text-sm font-semibold ${mode === item.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Text Input Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'debug'
                ? 'Paste code with errors here (Enter to submit)...'
                : mode === 'complexity'
                ? 'Paste Python code to analyze complexity...'
                : 'Ask PyMentor anything about Python...'
            }
            className="flex-1 max-h-48 resize-none bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-white placeholder-slate-500 py-2.5 px-2 text-sm leading-relaxed scrollbar-none font-mono"
            style={{ minHeight: '38px' }}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!content.trim() || disabled}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10 cursor-pointer shrink-0"
            title="Send Message"
          >
            <FiSend className="text-sm" />
          </button>
        </div>

        <div className="flex justify-between px-3 text-[10px] text-slate-500 font-sans">
          <span>Mode: <strong className="text-indigo-400 uppercase">{mode}</strong></span>
          <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
