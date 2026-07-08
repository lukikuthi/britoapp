import { create } from "zustand";

export type TourStage = "idle" | "dashboard" | "waiting_obra" | "obra" | "finished";

interface TutorialState {
  stage: TourStage;
  startTutorial: () => void;
  setStage: (stage: TourStage) => void;
  stopTutorial: () => void;
}

export const useTutorial = create<TutorialState>((set) => ({
  stage: "idle",
  startTutorial: () => set({ stage: "dashboard" }),
  setStage: (stage) => set({ stage }),
  stopTutorial: () => set({ stage: "idle" }),
}));
