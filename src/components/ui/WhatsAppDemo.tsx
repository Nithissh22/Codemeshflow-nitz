"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";

export default function WhatsAppDemo() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; time: string; status: 'sent'|'delivered'|'read' }[]>([
    { text: "Hi, I need help with my recent order.", isUser: true, time: "10:24 AM", status: 'read' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const autoReplies = [
    "Hello! Welcome to our automated support. I can definitely help you with that.",
    "Could you please provide your 6-digit order ID?",
    "Thank you! Let me check the status for order #849302...",
    "Your order is currently out for delivery and will arrive by 4 PM today! 🚚",
    "Is there anything else I can assist you with?"
  ];

  const [replyIndex, setReplyIndex] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].isUser && replyIndex < autoReplies.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: autoReplies[replyIndex], isUser: false, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'read' }]);
        setReplyIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages, replyIndex]);

  const handleSimulateUser = () => {
    if (replyIndex === 1) {
      setMessages(prev => [...prev, { text: "Sure, it's 849302", isUser: true, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'read' }]);
    } else if (replyIndex === 4) {
      setMessages(prev => [...prev, { text: "That's great, thanks!", isUser: true, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'read' }]);
    }
  };

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[#0a0a09] pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      <div className="text-center mb-8 relative z-10">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.2em] mb-2 block">CONVERSATIONAL COMMERCE</span>
        <h3 className="text-3xl text-white font-display">Automated Chat Pipelines</h3>
        <p className="text-white/40 font-light text-sm mt-2 max-w-lg mx-auto">Experience how our custom WhatsApp API integrations handle customer queries instantly, 24/7, with dynamic database fetching.</p>
      </div>

      <div className="relative z-10 w-full max-w-[360px] h-[600px] bg-[#efe6dd] rounded-[30px] border-[6px] border-[#1a1a1a] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-display overflow-hidden">
               <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100&auto=format&fit=crop" alt="Brand" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-[15px] leading-tight">Brand Support <span className="text-[10px] bg-green-500/20 text-green-100 px-1 py-0.5 rounded ml-1">✓</span></div>
              <div className="text-white/80 text-[11px] font-light">{isTyping ? 'typing...' : 'online'}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <Video size={18} />
            <Phone size={18} />
            <MoreVertical size={18} />
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 pb-8 bg-[url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')] bg-cover bg-center">
          
          <div className="text-center my-2">
            <span className="bg-[#e1f3fb] text-[#556369] text-[11px] py-1 px-3 rounded-lg shadow-sm">TODAY</span>
          </div>

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[14px] shadow-sm relative ${msg.isUser ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                <div className="text-[#303030] pr-10 whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] text-gray-400 absolute bottom-1 right-2 flex items-center gap-1">
                  {msg.time}
                  {msg.isUser && <CheckCheck size={12} className="text-[#34b7f1]" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}

        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-2 flex items-center gap-2 relative z-20">
          <div className="flex-1 bg-white rounded-full h-10 px-4 flex items-center text-gray-400 text-[14px] shadow-sm">
            {(replyIndex === 1 || replyIndex === 4) ? (
              <span className="animate-pulse">Waiting for your response...</span>
            ) : "Type a message"}
          </div>
          <button 
            onClick={handleSimulateUser}
            disabled={!(replyIndex === 1 || replyIndex === 4)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              (replyIndex === 1 || replyIndex === 4) ? 'bg-[#00a884] text-white hover:bg-[#008f6f] cursor-pointer' : 'bg-gray-300 text-white cursor-not-allowed'
            }`}
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>

      </div>

      <div className="mt-8 text-center text-white/30 text-xs max-w-sm relative z-10">
        <p>This demo simulates an automated logic tree connecting to a mock CRM database to retrieve order statuses instantly.</p>
      </div>
    </div>
  );
}
