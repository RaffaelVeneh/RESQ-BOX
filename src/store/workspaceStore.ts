import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  workspaceJson: object | null;
  generatedCode: string;
}

interface WorkspaceState {
  // Active context: either a project id or a mission id ('mission_01', etc.)
  activeContextId: string | null;

  // Per-context storage key → { workspaceJson, generatedCode, generatedJsCode }
  drafts: Record<string, { workspaceJson: object | null; generatedCode: string; generatedJsCode: string }>;

  // Project list
  projects: Project[];

  // Derived getters (convenience)
  getActiveDraft: () => { workspaceJson: object | null; generatedCode: string; generatedJsCode: string } | null;

  // Actions
  setActiveContext: (id: string | null) => void;
  saveDraft: (contextId: string, json: object | null, code: string, jsCode: string) => void;
  clearDraft: (contextId: string) => void;

  // Project management
  createProject: (name: string) => Project;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  updateProjectCode: (id: string, code: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeContextId: null,
      drafts: {},
      projects: [],

      getActiveDraft: () => {
        const { activeContextId, drafts } = get();
        if (!activeContextId) return null;
        return drafts[activeContextId] ?? null;
      },

      setActiveContext: (id) => set({ activeContextId: id }),

      saveDraft: (contextId, json, code, jsCode) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [contextId]: { workspaceJson: json, generatedCode: code, generatedJsCode: jsCode },
          },
          // Also sync generatedCode into project record if the context is a project
          projects: state.projects.map((p) =>
            p.id === contextId
              ? { ...p, generatedCode: code, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      clearDraft: (contextId) =>
        set((state) => {
          const { [contextId]: _removed, ...rest } = state.drafts;
          return { drafts: rest };
        }),

      createProject: (name) => {
        const project: Project = {
          id: `project_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workspaceJson: null,
          generatedCode: '',
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          // Also remove the draft
          drafts: Object.fromEntries(
            Object.entries(state.drafts).filter(([k]) => k !== id)
          ),
        })),

      renameProject: (id, name) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        })),

      updateProjectCode: (id, code) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, generatedCode: code, updatedAt: new Date().toISOString() } : p
          ),
        })),
    }),
    {
      name: 'resqbox-workspace-v2',
      partialize: (state) => ({
        drafts: state.drafts,
        projects: state.projects,
      }),
    }
  )
);

// ── Legacy shim — so old components still compile ───────────────
// Provide a compatible interface for code that still uses old API
export function useLegacyWorkspaceCompat() {
  const store = useWorkspaceStore();
  const draft = store.getActiveDraft();
  return {
    workspaceJson: draft?.workspaceJson ?? null,
    generatedCode: draft?.generatedCode ?? '',
    generatedJsCode: draft?.generatedJsCode ?? '',
    setWorkspaceState: (json: object | null, code: string, jsCode: string) => {
      const id = store.activeContextId;
      if (id) store.saveDraft(id, json, code, jsCode);
    },
    clearWorkspace: () => {
      const id = store.activeContextId;
      if (id) store.clearDraft(id);
    },
  };
}
