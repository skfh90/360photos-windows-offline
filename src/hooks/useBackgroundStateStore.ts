import { create } from "zustand";

export const useBackgroundStateStore = create((set) => ({
  backgroundState: null,
  setBackgroundState: (state: any) => set({ backgroundState: state }),
}));
