import { useEffect, useRef } from 'react';
import { useRuntimeStore, type ConsoleLog } from '../../store/runtimeStore';

const LOG_STYLES: Record<ConsoleLog['type'], { icon: string; color: string; bg: string }> = {
  system:  { icon: 'rocket_launch', color: 'text-primary',    bg: '' },
  success: { icon: 'check_circle',  color: 'text-[#16A34A]',  bg: 'bg-[#DCFCE7]' },
  info:    { icon: 'info',          color: 'text-[#2563EB]',   bg: 'bg-[#DBEAFE]' },
  warn:    { icon: 'warning',       color: 'text-[#D97706]',   bg: 'bg-[#FEF3C7]' },
  error:   { icon: 'error',         color: 'text-[#DC2626]',   bg: 'bg-[#FEE2E2]' },
};

export default function ConsoleOutput() {
  const { consoleLogs, clearLogs, isRunning } = useRuntimeStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  return (
    <div className="h-full flex flex-col bg-surface-container-lowest">
      {/* Panel header */}
      <div className="h-9 shrink-0 flex items-center px-sm gap-xs border-b border-outline-variant bg-surface-container">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>
          terminal
        </span>
        <span className="font-label-caps text-label-caps text-on-surface-variant flex-1">
          Output
          {consoleLogs.length > 0 && (
            <span className="ml-xs px-xs py-[1px] rounded-full bg-primary text-on-primary font-label-caps text-[10px]">
              {consoleLogs.length}
            </span>
          )}
        </span>
        {/* Running indicator */}
        {isRunning && (
          <div className="flex items-center gap-xs text-[#16A34A] font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-label-sm text-label-sm">Running</span>
          </div>
        )}
        {/* Clear button */}
        {consoleLogs.length > 0 && (
          <button
            onClick={clearLogs}
            className="p-xs hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
            title="Bersihkan console"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete_sweep</span>
          </button>
        )}
      </div>

      {/* Log entries — scrollable */}
      <div className="flex-1 overflow-y-auto p-sm flex flex-col gap-[3px]">
        {consoleLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-sm text-on-surface-variant opacity-40 select-none">
            <span className="material-symbols-outlined text-4xl">terminal</span>
            <span className="font-label-sm text-label-sm text-center">
              Klik Run untuk<br />menjalankan program
            </span>
          </div>
        ) : (
          consoleLogs.map((log) => {
            const style = LOG_STYLES[log.type];
            return (
              <div
                key={log.id}
                className={`flex items-start gap-xs px-sm py-[4px] rounded-lg ${style.bg}`}
              >
                <span
                  className={`material-symbols-outlined shrink-0 mt-[2px] ${style.color}`}
                  style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}
                >
                  {style.icon}
                </span>
                <span className={`font-code-sm text-code-sm flex-1 leading-relaxed ${style.color}`}>
                  {log.text}
                </span>
                <span className="font-code-sm text-[10px] text-on-surface-variant opacity-50 shrink-0 mt-[2px]">
                  {log.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
