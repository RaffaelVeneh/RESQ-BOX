import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  workspaceJson: object | null;
  generatedCode: string;
  generatedJsCode: string;
  setWorkspaceState: (json: object | null, code: string, jsCode: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaceJson: null,
      generatedCode: '',
      generatedJsCode: '',
      setWorkspaceState: (json, code, jsCode) => set({ workspaceJson: json, generatedCode: code, generatedJsCode: jsCode }),
      clearWorkspace: () => set({ workspaceJson: null, generatedCode: '', generatedJsCode: '' }),
    }),
    {
      name: 'resqbox-workspace-storage',
      // Only persist the workspace layout — generated code is always rebuilt from workspaceJson on mount.
      // Persisting generatedJsCode would cause stale code to run after page refresh even if blocks were deleted.
      partialize: (state) => ({ workspaceJson: state.workspaceJson }),
    }
  )
);
