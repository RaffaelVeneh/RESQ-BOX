import { useNavigate } from 'react-router-dom';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { completedMissionIds, isUnlocked } = useMissionStore();

  const getMissionStatus = (missionId: string) => {
    if (completedMissionIds.includes(missionId)) return 'completed';
    if (isUnlocked(missionId)) return 'active';
    return 'locked';
  };

  return (
    <div className="bg-surface mission-canvas min-h-screen text-on-surface font-body-base">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows flex justify-between items-center w-full px-margin-desktop h-16 sticky z-50">
        <div className="flex items-center gap-sm">
          <img alt="RESQ-BOX Logo" className="h-8 w-8 rounded-md object-contain" src="/logo.png" />
          <span className="font-display-lg text-headline-lg font-black tracking-tight text-secondary dark:text-secondary-fixed">RESQ-BOX</span>
        </div>
        <div className="flex items-center gap-md">
          {/* Offline Ready Badge */}
          <div className="flex items-center gap-xs px-sm py-xs bg-[#16A34A] text-white rounded-full">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>cloud_done</span>
            <span className="font-label-caps text-label-caps">Offline Ready</span>
          </div>
          <div className="flex items-center gap-sm text-primary dark:text-primary-fixed">
            <button className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors p-xs rounded-full flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined">wifi_tethering</span>
            </button>
            <button className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors p-xs rounded-full flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="bg-secondary-container bg-opacity-10 border-b border-outline-variant py-sm px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            <span className="font-title-md text-title-md text-primary">
              Progress: {completedMissionIds.length} / {MISSIONS.length} Misi Selesai
            </span>
          </div>
          <div className="flex gap-xs h-2 w-64 rounded-full overflow-hidden bg-surface-variant">
            {MISSIONS.map((m) => (
              <div
                key={m.id}
                className={`flex-1 transition-all ${
                  completedMissionIds.includes(m.id) ? 'bg-[#16A34A]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Side: My Projects */}
        <section className="md:col-span-8 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">My Projects</h2>
            <button
              onClick={() => navigate('/workspace')}
              className="font-label-caps text-label-caps text-secondary-container hover:underline flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-label-caps">add</span>
              NEW PROJECT
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {/* Project Card 1 */}
            <div className="bg-surface-container-lowest tactile-card rounded-lg p-md flex flex-col justify-between h-48 hover:bg-surface-container-lowest transition-colors shadow-[0_4px_0_0_#E2E8F0]">
              <div>
                <div className="flex justify-between items-start mb-sm">
                  <div className="bg-[#fd761a1a] text-secondary-container p-xs rounded">
                    <span className="material-symbols-outlined">sensors</span>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <h3 className="font-title-md text-title-md text-primary mb-xs">Project Alarm Gempa</h3>
                <p className="font-code-sm text-code-sm text-on-surface-variant">Last edited: 2 hours ago</p>
              </div>
              <button
                onClick={() => navigate('/workspace')}
                className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded tactile-btn w-full flex justify-center items-center gap-xs mt-sm"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                EDIT PROJECT
              </button>
            </div>

            {/* Empty State Card */}
            <button
              onClick={() => navigate('/workspace')}
              className="bg-surface-container border-2 border-dashed border-outline-variant rounded-lg p-md flex flex-col items-center justify-center h-48 gap-sm hover:border-primary hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-4xl">add_circle</span>
              <span className="font-label-caps text-label-caps">Buat Proyek Baru</span>
            </button>
          </div>
        </section>

        {/* Right Side: Mission Center */}
        <aside className="md:col-span-4 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">Mission Center</h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant">SEASON 1</span>
          </div>

          <div className="flex flex-col gap-sm">
            {MISSIONS.map((mission) => {
              const status = getMissionStatus(mission.id);

              if (status === 'completed') {
                return (
                  <div
                    key={mission.id}
                    className="bg-surface-container-lowest tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-[#16A34A]"
                  >
                    <div className="h-12 w-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-caps text-label-caps text-on-surface-variant">LEVEL {mission.level} • SELESAI</p>
                      <h4 className="font-title-md text-title-md text-primary">{mission.title}</h4>
                    </div>
                    <button
                      onClick={() => navigate(`/workspace?mission=${mission.level}`)}
                      className="bg-surface-container-high text-on-surface font-label-caps text-label-caps py-xs px-sm rounded tactile-btn shrink-0 border border-outline-variant"
                    >
                      ULANG
                    </button>
                  </div>
                );
              }

              if (status === 'active') {
                return (
                  <div
                    key={mission.id}
                    className="bg-surface-container-lowest tactile-card rounded-lg p-sm border-l-4 border-l-secondary-container shadow-[0_4px_0_0_#E2E8F0]"
                  >
                    <div className="flex items-center gap-sm mb-sm">
                      <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{mission.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-label-caps text-label-caps text-secondary-container">LEVEL {mission.level} • AKTIF</p>
                        <h4 className="font-title-md text-title-md text-primary">{mission.title}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/workspace?mission=${mission.level}`)}
                      className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded w-full tactile-btn flex justify-center items-center gap-xs"
                    >
                      MULAI MISI
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                    </button>
                  </div>
                );
              }

              // Locked
              return (
                <div
                  key={mission.id}
                  className="bg-surface-variant opacity-60 tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-outline cursor-not-allowed"
                >
                  <div className="h-12 w-12 rounded-full bg-surface-dim flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-label-caps text-label-caps text-outline">LEVEL {mission.level} • TERKUNCI</p>
                    <h4 className="font-title-md text-title-md text-on-surface-variant">{mission.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}
