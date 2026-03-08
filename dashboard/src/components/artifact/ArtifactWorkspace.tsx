'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Code2, ShieldAlert, 
  CheckCircle, HardDrive, Loader2,
  ThumbsUp, ThumbsDown, Copy, Download,
  Maximize2
} from 'lucide-react';
import { useMeshStore } from '@/store/meshStore';

export default function ArtifactWorkspace() {
  const { artifacts, activeTab, setActiveTab, isProcessing, activeAgent } = useMeshStore();
  
  const tabs = [
    { id: 'design', label: 'Design', icon: FileText, color: 'bg-pastel-lavender' },
    { id: 'code', label: 'Logic', icon: Code2, color: 'bg-pastel-mint' },
    { id: 'security', label: 'Security', icon: ShieldAlert, color: 'bg-pastel-rose' },
    { id: 'quality', label: 'Quality', icon: CheckCircle, color: 'bg-pastel-peach' },
    { id: 'infra', label: 'Infra', icon: HardDrive, color: 'bg-pastel-sky' }
  ] as const;

  const currentTabInfo = tabs.find(t => t.id === activeTab);

  const renderContent = () => {
    const content = artifacts[activeTab as keyof typeof artifacts];
    
    if (!content && isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center py-40 h-full">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 border-[8px] border-black dark:border-white border-t-neo-accent rounded-none mb-12 shadow-brutalist"
          />
          <p className="text-lg font-black uppercase tracking-[0.5em] text-neo-muted animate-pulse font-mono">Orchestrating::{activeTab}</p>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center py-40 h-full opacity-30">
          <div className="w-24 h-24 border-[4px] border-black dark:border-white rounded-none flex items-center justify-center mb-8 shadow-brutalist">
             <Maximize2 className="w-10 h-10" />
          </div>
          <p className="text-lg font-black uppercase tracking-widest font-mono">Awaiting Protocol Buffer</p>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full bg-white dark:bg-black border-[4px] border-black dark:border-white shadow-brutalist-lg relative overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-6 border-b-[4px] border-black dark:border-white bg-black/5 dark:bg-white/5">
           <span className="text-xs font-black uppercase tracking-widest text-neo-muted font-mono">Raw Synthesis Buffer v4.2</span>
           <div className="flex gap-4">
              <div className="w-4 h-4 border-[2px] border-black dark:border-white bg-pastel-rose" />
              <div className="w-4 h-4 border-[2px] border-black dark:border-white bg-pastel-yellow" />
              <div className="w-4 h-4 border-[2px] border-black dark:border-white bg-pastel-mint" />
           </div>
        </div>
        <div className="flex-1 p-12 font-mono text-lg leading-relaxed text-neo-text whitespace-pre-wrap overflow-auto selection:bg-neo-accent selection:text-black scrollbar-hide">
           {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col glass-card rounded-none overflow-hidden shadow-glass relative h-full">
      {/* Bold Brutalist Tab Bar */}
      <div className="flex border-b-[4px] border-black/10 bg-white/30 backdrop-blur-md shrink-0 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] px-8 py-8 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-6 transition-all relative ${
              activeTab === tab.id 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'text-neo-muted hover:text-neo-text hover:bg-black/5'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="hidden xl:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="active-artifact-tab" 
                className="absolute inset-x-0 bottom-0 h-2 bg-neo-accent" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-12 overflow-y-auto relative flex flex-col min-h-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-10">
          <div className="flex items-center gap-10">
            <div className={`w-24 h-24 border-[4px] border-black dark:border-white rounded-none flex items-center justify-center shadow-brutalist transition-all duration-500 ${currentTabInfo?.color} -rotate-2`}>
              {React.createElement(currentTabInfo?.icon || FileText, { className: "w-12 h-12 text-black" })}
            </div>
            <div>
              <h4 className="text-5xl font-black text-neo-text tracking-tighter uppercase mb-2">
                {currentTabInfo?.label}
              </h4>
              <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-neo-muted uppercase tracking-[0.3em] font-mono">Protocol::Active</span>
                 <div className="w-3 h-3 bg-neo-green border-2 border-black" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 w-full lg:w-auto">
            <button className="flex-1 brutalist-button flex items-center justify-center gap-3"><Copy className="w-5 h-5" /> Copy</button>
            <button className="flex-1 brutalist-button flex items-center justify-center gap-3 bg-neo-accent text-black"><Download className="w-5 h-5" /> Export</button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {renderContent()}
        </div>
      </div>

      {/* Decision HUD */}
      <AnimatePresence>
        {isProcessing && activeAgent === 'Reviewer' && (
          <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            className="p-12 border-t-[4px] border-black dark:border-white bg-white dark:bg-black flex flex-col lg:flex-row items-center justify-between gap-12 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-pastel-yellow border-[4px] border-black dark:border-white flex items-center justify-center shadow-brutalist animate-bounce">
                  <ThumbsUp className="w-10 h-10 text-black" />
              </div>
              <div className="text-left min-w-0">
                  <span className="text-2xl font-black uppercase tracking-widest block truncate font-mono">Verification Required</span>
                  <p className="text-sm text-neo-muted font-bold mt-2 uppercase tracking-tight">Reviewer agent finalized synthesis. Awaiting manual override.</p>
              </div>
            </div>
            <div className="flex gap-8 w-full lg:w-auto">
              <button className="flex-1 brutalist-button bg-neo-green text-black px-16 py-6 text-base shadow-brutalist-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2">Authorize</button>
              <button className="flex-1 brutalist-button bg-pastel-rose text-black px-16 py-6 text-base shadow-brutalist-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2">Deny</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
