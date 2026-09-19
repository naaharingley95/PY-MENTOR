import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import MonacoPanel from '../components/MonacoPanel';
import api from '../api/axios';
import { RiCodeLine, RiTerminalBoxLine } from 'react-icons/ri';
import { FiCpu } from 'react-icons/fi';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  
  // Monaco editor state
  const [editorCode, setEditorCode] = useState(
    '# Welcome to PyMentor Workspace!\n# Write Python code here, then use fast actions below to explain or debug.\n\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Python Developer"))\n'
  );
  const [showEditor, setShowEditor] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);

  // Load user conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch active conversation detail when activeId changes
  useEffect(() => {
    if (activeId) {
      fetchConversationDetail(activeId);
    } else {
      setActiveConversation(null);
    }
  }, [activeId]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, chatLoading]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !activeId) {
        setActiveId(res.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch conversation history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetail = async (id) => {
    try {
      const res = await api.get(`/chat/conversations/${id}`);
      setActiveConversation(res.data);
    } catch (err) {
      setError('Failed to fetch conversation detail');
      console.error(err);
    }
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
  };

  const handleCreateConversation = async () => {
    try {
      const res = await api.post('/chat/conversations', { title: 'New Conversation' });
      setConversations((prev) => [res.data, ...prev]);
      setActiveId(res.data.id);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await api.delete(`/chat/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setActiveConversation(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleRenameConversation = async (id, title) => {
    try {
      const res = await api.patch(`/chat/conversations/${id}`, { title });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: res.data.title } : c))
      );
      if (activeId === id) {
        setActiveConversation((prev) => prev ? { ...prev, title: res.data.title } : null);
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  // Send message from chat input console
  const handleSendMessage = async (content, mode) => {
    setChatLoading(true);
    try {
      // 1. Pessimistic message add for immediate user feedback
      const tempUserMsg = {
        id: 'temp-user',
        role: 'user',
        content,
        mode,
        created_at: new Date().toISOString(),
      };

      if (activeConversation) {
        setActiveConversation((prev) => ({
          ...prev,
          messages: [...prev.messages, tempUserMsg],
        }));
      } else {
        // Create active conversation shell
        setActiveConversation({
          id: 'temp-conv',
          title: content.substring(0, 30),
          messages: [tempUserMsg],
        });
      }

      // 2. Call backend send message endpoint
      const res = await api.post('/chat/send', {
        content,
        mode,
        conversation_id: activeId,
      });

      // 3. Receive responses
      const aiResponse = res.data;
      const targetConvId = aiResponse.conversation_id;

      // 4. Update state with real records
      if (!activeId) {
        // Conversation was auto-created on first message
        setActiveId(targetConvId);
        await fetchConversations();
      } else {
        // Fetch detailed conversations to sync messages
        await fetchConversationDetail(targetConvId);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove temp messages and show warning bubble
      if (activeId) {
        await fetchConversationDetail(activeId);
      }
    } finally {
      setChatLoading(false);
    }
  };

  // Apply code snippet from chat blocks directly into Monaco editor
  const handleApplyCode = (codeSnippet) => {
    setEditorCode(codeSnippet);
    setShowEditor(true);
  };

  // Monaco Panel action triggers (Explain, Debug, Complexity, Tests)
  const handleEditorAction = async (actionType) => {
    if (!editorCode.trim()) return;

    let prompt = '';
    switch (actionType) {
      case 'explain':
        prompt = `Explain the following code:\n\n\`\`\`python\n${editorCode}\n\`\`\``;
        break;
      case 'debug':
        prompt = `Identify any errors or bugs in this code, and fix them:\n\n\`\`\`python\n${editorCode}\n\`\`\``;
        break;
      case 'complexity':
        prompt = `Analyze the time and space complexity of this code:\n\n\`\`\`python\n${editorCode}\n\`\`\``;
        break;
      case 'tests':
        prompt = `Generate unit tests using pytest for this code:\n\n\`\`\`python\n${editorCode}\n\`\`\``;
        break;
      default:
        return;
    }

    await handleSendMessage(prompt, actionType);
  };

  // Insert current editor code snippet into chat console input
  const handleSendToChat = () => {
    const formattedCode = `\`\`\`python\n${editorCode}\n\`\`\``;
    // Dispatches a helper trigger or just sends directly
    handleSendMessage(formattedCode, 'ask');
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

      {/* Main Console Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900/40">
        
        {/* Workspace Dashboard Header */}
        <header className="px-6 py-4 bg-slate-950 border-b border-slate-900 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-sm font-semibold text-slate-350">
              {activeConversation ? activeConversation.title : 'Welcome Workspace'}
            </h2>
          </div>
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              showEditor 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <RiCodeLine className="text-sm" />
            <span>{showEditor ? 'Hide Editor' : 'Show Editor'}</span>
          </button>
        </header>

        {/* Chat Log Panel */}
        <div className="flex-1 overflow-y-auto bg-slate-950/20">
          {!activeConversation ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none max-w-xl mx-auto">
              <div className="flex items-center justify-center h-16 w-16 rounded-3xl bg-indigo-600/10 text-indigo-400 text-4xl mb-6 shadow-inner">
                <FiCpu className="animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build Better Python Apps</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Ask coding questions, generate boilerplate, explain scripts line-by-line, audit complexity, or create tests instantly with your PyMentor AI.
              </p>
              <button
                onClick={handleCreateConversation}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-indigo-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Create new chat to begin
              </button>
            </div>
          ) : (
            <div className="flex flex-col min-w-0">
              {activeConversation.messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onApplyCode={handleApplyCode}
                />
              ))}

              {/* AI Processing Bubble */}
              {chatLoading && (
                <div className="flex w-full gap-4 p-5 bg-slate-900/20 border-b border-slate-900/40">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-lg shadow-md animate-pulse">
                    <RiTerminalBoxLine />
                  </div>
                  <div className="flex flex-col gap-2 overflow-hidden w-full">
                    <span className="text-xs font-semibold text-slate-500 animate-pulse">
                      PyMentor is thinking...
                    </span>
                    <div className="flex gap-1.5 items-center py-2">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar console */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={chatLoading}
        />
      </main>

      {/* Monaco Panel */}
      {showEditor && (
        <MonacoPanel
          code={editorCode}
          onChange={(newVal) => setEditorCode(newVal)}
          onAction={handleEditorAction}
          onSendToChat={handleSendToChat}
        />
      )}
    </div>
  );
};

export default Dashboard;
