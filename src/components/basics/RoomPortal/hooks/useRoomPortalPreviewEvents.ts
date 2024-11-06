import { useRoomPageEvents } from "@/features/player/components/pages/RoomPage/useRoomPageEvents"
import { useUpdateVisitHistoryMutate } from "@/features/player/hooks/BackendApi/useUpdateVisitHistoryMutate"
import { usePlayerInfoStore } from "@/features/player/R3F/LocalPlayer/hooks/usePlayerInfoStore"
import { usePointerInfoStore } from "@/features/player/R3F/Pointer"
import { useRemotePointerInfoMapStore } from "@/features/player/R3F/Pointer/hooks/useRemotePointerInfoMapStore"
import { RoomInfo } from "@/features/player/R3F/SpotPin"
import { useActivityModalStore } from "@/features/player/React/Modal/ActivityModal"
import { useSpotDetailModalInfoStore } from "@/features/player/React/Modal/SpotDetailModal"

export interface RoomPortalPreviewEventsArgs {}

export const useRoomPortalPreviewEvents = () => {
  const [setOpenSpotDetailModal, spotDetailModalSetShowPreview] =
    useSpotDetailModalInfoStore((state) => [
      state.setOpen,
      state.setShowPreview,
    ])

  const setOpenActivityModal = useActivityModalStore((state) => state.setIsOpen)
  const updateVisitHistoryMutate = useUpdateVisitHistoryMutate()
  const setRoomInfo = usePlayerInfoStore((state) => state.setRoomInfo)
  const setSpotInfo = usePlayerInfoStore((state) => state.setSpotInfo)
  const setRoomEnterEvent = usePlayerInfoStore(
    (state) => state.setRoomEnterEvent,
  )
  const { showRoomPortalPreview, hideRoomPortalPreview } = useRoomPageEvents()

  const clearItems = useRemotePointerInfoMapStore((state) => state.clearItems)
  const setPointerActive = usePointerInfoStore(
    (state) => state.setPointerActive,
  )
  const onRoomEnterClick = (roomInfo: RoomInfo) => {
    setSpotInfo(roomInfo.parentSpotInfo)
    setRoomInfo(roomInfo)
    setPointerActive(false)
    clearItems()
    setOpenSpotDetailModal(false)
    setRoomEnterEvent("roomPortal")

    updateVisitHistoryMutate.updateVisitHistory(roomInfo).catch(console.error)
  }

  const onRoomPreviewFirst = () => {
    setOpenSpotDetailModal(false)
    setOpenActivityModal(false)
    showRoomPortalPreview()

    spotDetailModalSetShowPreview(true)
  }

  const onUnmountRoomPortalPreview = () => {
    spotDetailModalSetShowPreview(false)
    hideRoomPortalPreview()
  }
  return {
    onRoomEnterClick,
    onRoomPreviewFirst,
    onUnmountRoomPortalPreview,
  }
}
