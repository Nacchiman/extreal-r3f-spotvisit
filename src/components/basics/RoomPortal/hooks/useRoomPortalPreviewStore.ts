import { RoomInfo } from "@/features/player/R3F/SpotPin"
import create from "zustand"

export type RoomPortalPreviewStore = {
  roomInfo: RoomInfo | undefined
  setRoomInfo: (roomInfo: RoomInfo) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useRoomPortalPreviewStore = create<RoomPortalPreviewStore>(
  (set) => ({
    roomInfo: undefined,
    setRoomInfo: (roomInfo: RoomInfo) => set({ roomInfo }),
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
  }),
)
