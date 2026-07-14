import { create } from "zustand";

export type TourStage = "idle" | "welcome" | "dashboard" | "creating_obra" | "waiting_obra" | "obra" | "finished";

interface TutorialState {
  stage: TourStage;
  hasObras: boolean;
  startTutorial: (hasObras?: boolean) => void;
  setStage: (stage: TourStage) => void;
  stopTutorial: () => void;
}

export const useTutorial = create<TutorialState>((set) => ({
  stage: "idle",
  hasObras: true,
  startTutorial: (hasObras = true) => set({ stage: "welcome", hasObras }),
  setStage: (stage) => set({ stage }),
  stopTutorial: () => set({ stage: "idle" }),
}));
