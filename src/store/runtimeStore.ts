import { create } from 'zustand';

export interface ConsoleLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
  timestamp: string;
}

interface SensorValues {
  A1: number;   // Vibration sensor (0-1023)
  A2: number;   // Temperature (mapped to 0-1023, e.g. LM35)
  D2: boolean;  // Button 1
  D3: boolean;  // Button 2
}

interface RuntimeState {
  isRunning: boolean;
  sensorValues: SensorValues;
  consoleLogs: ConsoleLog[];
  showSensorPanel: boolean;
  showConsole: boolean;

  setRunning: (running: boolean) => void;
  setSensorValue: (pin: keyof SensorValues, value: number | boolean) => void;
  addLog: (text: string, type?: ConsoleLog['type']) => void;
  clearLogs: () => void;
  toggleSensorPanel: () => void;
  toggleConsole: () => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  isRunning: false,
  sensorValues: {
    A1: 0,
    A2: 512,  // ~25°C default
    D2: false,
    D3: false,
  },
  consoleLogs: [],
  showSensorPanel: false,
  showConsole: true,

  setRunning: (running) => set({ isRunning: running }),

  setSensorValue: (pin, value) =>
    set((s) => ({
      sensorValues: { ...s.sensorValues, [pin]: value },
    })),

  addLog: (text, type = 'info') => {
    const log: ConsoleLog = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      type,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    set((s) => ({ consoleLogs: [...s.consoleLogs, log] }));
  },

  clearLogs: () => set({ consoleLogs: [] }),
  toggleSensorPanel: () => set((s) => ({ showSensorPanel: !s.showSensorPanel })),
  toggleConsole: () => set((s) => ({ showConsole: !s.showConsole })),
}));
