import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS, CATEGORIES, type MissionCategory } from '../missions/data/missions';

type ValidationStatus = 'idle' | 'checking' | 'pass' | 'fail';

interface MissionState {
  completedMissionIds: string[];
  activeMissionId: string | null;
  validationStatus: ValidationStatus;
  validationMessage: string;
  currentCategoryIndex: number;

  setActiveMission: (id: string | null) => void;
  completeMission: (id: string) => void;
  setValidationResult: (status: ValidationStatus, message: string) => void;
  resetValidation: () => void;
  isUnlocked: (missionId: string) => boolean;
  isCategoryUnlocked: (categoryIndex: number) => boolean;
  setCurrentCategoryIndex: (index: number) => void;
  getCategoryProgress: (categoryId: MissionCategory) => { completed: number; total: number };
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      completedMissionIds: [],
      activeMissionId: null,
      validationStatus: 'idle',
      validationMessage: '',
      currentCategoryIndex: 0,

      setActiveMission: (id) => set({ activeMissionId: id, validationStatus: 'idle', validationMessage: '' }),

      completeMission: (id) =>
        set((state) => ({
          completedMissionIds: state.completedMissionIds.includes(id)
            ? state.completedMissionIds
            : [...state.completedMissionIds, id],
        })),

      setValidationResult: (status, message) =>
        set({ validationStatus: status, validationMessage: message }),

      resetValidation: () => set({ validationStatus: 'idle', validationMessage: '' }),

      setCurrentCategoryIndex: (index) => set({ currentCategoryIndex: index }),

      isUnlocked: (missionId) => {
        const { completedMissionIds } = get();
        const mission = MISSIONS.find((m) => m.id === missionId);
        if (!mission) return false;
        // Level 1 in a category is unlocked if the category itself is unlocked
        if (mission.level === 1) {
          const catIndex = CATEGORIES.findIndex((c) => c.id === mission.category);
          return get().isCategoryUnlocked(catIndex);
        }
        // Mission N requires mission N-1 in the same category to be completed
        const prevMission = MISSIONS.find(
          (m) => m.category === mission.category && m.level === mission.level - 1
        );
        if (!prevMission) return true;
        return completedMissionIds.includes(prevMission.id);
      },

      isCategoryUnlocked: (categoryIndex) => {
        const { completedMissionIds } = get();
        // First category is always unlocked
        if (categoryIndex === 0) return true;
        // A category is unlocked if ALL missions in the previous category are completed
        const prevCategory = CATEGORIES[categoryIndex - 1];
        const prevMissions = MISSIONS.filter((m) => m.category === prevCategory.id);
        return prevMissions.every((m) => completedMissionIds.includes(m.id));
      },

      getCategoryProgress: (categoryId) => {
        const { completedMissionIds } = get();
        const missionsInCategory = MISSIONS.filter((m) => m.category === categoryId);
        const completed = missionsInCategory.filter((m) => completedMissionIds.includes(m.id)).length;
        return { completed, total: missionsInCategory.length };
      },
    }),
    {
      name: 'resqbox-mission-storage',
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error || !state) return;
          // ── Integrity check: validate completedMissionIds ──
          const { completedMissionIds } = state;
          const validIds = new Set(MISSIONS.map((m) => m.id));
          const cleaned = completedMissionIds.filter((id) => {
            if (!validIds.has(id)) return false;
            const mission = MISSIONS.find((m) => m.id === id)!;
            if (mission.level === 1) return true;
            const prevMission = MISSIONS.find(
              (m) => m.category === mission.category && m.level === mission.level - 1
            );
            if (!prevMission) return true;
            return completedMissionIds.includes(prevMission.id);
          });
          if (cleaned.length !== completedMissionIds.length) {
            console.warn(
              `[Security] Removed ${completedMissionIds.length - cleaned.length} tampered mission(s).`
            );
            state.completedMissionIds = cleaned;
          }
        };
      },
    }
  )
);
