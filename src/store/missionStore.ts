import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS } from '../missions/data/missions';

type ValidationStatus = 'idle' | 'checking' | 'pass' | 'fail';

interface MissionState {
  completedMissionIds: string[];
  activeMissionId: string | null;
  validationStatus: ValidationStatus;
  validationMessage: string;

  setActiveMission: (id: string | null) => void;
  completeMission: (id: string) => void;
  setValidationResult: (status: ValidationStatus, message: string) => void;
  resetValidation: () => void;
  isUnlocked: (missionId: string) => boolean;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      completedMissionIds: [],
      activeMissionId: null,
      validationStatus: 'idle',
      validationMessage: '',

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

      isUnlocked: (missionId) => {
        const { completedMissionIds } = get();
        const mission = MISSIONS.find((m) => m.id === missionId);
        if (!mission) return false;
        // Level 1 is always unlocked
        if (mission.level === 1) return true;
        // A mission is unlocked if the previous level's mission is completed
        const prevMission = MISSIONS.find((m) => m.level === mission.level - 1);
        if (!prevMission) return true;
        return completedMissionIds.includes(prevMission.id);
      },
    }),
    {
      name: 'resqbox-mission-storage',
    }
  )
);
