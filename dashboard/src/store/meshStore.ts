import { create } from 'zustand';

export interface Log {
  agent: string;
  action: string;
  payload: string;
  timestamp: string;
}

export interface Artifacts {
  design: string;
  code: string;
  security: string;
  infra: string;
  quality: string;
}

interface MeshState {
  logs: Log[];
  activeAgent: string;
  status: string;
  throughput: string;
  isProcessing: boolean;
  activeTab: 'design' | 'code' | 'security' | 'infra' | 'quality';
  artifacts: Artifacts;
  showGuide: boolean;
  terminalOpen: boolean;

  // Actions
  addLog: (log: Log) => void;
  setActiveAgent: (agent: string) => void;
  setStatus: (status: string) => void;
  setThroughput: (throughput: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setActiveTab: (tab: 'design' | 'code' | 'security' | 'infra' | 'quality') => void;
  updateArtifact: (key: keyof Artifacts, value: string) => void;
  resetArtifacts: () => void;
  setShowGuide: (show: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
}

export const useMeshStore = create<MeshState>((set) => ({
  logs: [],
  activeAgent: 'System',
  status: 'Initializing',
  throughput: '0.0 OPS/SEC',
  isProcessing: false,
  activeTab: 'design',
  artifacts: {
    design: '',
    code: '',
    security: '',
    infra: '',
    quality: '',
  },
  showGuide: true,
  terminalOpen: false,

  addLog: (log) => set((state) => {
    const newLogs = [log, ...state.logs].slice(0, 1000); // Keep last 1000 logs for performance
    return { logs: newLogs };
  }),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  setStatus: (status) => set({ status: status }),
  setThroughput: (throughput) => set({ throughput: throughput }),
  setIsProcessing: (isProcessing) => set({ isProcessing: isProcessing }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateArtifact: (key, value) => set((state) => ({
    artifacts: { ...state.artifacts, [key]: value }
  })),
  resetArtifacts: () => set({
    artifacts: { design: '', code: '', security: '', infra: '', quality: '' }
  }),
  setShowGuide: (show) => set({ showGuide: show }),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
}));
