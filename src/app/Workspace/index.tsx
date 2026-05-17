import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import BlockEditor from './BlockEditor';
import Simulator from './Simulator';
import MissionPanel from './MissionPanel';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';

export default function Workspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionParam = searchParams.get('mission');

  const { setActiveMission, resetValidation } = useMissionStore();

  // Find mission by level number from URL param
  const activeMission = missionParam
    ? MISSIONS.find((m) => m.level === parseInt(missionParam)) ?? null
    : null;

  useEffect(() => {
    if (activeMission) {
      setActiveMission(activeMission.id);
    } else {
      setActiveMission(null);
    }
    resetValidation();
  }, [activeMission?.id]);

  return (
    <div className="h-screen w-full flex flex-col bg-surface text-on-surface">
      {/* Workspace Header */}
      <header className="h-14 bg-surface-container border-b border-outline-variant flex items-center px-md justify-between shrink-0">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate('/')}
            className="p-sm hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center text-on-surface-variant"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-outline-variant"></div>
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary">
              {activeMission ? activeMission.title : 'Proyek Baru (Draft Lokal)'}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {activeMission ? `Level ${activeMission.level}` : 'Belum disimpan'}
            </p>
          </div>
        </div>
        <div>
          <button className="px-md py-sm bg-primary hover:opacity-90 text-on-primary font-label-lg rounded-full shadow-sm tactile-btn transition-colors">
            Simpan Proyek
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Mission Panel — only visible when a mission is active */}
        {activeMission && <MissionPanel missionId={activeMission.id} />}

        {/* Left Panel: Block Editor */}
        <section className="flex-1 min-w-[300px] border-r border-outline-variant overflow-hidden">
          <BlockEditor />
        </section>

        {/* Right Panel: Simulator */}
        <section className="flex-1 min-w-[300px] bg-surface-container-lowest overflow-hidden">
          <Simulator />
        </section>
      </main>
    </div>
  );
}
