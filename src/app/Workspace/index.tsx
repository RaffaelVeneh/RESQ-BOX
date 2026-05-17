import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import BlockEditor from './BlockEditor';
import MissionPanel from './MissionPanel';
import SensorPanel from './SensorPanel';
import ConsoleOutput from './ConsoleOutput';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useRuntimeStore } from '../../store/runtimeStore';


export default function Workspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionParam = searchParams.get('mission');

  const { setActiveMission, resetValidation } = useMissionStore();
  const { generatedJsCode } = useWorkspaceStore();
  const {
    isRunning, setRunning,
    addLog, clearLogs,
    showSensorPanel, toggleSensorPanel,
  } = useRuntimeStore();

  const runningRef = useRef(false);

  const activeMission = missionParam
    ? MISSIONS.find((m) => m.level === parseInt(missionParam)) ?? null
    : null;

  useEffect(() => {
    if (activeMission) setActiveMission(activeMission.id);
    else setActiveMission(null);
    resetValidation();
  }, [activeMission?.id]);

  // ── Code Executor ─────────────────────────────────────────────
  const toggleSimulation = async () => {
    if (isRunning) {
      setRunning(false);
      runningRef.current = false;
      addLog('⛔ Program dihentikan.', 'warn');
      return;
    }

    clearLogs();
    setRunning(true);
    runningRef.current = true;

    // Build the runtime API
    const api = {
      print: (text: string, type: string = 'info') => {
        useRuntimeStore.getState().addLog(text, type as any);
      },
      setPin: (_pin: string, _state: string) => {
        // Pin state tracking (future use)
      },
      getPin: (pin: string) => {
        const s = useRuntimeStore.getState().sensorValues;
        return (s as any)[pin] ?? false;
      },
      getSensor: (pin: string) => {
        const s = useRuntimeStore.getState().sensorValues;
        return (s as any)[pin] ?? 0;
      },
      delay: (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
    };

    try {
      const AsyncFn = Object.getPrototypeOf(async function () {}).constructor;
      const runnerCode = `
        async function setup() { await api.print('🚀 Program dimulai', 'system'); }
        async function loop() { await api.delay(100); }
        ${generatedJsCode}
        return { setup, loop };
      `;
      const fn = new AsyncFn('api', runnerCode);
      const { setup, loop } = await fn(api);

      if (typeof setup === 'function') await setup();

      while (runningRef.current) {
        if (typeof loop === 'function') await loop();
        await api.delay(10);
      }
    } catch (err: any) {
      console.error('Runtime error:', err);
      addLog(`❌ Error: ${err?.message ?? 'Unknown error'}`, 'error');
      setRunning(false);
      runningRef.current = false;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-surface text-on-surface">
      {/* Workspace Header */}
      <header className="h-14 bg-surface-container border-b border-outline-variant flex items-center px-md justify-between shrink-0">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate('/')}
            className="p-sm hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center text-on-surface-variant"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-outline-variant" />
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary">
              {activeMission ? activeMission.title : 'Coding Lab'}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {activeMission ? `Level ${activeMission.level}` : 'Arduino Blockly Editor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          {/* Sensor Panel Toggle */}
          <button
            onClick={toggleSensorPanel}
            className={`flex items-center gap-xs px-sm py-xs rounded-full border font-label-sm text-label-sm transition-all
              ${showSensorPanel
                ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sensors</span>
            Sensor
          </button>

          {/* Run / Stop */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-xs px-md py-xs rounded-full font-label-lg shadow-sm tactile-btn transition-colors
              ${isRunning
                ? 'bg-error text-on-error hover:opacity-90'
                : 'bg-[#16A34A] text-white hover:opacity-90'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isRunning ? 'stop' : 'play_arrow'}
            </span>
            {isRunning ? 'Stop' : 'Run'}
          </button>

          {/* Wokwi link */}
          <a
            href="https://wokwi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-xs px-sm py-xs bg-surface-container-high border border-outline-variant rounded-full text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
            <span className="font-label-caps text-label-caps">Wokwi</span>
          </a>
        </div>
      </header>

      {/* Main Layout — Blockly left, Console right */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeMission && <MissionPanel missionId={activeMission.id} />}

        {/* Blockly Editor */}
        <section className="flex-1 overflow-hidden">
          <BlockEditor />
        </section>

        {/* Right: Console Output Panel */}
        <aside className="w-80 shrink-0 border-l border-outline-variant overflow-hidden">
          <ConsoleOutput />
        </aside>

        {/* Floating Sensor Panel */}
        <SensorPanel />
      </main>
    </div>
  );
}
