'use client';

import React from 'react';
import { Search, Zap, Bell, ShieldCheck, Database, Menu } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useMeshStore } from '@/store/meshStore';

export default function Header() {
  const status = useMeshStore((state) => state.status);
  const throughput = useMeshStore((state) => state.throughput);

  return (
    <header className="h-28 border-b-[4px] border-black dark:border-white bg-white/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-between px-16 sticky top-0 z-20 overflow-hidden shrink-0">
      <div className="flex items-center gap-12 relative z-10">
        <div className="lg:hidden p-3 border-[4px] border-black dark:border-white bg-white dark:bg-black text-neo-muted cursor-pointer shrink-0">
           <Menu className="w-8 h-8" />
        </div>
        
        <div className="flex items-center gap-10">
           <div className={`flex items-center gap-6 px-8 py-3 border-[4px] border-black dark:border-white shadow-brutalist transition-all duration-700 ${
             status === 'Online' ? 'bg-pastel-mint' : 'bg-pastel-rose'
           }`}>
             <div className="relative">
               <div className={`w-4 h-4 border-[2px] border-black ${status === 'Online' ? 'bg-black' : 'bg-red-500'}`} />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.2em] text-black">{status}</span>
           </div>

           <div className="hidden xl:flex items-center gap-10 border-l-[4px] border-black/10 dark:border-white/10 pl-10">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-neo-accent" />
                 <span className="text-xs font-black text-neo-muted uppercase tracking-widest">Protocol V4</span>
              </div>
              <div className="flex items-center gap-4">
                 <Database className="w-6 h-6 text-neo-muted" />
                 <span className="text-xs font-black text-neo-muted uppercase tracking-widest">Vault::Connected</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-10 relative z-10">
        <div className="hidden lg:flex items-center gap-16 border-r-[4px] border-black/10 dark:border-white/10 pr-16 text-right">
          <div>
            <p className="text-[10px] text-neo-muted uppercase font-black tracking-[0.3em] mb-1">Throughput</p>
            <p className="text-lg font-black text-neo-text flex items-center gap-3 justify-end">
              <Zap className="w-5 h-5 text-neo-accent fill-neo-accent" /> {throughput}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-1.5 border-[4px] border-black dark:border-white shadow-brutalist">
             <button className="p-4 bg-white dark:bg-black border-[2px] border-black dark:border-white text-neo-muted hover:text-neo-text transition-all">
               <Search className="w-6 h-6" />
             </button>
             <button className="p-4 bg-white dark:bg-black border-[2px] border-black dark:border-white text-neo-muted hover:text-neo-text transition-all relative">
               <Bell className="w-6 h-6" />
               <span className="absolute top-4 right-4 w-3 h-3 bg-neo-accent border-2 border-black" />
             </button>
          </div>
          
          <ThemeToggle />
          
          <div className="w-14 h-14 border-[4px] border-black dark:border-white bg-pastel-lavender flex items-center justify-center font-black text-black text-xl shadow-brutalist">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
