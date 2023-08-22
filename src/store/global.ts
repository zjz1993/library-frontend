import { create } from 'zustand'

interface GlobalState {
  sideBarCollapse: boolean
  toggleSideBarCollapse: () => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  sideBarCollapse: false,
  toggleSideBarCollapse: () => {
    return set((state) => ({ sideBarCollapse: !state.sideBarCollapse }))
  }
}))
export default useGlobalStore
