import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, sendMessage } from '../services/geminiService';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { Send, Bot, User, BrainCircuit } from 'lucide-react';

const ChatView: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    const session = createChatSession();
    setChatSession(session);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSession || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(chatSession, userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-6">
      <div className="mb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-pink-500" />
            Deep Thinking Chat
         </h2>
         <p className="text-zinc-400 text-sm">Powered by Gemini 3 Pro with high reasoning budget.</p>
      </div>

      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 overflow-y-auto min-h-[500px] mb-4 shadow-inner">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
            <BrainCircuit className="w-16 h-16 mb-4 text-zinc-700" />
            <p>Ask complex questions. I am ready to think.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
              ${msg.role === 'user' ? 'bg-zinc-700' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap leading-relaxed shadow-md
              ${msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-100 rounded-tr-none' 
                : 'bg-indigo-900/20 border border-indigo-500/20 text-indigo-100 rounded-tl-none'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
               <Bot className="w-5 h-5" />
            </div>
            <div className="bg-indigo-900/10 border border-indigo-500/10 p-4 rounded-2xl rounded-tl-none text-indigo-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
              <span className="animate-pulse">Thinking deeply...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something complex..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:border-indigo-500 text-zinc-100 resize-none h-16"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
          className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
