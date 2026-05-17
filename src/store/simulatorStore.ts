import { create } from 'zustand';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from '@xyflow/react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type SimulatorNode = Node;

interface SimulatorState {
  nodes: SimulatorNode[];
  edges: Edge[];
  pins: Record<string, any>;
  isRunning: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: SimulatorNode) => void;
  clearSimulator: () => void;
  setPin: (pinId: string, state: any) => void;
  setRunning: (running: boolean) => void;
  resetOutputPins: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  nodes: [],
  edges: [],
  pins: {
    'GND': 'LOW',
    '5V': 'HIGH',
  },
  isRunning: false,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: SimulatorNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  clearSimulator: () => {
    set({ nodes: [], edges: [], isRunning: false });
  },
  setPin: (pinId: string, state: any) => {
    set((stateObj) => ({
      pins: {
        ...stateObj.pins,
        [pinId]: state,
      },
    }));
  },
  // Reset all output (non-input) pins to LOW — called when simulation starts
  // This mimics Arduino cold boot: all digital output pins start at LOW
  // Input sensor pins are NOT reset here; they keep their slider values
  resetOutputPins: () => {
    set((stateObj) => {
      const fresh: Record<string, any> = {};
      // Preserve GND and 5V power rails
      for (const [key, val] of Object.entries(stateObj.pins)) {
        if (key.startsWith('GND') || key === '5V') {
          fresh[key] = val;
        }
        // Analog sensor pins (A0, A1, etc.) are inputs — preserve them too
        if (key.startsWith('A')) {
          fresh[key] = val;
        }
      }
      return { pins: fresh };
    });
  },
  setRunning: (running: boolean) => {
    set({ isRunning: running });
  },
}));
