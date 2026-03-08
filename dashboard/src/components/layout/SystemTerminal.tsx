'use client';

import React, { useRef, useEffect, memo } from 'react';
import { Terminal, Activity, ChevronDown, Trash2 } from 'lucide-react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useMeshStore, Log } from '@/store/meshStore';

const LogRow = memo(({ log }: { log: Log }) => {
  if (!log) return null;

  return (
    <div className="flex items-center px-16 py-4 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border-b-[2px] border-black/10 font-mono">
      <span className="text-neo-muted font-black text-[10px] min-w-[120px] uppercase">[{log.timestamp}]</span>
      <div className="flex items-center gap-4 min-w-[180px]">
        <span className="font-black uppercase tracking-tighter text-sm">{log.agent}</span>
      </div>
      <span className="text-neo-accent font-black uppercase tracking-widest text-[10px] min-w-[200px]">::{log.action}</span>
      <span className="font-bold text-base flex-1 truncate">{log.payload}</span>
    </div>
  );
});

LogRow.displayName = 'LogRow';

export default function SystemTerminal() {
  const { logs, setTerminalOpen } = useMeshStore();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0 });
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-16 py-8 border-b-[4px] border-black dark:border-white shrink-0 bg-neo-accent">
        <div className="flex items-center gap-6">
           <Terminal className="w-8 h-8 text-black" />
           <h3 className="text-lg font-black uppercase tracking-[0.4em] text-black">Mesh Telemetry Stream</h3>
        </div>
        
        <div className="flex items-center gap-8">
           <button className="text-black/60 hover:text-black transition-colors">
             <Trash2 className="w-6 h-6" />
           </button>
           <button 
             onClick={() => setTerminalOpen(false)}
             className="w-12 h-12 border-[4px] border-black bg-white flex items-center justify-center hover:bg-pastel-rose transition-all shadow-brutalist active:shadow-none active:translate-x-1 active:translate-y-1"
           >
             <ChevronDown className="w-8 h-8 text-black" />
           </button>
        </div>
      </div>

      {/* Virtualized Log Container */}
      <div className="flex-1 relative min-h-0 overflow-hidden bg-black/5 dark:bg-white/5">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
             <Activity className="w-16 h-16 mb-6 animate-pulse" />
             <p className="text-sm font-black uppercase tracking-[0.5em] text-center px-16 font-mono">Awaiting Synchronization Signals...</p>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={logs}
            className="scrollbar-hide"
            itemContent={(index, log) => <LogRow log={log} />}
            style={{ height: '100%' }}
          />
        )}
      </div>
    </div>
  );
}
