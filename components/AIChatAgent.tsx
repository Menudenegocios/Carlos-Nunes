
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { getAIAssistantResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const AIChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Olá! Sou o **Menu Flow**, seu guia no Menu de Negócios. Como posso ajudar seu negócio hoje? 🚀' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Adiciona mensagem do usuário à UI
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages as any);
    setIsLoading(true);

    try {
      // Prepara o histórico para o serviço (excluindo a mensagem atual que vai no sendMessage)
      // Também exclui a mensagem de boas-vindas do modelo para garantir que o histórico comece com 'user'
      const apiHistory = messages
        .filter((m, idx) => idx > 0) // Pula o primeiro 'Olá!' do bot
        .map(m => ({
          role: m.role as 'user' | 'model',
          parts: [{ text: m.content }]
        }));
      
      const aiResponse = await getAIAssistantResponse(userMessage, apiHistory);
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error("Chat Agent Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Puxa, tive um pequeno problema técnico. Pode tentar perguntar de novo?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-brand-primary text-white rounded-full shadow-[0_10px_40px_-10px_rgba(246,124,1,0.5)] flex items-center justify-center hover:scale-110 transition-all group relative active:scale-95"
        >
          <div className="absolute -top-2 -left-2 bg-white dark:bg-zinc-900 p-1.5 rounded-xl shadow-lg border border-brand-primary/20 animate-bounce">
            <Sparkles className="w-3 h-3 text-brand-primary" />
          </div>
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Janela de Chat */}
      {isOpen && (
        <div className="bg-white dark:bg-zinc-900 w-[380px] h-[550px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-orange-600 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Assistente Menu Flow</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold opacity-80 uppercase">Online Agora</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-surface/30 dark:bg-black/20 scrollbar-hide">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${
                    m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-zinc-800 text-brand-primary'
                  }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-[1.4rem] text-sm font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-zinc-800 dark:text-zinc-200 rounded-tl-none border border-gray-100 dark:border-zinc-700 text-gray-800'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-brand-primary">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-brand-primary flex items-center justify-center shadow-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white dark:bg-zinc-800 p-3 rounded-[1.4rem] rounded-tl-none border border-gray-100 dark:border-zinc-700">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre planos, Bio ou Catálogo..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-5 pr-14 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 dark:text-white transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2.5 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-3">
              Powered by Gemini & Menu ADS Intelligence
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
