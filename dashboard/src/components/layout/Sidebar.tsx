'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, Search, Code2, ShieldCheck, 
  CheckCircle, Cloud, Activity, Settings
} from 'lucide-react';
import { useMeshStore } from '@/store/meshStore';

const agents = [
  { id: 'Architect', name: 'Architect', icon: Cpu, color: 'bg-pastel-lavender' },
  { id: 'Reviewer', name: 'Reviewer', icon: Search, color: 'bg-pastel-yellow' },
  { id: 'Coder', name: 'Coder', icon: Code2, color: 'bg-pastel-mint' },
  { id: 'Security', name: 'Security', icon: ShieldCheck, color: 'bg-pastel-rose' },
  { id: 'Quality', name: 'Quality', icon: CheckCircle, color: 'bg-pastel-peach' },
  { id: 'Infra', name: 'Infra', icon: Cloud, color: 'bg-pastel-sky' },
  { id: 'SRE', name: 'SRE', icon: Activity, color: 'bg-white' }
];

export default function Sidebar() {
  const activeAgent = useMeshStore((state) => state.activeAgent);

  return (
    <div className="w-24 lg:w-28 h-full border-r-[4px] border-black dark:border-white bg-white dark:bg-black flex flex-col z-30 transition-all duration-500 relative shrink-0">
      {/* Brand Icon */}
      <div className="p-8 flex items-center justify-center border-b-[4px] border-black dark:border-white bg-neo-accent">
        <div className="w-12 h-12 bg-black dark:bg-white rounded-none flex items-center justify-center text-white dark:text-black font-black text-2xl shadow-brutalist border-2 border-white dark:border-black">
          N
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-10 space-y-10 overflow-y-auto scrollbar-hide flex flex-col items-center">
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.1, x: 5 }}
            className={`group w-14 h-14 rounded-none cursor-pointer transition-all flex items-center justify-center border-[4px] border-black dark:border-white relative ${
              activeAgent === agent.id 
                ? `${agent.color} shadow-brutalist translate-x-1 -translate-y-1` 
                : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={agent.name}
          >
            <agent.icon className={`w-6 h-6 ${activeAgent === agent.id ? 'text-black' : 'text-neo-muted group-hover:text-neo-text'}`} />
            
            {activeAgent === agent.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute -right-14 w-4 h-4 bg-black dark:bg-white rounded-none"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Settings */}
      <div className="p-8 border-t-[4px] border-black dark:border-white flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-none border-[4px] border-black dark:border-white flex items-center justify-center hover:bg-neo-accent hover:text-black transition-all cursor-pointer hover:shadow-brutalist hover:-translate-y-1">
          <Settings className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
