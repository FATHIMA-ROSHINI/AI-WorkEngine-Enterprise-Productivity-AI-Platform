'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Box, Cloud, Lock, Plus, ArrowRight } from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ArtifactWorkspace from '@/components/artifact/ArtifactWorkspace';
import SystemTerminal from '@/components/layout/SystemTerminal';
import CommandBar from '@/components/layout/CommandBar';
import MeshBrain from '@/components/visuals/MeshBrain';
import { useMeshStore } from '@/store/meshStore';

export default function WorkEngineDashboard() {
  const { 
    addLog, 
    setActiveAgent, 
    setStatus, 
    setThroughput, 
    setIsProcessing, 
    setActiveTab, 
    updateArtifact,
    resetArtifacts,
    showGuide,
    setShowGuide,
    setTerminalOpen,
    isProcessing,
    activeAgent,
    terminalOpen
  } = useMeshStore();

  const [userInput, setUserInput] = useState('');

  const handleSendPrompt = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const promptValue = customPrompt || userInput;
    if (!promptValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setShowGuide(false);
    setTerminalOpen(true);
    resetArtifacts();
    setActiveTab('design');

    const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'nova-default-secure-key';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    try {
      const res = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({
          task_id: `task-${Math.random().toString(36).substr(2, 9)}`,
          sender: "User",
          recipient: "Architect",
          payload: { query: promptValue, priority: "high" }
        })
      });
      if (!res.ok) throw new Error(`API Failure: ${res.status}`);
      setUserInput('');
    } catch (err) {
      console.error('Task Error:', err);
      addLog({
        agent: 'System',
        action: 'API_ERROR',
        payload: 'Failed to contact mesh orchestrator.',
        timestamp: new Date().toLocaleTimeString()
      });
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws/stream';
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'nova-default-secure-key';
    let ws: WebSocket;

    const connect = () => {
      ws = new WebSocket(`${wsUrl}?token=${apiKey}`);
      ws.onopen = () => setStatus('Online');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog({ ...data, timestamp: new Date().toLocaleTimeString() });
          setActiveAgent(data.agent);
          setThroughput(`${(Math.random() * 5 + 10).toFixed(1)} OPS/SEC`);

          if (data.action === 'DESIGN_GENERATED') {
            updateArtifact('design', data.payload);
            setActiveTab('design');
          }
          if (data.action === 'CODE_READY') {
            updateArtifact('code', data.payload);
            setActiveTab('code');
          }
          if (data.action === 'VERIFICATION_COMPLETE') {
            updateArtifact('quality', data.payload);
            setActiveTab('quality');
          }
          if (data.action === 'INFRA_READY') {
            updateArtifact('infra', data.payload);
            setActiveTab('infra');
          }
          if (data.action === 'WORKFLOW_COMPLETE') {
            setIsProcessing(false);
          }
          if (data.action === 'APPROVED' && data.agent === 'Security') {
            updateArtifact('security', data.payload);
          }
        } catch (err) { console.error('Mesh stream error:', err); }
      };
      ws.onclose = () => {
        setStatus('Offline');
        setTimeout(connect, 3000);
      };
    };
    connect();
    return () => ws?.close();
  }, [addLog, resetArtifacts, setActiveAgent, setActiveTab, setIsProcessing, setShowGuide, setStatus, setTerminalOpen, setThroughput, updateArtifact]);

  return (
    <div className="h-screen bg-neo-bg text-neo-text font-sans antialiased selection:bg-neo-accent/30 flex overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="pastel-blob w-96 h-96 bg-pastel-lavender top-[-10%] left-[-10%]" />
        <div className="pastel-blob w-96 h-96 bg-pastel-mint top-[-10%] right-[-10%] animation-delay-2000" />
        <div className="pastel-blob w-96 h-96 bg-pastel-peach bottom-[-10%] left-[20%] animation-delay-4000" />
        <div className="pastel-blob w-96 h-96 bg-pastel-rose bottom-[20%] right-[-10%]" />
      </div>
      
      <MeshBrain />

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header />

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8 overflow-hidden min-h-0 relative">
            <div className="flex-1 flex flex-col gap-8 min-h-0 relative z-10">
              <AnimatePresence mode="wait">
                {showGuide ? (
                  <motion.div 
                    key="guide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-12 glass-card rounded-soft relative overflow-hidden group shadow-glass"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 bg-neo-accent/10 rounded-[40px] flex items-center justify-center mb-10 border-4 border-neo-accent/20"
                    >
                       <Plus className="w-12 h-12 text-neo-accent" />
                    </motion.div>
                    
                    <h2 className="text-5xl font-black tracking-tight mb-6">NOVA <span className="text-neo-accent">MESH</span></h2>
                    <p className="text-neo-muted max-w-lg text-lg leading-relaxed mb-12 font-medium">
                      Minimalist agent orchestration. Clean logic, playful execution.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                       {[
                         { label: "Build Payment System", icon: Lock, color: 'bg-pastel-lavender' },
                         { label: "Scale Architecture", icon: Box, color: 'bg-pastel-mint' },
                         { label: "Security Audit", icon: ShieldCheck, color: 'bg-pastel-rose' },
                         { label: "Cloud Deployment", icon: Cloud, color: 'bg-pastel-sky' }
                       ].map((hint, i) => (
                         <button 
                            key={i}
                            onClick={() => handleSendPrompt(undefined, hint.label)}
                            className={`p-6 ${hint.color} border-2 border-black dark:border-white shadow-brutalist hover:shadow-brutalist-lg hover:-translate-x-1 hover:-translate-y-1 transition-all flex items-center justify-between group`}
                         >
                            <div className="flex items-center gap-4 text-black">
                               <hint.icon className="w-6 h-6" />
                               <span className="text-sm font-black uppercase tracking-widest">{hint.label}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                         </button>
                       ))}
                    </div>
                  </motion.div>
                ) : (
                  <ArtifactWorkspace key="workspace" />
                )}
              </AnimatePresence>

              <CommandBar 
                userInput={userInput}
                setUserInput={setUserInput}
                handleSendPrompt={handleSendPrompt}
              />
            </div>
          </main>

          <AnimatePresence>
            {terminalOpen && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 300 }}
                exit={{ height: 0 }}
                className="relative z-20 shrink-0 overflow-hidden glass-card border-t-2 border-black dark:border-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
              >
                <SystemTerminal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="h-12 bg-white/30 dark:bg-black/30 backdrop-blur-md border-t border-black/5 px-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-neo-muted z-20 shrink-0">
          <div className="flex items-center gap-8">
             <p>NOVA WORKENGINE © 2026</p>
             <div className="hidden md:flex gap-8 border-l border-black/10 dark:border-white/10 pl-8">
                <p>ATOMIC STATE</p>
                <p>MINIMALIST PROTOCOL</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-neo-green" />
             <span>MESH ACTIVE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
