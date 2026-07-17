import { create } from 'zustand'

type LoaderStore = {
  /** True once the screen loader has finished its exit animation. */
  revealed: boolean
  reveal: () => void
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  revealed: false,
  reveal: () => set({ revealed: true }),
}))
