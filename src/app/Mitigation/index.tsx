import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MITIGATION_SCENARIOS, type MitigationScenario } from '../../mitigation/data/scenarios';
import PuzzleBoard from './PuzzleBoard';

const DISASTER_LABELS: Record<string, string> = {
  gempa: 'Gempa Bumi',
  banjir: 'Banjir',
  kebakaran: 'Kebakaran',
  tsunami: 'Tsunami',
  evakuasi: 'Evakuasi',
};

const DISASTER_COLORS: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  gempa:    { bg: 'bg-[#FEF3C7]', border: 'border-[#F59E0B]', icon: 'text-[#B45309]', badge: 'bg-[#F59E0B]' },
  banjir:   { bg: 'bg-[#DBEAFE]', border: 'border-[#3B82F6]', icon: 'text-[#1D4ED8]', badge: 'bg-[#3B82F6]' },
  kebakaran:{ bg: 'bg-[#FEE2E2]', border: 'border-[#EF4444]', icon: 'text-[#B91C1C]', badge: 'bg-[#EF4444]' },
  tsunami:  { bg: 'bg-[#EDE9FE]', border: 'border-[#8B5CF6]', icon: 'text-[#6D28D9]', badge: 'bg-[#8B5CF6]' },
  evakuasi: { bg: 'bg-[#DCFCE7]', border: 'border-[#16A34A]', icon: 'text-[#15803D]', badge: 'bg-[#16A34A]' },
};

function ScenarioCard({
  scenario,
  onSelect,
}: {
  scenario: MitigationScenario;
  onSelect: (s: MitigationScenario) => void;
}) {
  const colors = DISASTER_COLORS[scenario.disaster];

  return (
    <button
      onClick={() => onSelect(scenario)}
      className={`
        relative flex flex-col items-start text-left p-md rounded-2xl border-2 shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer
        ${colors.bg} ${colors.border}
      `}
    >
      {/* Level badge */}
      <div className={`absolute top-sm right-sm px-xs py-[2px] rounded-full text-white font-label-caps text-label-caps ${colors.badge}`}>
        Level {scenario.level}
      </div>

      {/* Icon + type */}
      <div className="flex items-center gap-sm mb-sm">
        <span className={`material-symbols-outlined text-4xl ${colors.icon}`}>
          {scenario.icon}
        </span>
        <div>
          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            {DISASTER_LABELS[scenario.disaster]}
          </div>
          <h3 className="font-title-md text-title-md font-bold text-on-surface leading-tight">
            {scenario.title}
          </h3>
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-md">
        {scenario.subtitle}
      </p>

      <div className="flex items-center gap-xs text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>drag_indicator</span>
        <span className="font-label-sm text-label-sm">
          {scenario.correctOrder.length} tindakan untuk disusun
        </span>
      </div>
    </button>
  );
}

export default function Mitigation() {
  const navigate = useNavigate();
  const [activeScenario, setActiveScenario] = useState<MitigationScenario | null>(null);

  if (activeScenario) {
    return (
      <div className="h-screen w-full flex flex-col bg-surface text-on-surface overflow-hidden">
        <PuzzleBoard scenario={activeScenario} onBack={() => setActiveScenario(null)} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-surface text-on-surface overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-surface-container border-b border-outline-variant flex items-center px-md justify-between shrink-0">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate('/')}
            className="p-sm hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </button>
          <div className="h-6 w-px bg-outline-variant" />
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary">Mode Mitigasi Bencana</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Susun urutan tindakan yang benar saat bencana terjadi
            </p>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex items-center gap-xs px-md py-xs bg-surface-container-high rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>emergency</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {MITIGATION_SCENARIOS.length} skenario tersedia
          </span>
        </div>
      </header>

      {/* Hero banner */}
      <div className="shrink-0 bg-gradient-to-r from-primary to-secondary px-lg py-md flex items-center gap-lg">
        <div className="flex-1">
          <h2 className="font-display-sm text-display-sm font-bold text-on-primary mb-xs">
            Siap Hadapi Bencana?
          </h2>
          <p className="font-body-md text-body-md text-on-primary opacity-90">
            Pilih skenario bencana dan susun langkah-langkah penyelamatan yang benar.
            Setiap keputusan penting! Ada blok jebakan yang harus kamu hindari.
          </p>
        </div>
        <div className="text-6xl select-none">🦺</div>
      </div>

      {/* Scenario grid */}
      <div className="flex-1 overflow-y-auto p-lg">
        <div className="max-w-4xl mx-auto">
          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-md flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>grid_view</span>
            Pilih Skenario
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {MITIGATION_SCENARIOS.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onSelect={setActiveScenario}
              />
            ))}
          </div>

          {/* Info footer */}
          <div className="mt-xl p-md rounded-2xl bg-surface-container-low border border-outline-variant flex items-start gap-sm">
            <span className="material-symbols-outlined text-primary shrink-0">info</span>
            <div>
              <div className="font-label-lg font-semibold text-on-surface mb-xs">Cara Bermain</div>
              <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-xs">
                <li>1. Pilih skenario bencana yang ingin kamu pelajari</li>
                <li>2. Baca situasinya dengan teliti</li>
                <li>3. <strong>Seret blok tindakan</strong> ke slot urutan yang benar</li>
                <li>4. Hati-hati dengan <strong>blok jebakan</strong> yang salah!</li>
                <li>5. Klik "Cek Jawaban" untuk lihat hasilnya</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
