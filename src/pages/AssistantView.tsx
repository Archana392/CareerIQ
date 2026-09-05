import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantView: React.FC = () => {
  const { user, profile } = useAuth();
  const userName = user?.full_name || profile?.full_name || 'Archana';
  const targetRole = profile?.target_role || 'AI/ML Engineer';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hi ${userName}! I'm **CareerIQ AI**, your personal career assistant.\n\nI'm here to help you navigate your journey toward becoming a job-ready **${targetRole}**.\n\nAsk me anything about your verified skills, skill gaps, resume improvements, or recommended portfolio projects!`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    'What are my biggest skill gaps?',
    'What should I learn next?',
    'Which project should I build?',
    'How can I improve my resume?'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendAssistantChat(query.trim());
      const botMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: res.timestamp || new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue getting advice right now. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="careeriq-assistant-view" className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-4.5rem)]">
      
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>CareerIQ AI</span>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Mentor
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your personal AI career assistant.
          </p>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Reset Chat
        </button>
      </div>

      {/* Quick Questions Chips */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <span className="text-xs font-bold text-slate-500">Quick questions:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl shadow-2xs transition-all text-left"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => {
          const isBot = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isBot ? 'items-start' : 'items-start justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-blue-400 flex items-center justify-center font-bold shrink-0 shadow-2xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[78%] space-y-2 ${
                  isBot
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                    : 'bg-blue-600 text-white shadow-2xs font-medium'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{msg.text}</div>

                {isBot && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>CareerIQ AI is preparing advice...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="shrink-0 flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CareerIQ AI a question about your career, skills, or resume..."
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-2xs disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
};
