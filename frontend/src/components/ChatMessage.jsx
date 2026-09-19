import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import { RiTerminalBoxLine, RiUserLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const ChatMessage = ({ message, onApplyCode }) => {
  const { user } = useAuth();
  const isAssistant = message.role === 'assistant';

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');
      const isInline = inline || (!match && !codeContent.includes('\n'));

      return !isInline ? (
        <CodeBlock
          code={codeContent}
          language={match ? match[1] : 'python'}
          onApply={onApplyCode}
        />
      ) : (
        <code className="bg-slate-800 text-indigo-300 font-mono text-xs px-1.5 py-0.5 rounded-md border border-slate-700/50" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`flex w-full gap-4 p-5 transition-colors border-b border-slate-900/40 ${isAssistant ? 'bg-slate-900/20' : 'bg-transparent'}`}>
      <div className={`flex items-center justify-center h-9 w-9 rounded-xl shrink-0 text-lg shadow-md ${isAssistant ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-indigo-500/10' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
        {isAssistant ? <RiTerminalBoxLine /> : <RiUserLine />}
      </div>
      <div className="flex flex-col gap-1 overflow-hidden w-full">
        <span className="text-xs font-semibold text-slate-400 select-none">
          {isAssistant ? 'PyMentor AI' : user?.username || 'You'}
        </span>
        <div className="text-slate-200 text-[14px] leading-relaxed max-w-none prose prose-invert prose-indigo prose-sm">
          <ReactMarkdown components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
