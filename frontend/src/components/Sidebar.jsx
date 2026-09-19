import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { 
  RiTerminalBoxLine, 
  RiChatNewLine, 
  RiSearchLine, 
  RiDeleteBin6Line, 
  RiEditBoxLine, 
  RiLogoutBoxRLine 
} from 'react-icons/ri';
import { FiCheck, FiX } from 'react-icons/fi';

const Sidebar = ({ 
  conversations, 
  activeId, 
  onSelectConversation, 
  onCreateConversation, 
  onDeleteConversation, 
  onRenameConversation 
}) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const saveRename = (id, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="w-80 h-full flex flex-col border-r border-slate-900 bg-slate-950 font-sans shrink-0">
      {/* Title & Brand */}
      <div className="p-5 flex items-center justify-between border-b border-slate-900/60">
        <div className="flex items-center gap-3 select-none">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-2xl shadow-lg shadow-indigo-500/10">
            <RiTerminalBoxLine />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white leading-none">PyMentor</h1>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider">AI ASSISTANT</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* New Conversation Button */}
      <div className="px-4 py-4">
        <button
          onClick={onCreateConversation}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-500/20 transition-all cursor-pointer text-sm"
        >
          <RiChatNewLine className="text-lg" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
          <RiSearchLine className="text-slate-500 text-lg mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none focus:ring-0 text-white placeholder-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Conversation History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 select-none">
            No history found
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            const isEditing = conv.id === editingId;

            return (
              <div
                key={conv.id}
                onClick={() => !isEditing && onSelectConversation(conv.id)}
                className={`group flex items-center justify-between px-3 py-3 rounded-xl transition-all select-none cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600/10 border-l-2 border-indigo-500 text-white' 
                    : 'text-slate-350 hover:bg-slate-900/60 hover:text-white'
                }`}
              >
                {isEditing ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(conv.id, e);
                        if (e.key === 'Escape') cancelRename(e);
                      }}
                    />
                    <button
                      onClick={(e) => saveRename(conv.id, e)}
                      className="p-1 text-emerald-400 hover:bg-slate-800 rounded cursor-pointer"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-1 text-red-400 hover:bg-slate-800 rounded cursor-pointer"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium truncate max-w-[170px]">
                      {conv.title}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => startRename(conv, e)}
                        className="p-1 text-slate-500 hover:text-white hover:bg-slate-850 rounded cursor-pointer"
                        title="Rename Chat"
                      >
                        <RiEditBoxLine />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-850 rounded cursor-pointer"
                        title="Delete Chat"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-900 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden select-none">
          <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm tracking-wider uppercase shrink-0">
            {user?.username ? user.username.substring(0, 2) : 'PY'}
          </div>
          <div className="overflow-hidden leading-tight">
            <div className="text-xs font-semibold text-white truncate max-w-[120px]">
              {user?.username || 'Python Developer'}
            </div>
            <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
              {user?.email || 'name@example.com'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 focus:outline-none transition-colors border border-transparent hover:border-red-500/10 cursor-pointer"
          title="Sign Out"
        >
          <RiLogoutBoxRLine className="text-lg" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
