import { useNavigate } from 'react-router-dom';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useSimulatorStore } from '../../store/simulatorStore';
import { validateMission } from '../../missions/engine/validationEngine';

export default function MissionPanel({ missionId }: { missionId: string }) {
  const navigate = useNavigate();
  const mission = MISSIONS.find((m) => m.id === missionId);

  const { completeMission, setValidationResult, validationStatus, validationMessage } =
    useMissionStore();
  const { nodes, edges, pins } = useSimulatorStore();

  if (!mission) {
    return (
      <div className="w-72 bg-surface-container border-r border-outline-variant flex items-center justify-center text-on-surface-variant p-md">
        <p className="font-body-sm text-body-sm">Misi tidak ditemukan.</p>
      </div>
    );
  }

  const handleValidate = () => {
    setValidationResult('checking', '');

    // Small delay so UI feels responsive
    setTimeout(() => {
      const result = validateMission(mission, nodes, edges, pins);

      if (result.passed) {
        completeMission(mission.id);
        setValidationResult('pass', 'Misi selesai! Rangkaian kamu benar! 🎉');
      } else {
        setValidationResult('fail', result.failureReason ?? 'Terjadi kesalahan yang tidak diketahui.');
      }
    }, 600);
  };

  const handleFinish = () => {
    navigate('/');
  };

  const isChecking = validationStatus === 'checking';
  const isPassed = validationStatus === 'pass';
  const isFailed = validationStatus === 'fail';

  return (
    <div className="w-72 bg-surface-container border-r border-outline-variant flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="p-sm border-b border-outline-variant" style={{ background: 'rgba(253,118,26,0.08)' }}>
        <div className="flex items-center gap-xs mb-1">
          <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: '18px' }}>
            {mission.icon}
          </span>
          <span className="font-label-caps text-label-caps text-secondary-container">
            LEVEL {mission.level}
          </span>
        </div>
        <h2 className="font-title-md text-title-md text-primary leading-tight">{mission.title}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-sm flex flex-col gap-sm">
        {/* Scenario */}
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SKENARIO</p>
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            {mission.scenario}
          </p>
        </div>

        {/* Objective */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-sm">
          <p className="font-label-caps text-label-caps text-primary mb-1 flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>target</span>
            OBJECTIVE
          </p>
          <p className="font-body-sm text-body-sm text-on-surface">{mission.objective}</p>
        </div>

        {/* Checklist */}
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-sm">KOMPONEN WAJIB</p>
          <div className="flex flex-col gap-xs">
            {mission.validation.requiredComponents.map((comp) => {
              const labels: Record<string, { label: string; icon: string }> = {
                arduino: { label: 'Arduino Uno', icon: 'developer_board' },
                led: { label: 'LED', icon: 'lightbulb' },
                buzzer: { label: 'Buzzer', icon: 'volume_up' },
                button: { label: 'Pushbutton', icon: 'radio_button_checked' },
                analogSensor: { label: 'Sensor Analog', icon: 'sensors' },
              };
              const exists = nodes.some((n) => n.type === comp);
              const info = labels[comp] ?? { label: comp, icon: 'circle' };

              return (
                <div
                  key={comp}
                  className={`flex items-center gap-xs p-xs rounded transition-colors ${
                    exists
                      ? 'bg-[#16a34a1a] text-[#16A34A]'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '16px', fontVariationSettings: exists ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {exists ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {info.icon}
                  </span>
                  <span className="font-label-md text-label-md">{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <details className="bg-surface-container-lowest border border-outline-variant rounded p-sm cursor-pointer">
          <summary className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs list-none">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              lightbulb
            </span>
            PETUNJUK
          </summary>
          <p className="font-body-sm text-body-sm text-on-surface mt-sm leading-relaxed">
            {mission.hint}
          </p>
        </details>

        {/* Validation Result */}
        {(isPassed || isFailed) && (
          <div
            className={`rounded p-sm border flex items-start gap-xs ${
              isPassed
                ? 'border-[#16A34A] text-[#16A34A]'
                : 'border-error text-error'
            }`}
            style={{ background: isPassed ? 'rgba(22,163,74,0.08)' : 'rgba(186,26,26,0.08)' }}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              {isPassed ? 'check_circle' : 'error'}
            </span>
            <p className="font-body-sm text-body-sm leading-relaxed">{validationMessage}</p>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="p-sm border-t border-outline-variant flex flex-col gap-xs">
        {isPassed ? (
          <button
            onClick={handleFinish}
            className="w-full py-sm px-md bg-[#16A34A] text-white font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
            KEMBALI KE DASHBOARD
          </button>
        ) : (
          <button
            onClick={handleValidate}
            disabled={isChecking}
            className={`w-full py-sm px-md font-label-caps text-label-caps rounded tactile-btn flex items-center justify-center gap-xs transition-colors ${
              isChecking
                ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                : 'bg-primary text-on-primary hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {isChecking ? 'hourglass_empty' : 'verified'}
            </span>
            {isChecking ? 'MENGECEK...' : 'VALIDASI MISI'}
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full py-xs px-md text-on-surface-variant font-label-caps text-label-caps hover:text-on-surface flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            arrow_back
          </span>
          Kembali
        </button>
      </div>
    </div>
  );
}
