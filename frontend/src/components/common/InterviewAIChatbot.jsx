import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

function renderInlineMarkdown(str) {
  if (!str) return '';
  // Split bold **text**
  const segments = str.split(/(\*\*.*?\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    // Also handle inline `code`
    const codeSegments = seg.split(/(`.*?`)/g);
    return codeSegments.map((cs, ci) => {
      if (cs.startsWith('`') && cs.endsWith('`')) {
        return (
          <code key={`${i}-${ci}`} className="px-1 py-0.5 bg-slate-100 border border-slate-200 text-brand-700 rounded font-mono text-[10px]">
            {cs.slice(1, -1)}
          </code>
        );
      }
      return cs;
    });
  });
}

function renderFormattedBotMessage(text) {
  if (!text) return null;

  // Split by code blocks ```lang ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1 text-slate-800">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].match(/^[a-z0-9_-]+/i) ? lines.shift() : '';
          const code = lines.join('\n');
          return (
            <div key={pIdx} className="my-2 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-sm">
              {lang && (
                <div className="px-3 py-1 bg-slate-950 text-[9px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {lang}
                </div>
              )}
              <pre className="p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (line.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-display font-bold text-xs text-brand-900 mt-2 mb-1 flex items-center space-x-1.5">
                    <span>{line.replace('### ', '')}</span>
                  </h4>
                );
              }
              if (line.startsWith('#### ')) {
                return (
                  <h5 key={lIdx} className="font-bold text-[11px] text-slate-900 mt-1.5 mb-0.5">
                    {line.replace('#### ', '')}
                  </h5>
                );
              }
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start space-x-1.5 pl-1 my-0.5 text-[11px]">
                    <span className="text-brand-500 font-bold">•</span>
                    <span className="flex-1">{renderInlineMarkdown(line.replace(/^[-*]\s+/, ''))}</span>
                  </div>
                );
              }
              if (line.trim() === '') {
                return <div key={lIdx} className="h-1" />;
              }
              return (
                <p key={lIdx} className="leading-relaxed text-[11px]">
                  {renderInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function InterviewAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language, t } = useLanguage();
  const messagesEndRef = useRef(null);

  const initialGreeting = language === 'ta'
    ? {
        role: 'assistant',
        text: 'வணக்கம்! நான் உங்கள் **Interview AI Placement Coach** 🤖.\n\nZoho, TCS Digital, Amazon போன்ற நிறுவனங்களின் நேர்காணல் ரகசியங்கள் மற்றும் Resume Defense பற்றிய எந்த கேள்வியையும் என்னிடம் கேட்கலாம்!',
        suggestions: [
          'Zoho Round 3 Design Round tips',
          'TCS Digital SQL & TR Round',
          'Amazon Leadership Principles',
          'How to defend my resume?'
        ]
      }
    : {
        role: 'assistant',
        text: 'Hello! I am your **Interview AI Placement & Career Coach** 🤖.\n\nAsk me anything about interview blueprints for Zoho, TCS Digital, Amazon SDE-1, Resume Defense tips, or behavioral STAR answers.',
        suggestions: [
          'How to clear Zoho Round 3 LLD?',
          'TCS Digital SQL questions',
          'Amazon Leadership Principles guide',
          'How to defend projects on my resume?'
        ]
      };

  const [messages, setMessages] = useState([initialGreeting]);

  // Sync greeting on language change if only 1 message
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([initialGreeting]);
    }
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.ask({
        message: text.trim(),
        language
      });

      const reply = res.data.reply || 'Here are preparation tips for your placement interview.';
      const suggestions = res.data.quickSuggestions || [];

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          suggestions
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I could not connect to the placement counseling server. Please check your network connection and try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown before speaking
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([initialGreeting]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Bot className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span className="text-xs font-bold tracking-wide">
            {t('chatTitle')}
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <div className="text-sm font-display font-extrabold flex items-center space-x-1.5">
                  <span>{t('chatTitle')}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate max-w-[220px]">
                  {t('chatSubtitle')}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (isSpeaking && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-500 text-white font-medium rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderFormattedBotMessage(msg.text)
                  )}
                </div>

                {/* Speech audio toggle button for assistant replies */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-2 pl-1">
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="text-[10px] text-slate-400 hover:text-brand-600 flex items-center space-x-1"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                    </button>
                  </div>
                )}

                {/* Suggestions Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="px-2.5 py-1 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-full text-[10px] text-slate-700 hover:text-brand-700 font-medium transition-colors text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 p-2 bg-white rounded-xl border border-slate-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-200" />
                <span className="text-[11px] font-medium text-slate-500">Coach is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
