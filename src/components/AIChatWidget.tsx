"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiSend, FiMinimize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hello! I'm the Modern AI Shop assistant. How can I help you find the perfect futuristic gadget today?" }] }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>(["What are the best wearables?", "Show me some robotics", "Do you have any smart home devices?"]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, followUps]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", parts: [{ text }] };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue("");
    setFollowUps([]);
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      // Exclude the most recent message from history as it's passed as 'message'
      // Also, Gemini requires history to start with a 'user' role, so exclude the initial greeting
      const apiHistory = messages.filter((msg, idx) => !(idx === 0 && msg.role === "model"));
      
      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory, message: text })
      });

      if (!res.ok) {
        if (res.status === 429) {
           throw new Error("Too many requests. Please wait a moment.");
        }
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      
      const modelReply: Message = { role: "model", parts: [{ text: data.reply || "I'm having trouble processing that right now." }] };
      setMessages([...newHistory, modelReply]);
      
      if (data.followUps && Array.isArray(data.followUps)) {
        setFollowUps(data.followUps);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Chat service error.");
      // Revert the UI state
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary-violet text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:ring-offset-2 focus:ring-offset-[#090d16]"
          >
            <FiMessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 max-h-[600px] h-[80vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-cyan animate-pulse"></div>
                <h3 className="text-sm font-bold text-white">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <FiMinimize2 size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-primary-violet text-white rounded-br-sm" 
                      : "bg-white/5 text-slate-200 border border-white/10 rounded-bl-sm"
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}

              {/* Follow-ups */}
              {!isLoading && followUps.length > 0 && (
                <div className="flex flex-col items-start gap-2 pt-2">
                  {followUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left bg-primary-cyan/10 hover:bg-primary-cyan/20 border border-primary-cyan/30 text-primary-cyan text-[10px] px-3 py-1.5 rounded-full transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-cyan transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="w-8 h-8 rounded-full bg-primary-violet text-white flex items-center justify-center hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <FiSend size={12} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
