import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';

// ── Confirmation Modal ──────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl p-lg max-w-[400px] w-full mx-md flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span
            className="material-symbols-outlined text-error shrink-0"
            style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{message}</p>
        <div className="flex gap-sm">
          <button
            onClick={onCancel}
            className="flex-1 py-sm px-md bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-sm px-md bg-error text-on-error font-label-caps text-label-caps rounded-lg tactile-btn hover:opacity-90"
          >
            YA, ULANGI
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Project Name Modal ──────────────────────────────────────
function NewProjectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl p-lg max-w-[400px] w-full mx-md flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary-container shrink-0" style={{ fontSize: '28px' }}>
            add_circle
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">Buat Proyek Baru</h3>
        </div>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onConfirm(name.trim())}
          placeholder="Nama proyek..."
          className="w-full px-md py-sm rounded-lg border-2 border-outline-variant bg-surface-container focus:border-primary outline-none font-body-base text-on-surface"
        />
        <div className="flex gap-sm">
          <button
            onClick={onCancel}
            className="flex-1 py-sm px-md bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => name.trim() && onConfirm(name.trim())}
            className="flex-1 py-sm px-md bg-primary text-on-primary font-label-caps text-label-caps rounded-lg tactile-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            BUAT
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────
function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

// ── Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { completedMissionIds, isUnlocked } = useMissionStore();
  const { projects, createProject, deleteProject, drafts, clearDraft } = useWorkspaceStore();

  const [confirmReplay, setConfirmReplay] = useState<string | null>(null); // missionId
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null); // projectId
  const [showNewProject, setShowNewProject] = useState(false);

  const getMissionStatus = (missionId: string) => {
    if (completedMissionIds.includes(missionId)) return 'completed';
    if (isUnlocked(missionId)) return 'active';
    return 'locked';
  };

  const hasMissionDraft = (missionId: string) => {
    return !!(drafts[missionId]?.workspaceJson);
  };

  const handleMissionClick = (mission: typeof MISSIONS[0], status: string) => {
    if (status === 'completed') {
      // Show replay confirm
      setConfirmReplay(mission.id);
    } else {
      // Start or continue
      navigate(`/workspace?mission=${mission.level}`);
    }
  };

  const handleConfirmReplay = (missionId: string) => {
    clearDraft(missionId);
    const m = MISSIONS.find((x) => x.id === missionId)!;
    setConfirmReplay(null);
    navigate(`/workspace?mission=${m.level}`);
  };

  const handleCreateProject = (name: string) => {
    const project = createProject(name);
    setShowNewProject(false);
    navigate(`/workspace?project=${project.id}`);
  };

  return (
    <div className="bg-surface mission-canvas min-h-screen text-on-surface font-body-base">

      {/* Modals */}
      {confirmReplay && (
        <ConfirmModal
          title="Ulangi Misi?"
          message="Progress kamu di misi ini akan dihapus dan mulai dari awal. Apakah kamu yakin?"
          onConfirm={() => handleConfirmReplay(confirmReplay)}
          onCancel={() => setConfirmReplay(null)}
        />
      )}
      {confirmDeleteProject && (
        <ConfirmModal
          title="Hapus Proyek?"
          message="Proyek dan semua blok di dalamnya akan terhapus permanen. Tidak bisa dibatalkan!"
          onConfirm={() => {
            deleteProject(confirmDeleteProject);
            setConfirmDeleteProject(null);
          }}
          onCancel={() => setConfirmDeleteProject(null)}
        />
      )}
      {showNewProject && (
        <NewProjectModal
          onConfirm={handleCreateProject}
          onCancel={() => setShowNewProject(false)}
        />
      )}

      {/* TopAppBar */}
      <header className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows flex justify-between items-center w-full px-margin-desktop h-16 sticky z-40">
        <div className="flex items-center gap-sm">
          <img alt="RESQ-BOX Logo" className="h-8 w-8 rounded-md object-contain" src="/logo.png" />
          <span className="font-display-lg text-headline-lg font-black tracking-tight text-secondary dark:text-secondary-fixed">RESQ-BOX</span>
        </div>
        <div className="flex items-center gap-md">
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

      {/* Progress Bar */}
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
                className={`flex-1 transition-all ${completedMissionIds.includes(m.id) ? 'bg-[#16A34A]' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">

        {/* Left: My Projects */}
        <section className="md:col-span-8 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">My Projects</h2>
            <button
              onClick={() => setShowNewProject(true)}
              className="font-label-caps text-label-caps text-secondary-container hover:underline flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-label-caps">add</span>
              NEW PROJECT
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {/* Existing Projects */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-surface-container-lowest tactile-card rounded-lg p-md flex flex-col justify-between h-48 shadow-[0_4px_0_0_#E2E8F0] relative group"
              >
                {/* Delete button (hover) */}
                <button
                  onClick={() => setConfirmDeleteProject(project.id)}
                  className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-xs rounded"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>

                <div>
                  <div className="flex justify-between items-start mb-sm">
                    <div className="bg-[#fd761a1a] text-secondary-container p-xs rounded">
                      <span className="material-symbols-outlined">sensors</span>
                    </div>
                    {drafts[project.id]?.workspaceJson && (
                      <span className="text-[10px] font-label-caps text-label-caps bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-xs py-[2px] rounded-full">
                        DRAFT TERSIMPAN
                      </span>
                    )}
                  </div>
                  <h3 className="font-title-md text-title-md text-primary mb-xs">{project.name}</h3>
                  <p className="font-code-sm text-code-sm text-on-surface-variant">
                    Diperbarui {formatRelative(project.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/workspace?project=${project.id}`)}
                  className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded tactile-btn w-full flex justify-center items-center gap-xs mt-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                  LANJUTKAN
                </button>
              </div>
            ))}

            {/* Empty State / Add New */}
            <button
              onClick={() => setShowNewProject(true)}
              className="bg-surface-container border-2 border-dashed border-outline-variant rounded-lg p-md flex flex-col items-center justify-center h-48 gap-sm hover:border-primary hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-4xl">add_circle</span>
              <span className="font-label-caps text-label-caps">Buat Proyek Baru</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="mt-md">
            <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs mb-md">
              <h2 className="font-headline-lg text-headline-lg text-primary">Mode Belajar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              <button
                onClick={() => setShowNewProject(true)}
                className="relative flex flex-col items-start text-left p-md rounded-2xl bg-[#FFF7ED] border-2 border-[#F97316] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-[#EA580C] text-3xl">code</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-[#9A3412] uppercase">Arduino Blockly</div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">Coding Lab</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md leading-relaxed">
                  Buat program Arduino dengan blok visual. Export ke Wokwi untuk simulasi sirkuit.
                </p>
                <div className="flex items-center gap-xs text-[#EA580C] font-label-sm text-label-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  Buka Editor
                </div>
              </button>

              <button
                onClick={() => navigate('/mitigation')}
                className="relative flex flex-col items-start text-left p-md rounded-2xl bg-[#F0FDF4] border-2 border-[#16A34A] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="absolute top-sm right-sm px-xs py-[2px] rounded-full bg-[#16A34A] text-white font-label-caps text-label-caps">
                  Baru!
                </div>
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-[#15803D] text-3xl">emergency</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-[#14532D] uppercase">Puzzle Interaktif</div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">Mitigasi Bencana</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md leading-relaxed">
                  Susun urutan tindakan penyelamatan yang benar. Gempa, banjir, kebakaran & tsunami!
                </p>
                <div className="flex items-center gap-xs text-[#15803D] font-label-sm text-label-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>drag_indicator</span>
                  5 skenario tersedia
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Right: Mission Center */}
        <aside className="md:col-span-4 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">Mission Center</h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant">SEASON 1</span>
          </div>

          <div className="flex flex-col gap-sm">
            {MISSIONS.map((mission) => {
              const status = getMissionStatus(mission.id);
              const hasDraft = hasMissionDraft(mission.id);

              if (status === 'completed') {
                return (
                  <div key={mission.id} className="bg-surface-container-lowest tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-[#16A34A]">
                    <div className="h-12 w-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-caps text-label-caps text-on-surface-variant">LEVEL {mission.level} • SELESAI</p>
                      <h4 className="font-title-md text-title-md text-primary">{mission.title}</h4>
                    </div>
                    <button
                      onClick={() => hasDraft ? navigate(`/workspace?mission=${mission.level}`) : setConfirmReplay(mission.id)}
                      className="bg-surface-container-high text-on-surface font-label-caps text-label-caps py-xs px-sm rounded tactile-btn shrink-0 border border-outline-variant"
                    >
                      {hasDraft ? 'LANJUTKAN' : 'ULANGI'}
                    </button>
                  </div>
                );
              }

              if (status === 'active') {
                return (
                  <div key={mission.id} className="bg-surface-container-lowest tactile-card rounded-lg p-sm border-l-4 border-l-secondary-container shadow-[0_4px_0_0_#E2E8F0]">
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
                      onClick={() => handleMissionClick(mission, status)}
                      className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded w-full tactile-btn flex justify-center items-center gap-xs"
                    >
                      {hasDraft ? (
                        <>
                          LANJUTKAN
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </>
                      ) : (
                        <>
                          MULAI MISI
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              }

              // Locked
              return (
                <div key={mission.id} className="bg-surface-variant opacity-60 tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-outline cursor-not-allowed">
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
