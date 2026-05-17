import { useRef } from 'react';
import Canvas from './Canvas';
import Toolbox from './Toolbox';
import { useSimulatorStore } from '../../../store/simulatorStore';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import '@wokwi/elements';

export default function Simulator() {
  const { isRunning, setRunning, setPin, resetOutputPins } = useSimulatorStore();
  const { generatedJsCode } = useWorkspaceStore();
  
  // Mutable ref to instantly stop the loop without waiting for React re-renders
  const runningRef = useRef(false);

  const toggleSimulation = async () => {
    if (isRunning) {
      setRunning(false);
      runningRef.current = false;
      return;
    }

    // --- Cold Boot: reset all digital output pins to LOW before starting ---
    // This mirrors Arduino behavior: every power-on starts fresh, all pins LOW.
    // Analog sensor input pins (A0, A1) and GND/5V are preserved.
    resetOutputPins();

    setRunning(true);
    runningRef.current = true;

    // Build the API for the sandboxed code
    const api = {
      digitalWrite: (pin: string, val: 'HIGH' | 'LOW') => {
        setPin(pin, val);
      },
      digitalRead: async (pin: string) => {
        const state = useSimulatorStore.getState().pins[pin];
        return state === 'HIGH' ? 'HIGH' : 'LOW';
      },
      analogRead: async (pin: string) => {
        const state = useSimulatorStore.getState().pins[pin];
        return typeof state === 'number' ? state : 0;
      },
      delay: (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    };

    try {
      // 1. Create an async function from the generated JS string
      // The generated code defines `async function setup()` and `async function loop()`
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      
      const runnerCode = `
        async function setup() {}
        async function loop() { await api.delay(100); }
        
        ${generatedJsCode}
        
        // Expose functions to the outer scope so we can call them
        return { setup, loop };
      `;
      
      const fn = new AsyncFunction('api', runnerCode);
      const { setup, loop } = await fn(api);

      // 2. Execute setup
      if (typeof setup === 'function') {
        await setup();
      }

      // 3. Execute loop indefinitely while running
      if (typeof loop === 'function') {
        while (runningRef.current) {
          await loop();
          // Small delay to prevent blocking the main thread if loop is empty
          await api.delay(10); 
        }
      }
    } catch (error) {
      console.error("Simulation error:", error);
      setRunning(false);
      runningRef.current = false;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-surface-container-lowest">
      <div className="p-sm border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
        <h2 className="font-title-md text-title-md text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary-container">bolt</span>
          Circuit Simulator
        </h2>
        <div className="flex gap-sm">
          <button 
            onClick={toggleSimulation}
            className={`px-md py-xs rounded-full font-label-lg shadow-sm tactile-btn transition-colors flex items-center gap-xs ${
              isRunning ? 'bg-error text-on-error hover:opacity-90' : 'bg-primary text-on-primary hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isRunning ? 'stop' : 'play_arrow'}
            </span>
            {isRunning ? 'Stop Simulation' : 'Run Simulation'}
          </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <Toolbox />
        <div className="flex-1 relative">
          <Canvas />
        </div>
      </div>
    </div>
  );
}
