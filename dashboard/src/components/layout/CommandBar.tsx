'use client';

import React from 'react';
import { Send, Loader2, ShieldCheck, Zap, Lock, Terminal, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMeshStore } from '@/store/meshStore';

interface CommandBarProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendPrompt: (e?: React.FormEvent, customPrompt?: string) => void;
}

export default function CommandBar({ 
  userInput, 
  setUserInput, 
  handleSendPrompt
}: CommandBarProps) {
  const { isProcessing, setTerminalOpen } = useMeshStore();
  
  const hints = [
    { label: "Full Scan", icon: ShieldCheck, color: "bg-pastel-lavender" },
    { label: "Optimize", icon: Zap, color: "bg-pastel-mint" },
    { label: "Audit", icon: Lock, color: "bg-pastel-rose" }
  ];

  return (
    <div className="bg-white dark:bg-black border-[4px] border-black dark:border-white p-10 shadow-brutalist relative overflow-hidden shrink-0">
      <form 
        onSubmit={handleSendPrompt} 
        className="relative flex flex-col md:flex-row gap-8"
      >
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Inject protocol requirements..."
          className="flex-1 bg-black/5 dark:bg-white/5 border-[4px] border-black dark:border-white rounded-none p-8 text-xl placeholder-neo-muted outline-none transition-all resize-none min-h-[140px] font-black text-neo-text"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
        />
        
        <div className="flex md:flex-col gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setTerminalOpen(true)}
            className="p-6 border-[4px] border-black dark:border-white bg-white dark:bg-black hover:bg-pastel-yellow transition-colors shadow-brutalist"
            title="Terminal"
          >
            <Terminal className="w-8 h-8 text-black dark:text-white" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isProcessing || !userInput.trim()}
            className={`flex-1 px-10 border-[4px] border-black dark:border-white transition-all flex items-center justify-center gap-4 ${
              userInput.trim() 
                ? 'bg-neo-accent text-black shadow-brutalist hover:shadow-none hover:translate-x-2 hover:translate-y-2' 
                : 'bg-black/10 dark:bg-white/10 text-neo-muted cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
               <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
               <Send className="w-8 h-8" />
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-10 flex flex-wrap items-center gap-10">
        <div className="flex items-center gap-4">
           <Activity className="w-6 h-6 text-neo-accent" />
           <span className="text-xs font-black uppercase tracking-[0.3em] text-neo-muted">Quick Ops:</span>
        </div>
        <div className="flex flex-wrap gap-6">
          {hints.map((hint) => (
             <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                key={hint.label}
                type="button"
                onClick={() => setUserInput(hint.label)}
                className={`text-xs font-black px-8 py-3 border-[4px] border-black dark:border-white ${hint.color} text-black shadow-brutalist hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4`}
             >
                <hint.icon className="w-5 h-5" />
                <span>{hint.label}</span>
             </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
