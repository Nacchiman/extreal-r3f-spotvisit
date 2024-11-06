import { useUserEventPostEvent } from "@/features/player/hooks/AppUsage"
import { useUpdateVisitHistoryMutate } from "@/features/player/hooks/BackendApi/useUpdateVisitHistoryMutate"
import { useWindowSize } from "@/features/player/hooks/useWindowSize"
import { isMoving, LocalPlayerHandle } from "@/features/player/R3F/Avatar"
import { usePlayerInfoStore } from "@/features/player/R3F/LocalPlayer/hooks/usePlayerInfoStore"
import { usePointerInfoStore } from "@/features/player/R3F/Pointer"
import { useRemotePointerInfoMapStore } from "@/features/player/R3F/Pointer/hooks/useRemotePointerInfoMapStore"
import { RoomPortalProps } from "@/features/player/R3F/RoomPortal/components/RoomPortal"
import { useRoomPortalPreviewEvents } from "@/features/player/R3F/RoomPortal/hooks/useRoomPortalPreviewEvents"
import RoomPortalInfo from "@/features/player/R3F/RoomPortal/utils/RoomPortalInfo"
import {
  NearPortalInfo,
  RoomPortalUtil,
} from "@/features/player/R3F/RoomPortal/utils/RoomPortalUtil"
import { RoomInfo } from "@/features/player/R3F/SpotPin"
import { useTapMoveCanvasInfoStore } from "@/features/player/R3F/TapMoveCanvas"
import { useSpotDetailModalInfoStore } from "@/features/player/React/Modal/SpotDetailModal"
import { usePhotoLogic } from "@/features/player/React/Photo"
import { usePreviewMoveInfoStore } from "@/features/player/Stores"
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import * as THREE from "three"
import shallow from "zustand/shallow"

export interface RoomPortalGroupEventsArgs {
  roomInfos: RoomInfo[]
  roomPortalInfos: RoomPortalInfo[]
  avatarRef: MutableRefObject<LocalPlayerHandle | null>
  nearDistance?: number
  width: number
}

export const useRoomPortalGroupEvents = (
  props: RoomPortalGroupEventsArgs,
): RoomPortalProps[] => {
  const { roomInfos, roomPortalInfos, avatarRef, nearDistance = 5 } = props
  const [nearPortalInfo, setNearPortalInfo] = useState<
    NearPortalInfo | undefined
  >(undefined)
  const [roomPortalProps, setRoomPortalProps] = useState<RoomPortalProps[]>([])
  const playerInfo = usePlayerInfoStore()
  const pointerActive = usePointerInfoStore((state) => state.pointerActive)
  const clearItems = useRemotePointerInfoMapStore((state) => state.clearItems)
  const updateVisitHistoryMutate = useUpdateVisitHistoryMutate()
  const camera = useThree((state) => state.camera)
  const { moveTargetPosition, setMoveTargetPosition } =
    useTapMoveCanvasInfoStore(
      (state) => ({
        moveTargetPosition: state.moveTargetPosition,
        setMoveTargetPosition: state.setMoveTargetPosition,
      }),
      shallow,
    )
  const userEventPostEvent = useUserEventPostEvent()
  const { setPreviewPoint, setAlreadyStopped } = usePreviewMoveInfoStore(
    (state) => ({
      setPreviewPoint: state.setPreviewPoint,
      setAlreadyStopped: state.setAlreadyStopped,
    }),
    shallow,
  )
  const setShowPreview = useSpotDetailModalInfoStore(
    (state) => state.setShowPreview,
  )
  const spotDetailModal = useSpotDetailModalInfoStore()
  const { width } = useWindowSize()

  const { forceToClosePhoto } = usePhotoLogic()

  const { onRoomEnterClick, onRoomPreviewFirst, onUnmountRoomPortalPreview } =
    useRoomPortalPreviewEvents()

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>, position: THREE.Vector3) => {
      if (!pointerActive) {
        setMoveTargetPosition(position)
        userEventPostEvent.onPost({ event_name: "portal_tap" })
        event.stopPropagation()
      }
    },
    [setMoveTargetPosition, pointerActive, userEventPostEvent],
  )

  const prevNearPortalInfo = useRef<NearPortalInfo | undefined>(undefined)
  const targetZoom = useRef(1) // 目標のズーム値を保持するためのref

  useFrame(() => {
    const controller = avatarRef.current?.getController()
    const position = avatarRef.current?.getPosition()
    if (position) {
      if ((!controller || !isMoving(controller)) && !moveTargetPosition) {
        return
      }
      const closestPortal = RoomPortalUtil.findClosestPortal(
        position ?? new THREE.Vector3(),
        roomPortalInfos,
        nearDistance,
      )
      setNearPortalInfo(closestPortal)
      if (prevNearPortalInfo.current?.toRoomKey !== closestPortal?.toRoomKey) {
        prevNearPortalInfo.current = closestPortal
        if (closestPortal) {
          setPreviewPoint(closestPortal.position)
          setAlreadyStopped(false)
          forceToClosePhoto()
          // 目標のズーム値を設定
          targetZoom.current = 1.5
        } else {
          setPreviewPoint(undefined)
          // 目標のズーム値を元に戻す
          targetZoom.current = 1
        }
      }
    }
  })

  useFrame(() => {
    if (camera.zoom.toFixed(3) === targetZoom.current.toFixed(3)) {
      return
    }

    // カメラのズームを滑らかに変更
    const maxZoomChange = 1 // フレームごとの最大ズーム変化量
    const newZoom = THREE.MathUtils.lerp(camera.zoom, targetZoom.current, 0.1)
    camera.zoom +=
      Math.sign(newZoom - camera.zoom) *
      Math.min(maxZoomChange, Math.abs(newZoom - camera.zoom))
    camera.updateProjectionMatrix()
  })

  useEffect(() => {
    if (!nearPortalInfo) {
      // ルームポータルから出たらズームを元に戻す
      targetZoom.current = 1
    }
  }, [nearPortalInfo])

  useEffect(() => {
    const roomPortalProps: RoomPortalProps[] = []

    roomPortalInfos.forEach((roomPortalInfo) => {
      // ポータルの目的地になるルーム情報を取得
      const toRoomInfo = roomInfos.find(
        (roomInfo) => roomInfo.roomKey === roomPortalInfo.toRoomKey,
      )
      if (toRoomInfo) {
        let near = false
        if (
          nearPortalInfo &&
          nearPortalInfo.toRoomKey === roomPortalInfo.toRoomKey
        ) {
          near = true
        }
        roomPortalProps.push({
          ...toRoomInfo,
          position: roomPortalInfo.position,
          cameraPosition: camera.position,
          near,
          onRoomEnterClick: () => {
            onRoomEnterClick(toRoomInfo)
          },
          onClick,
          onRoomPreviewFirst: () => {
            onRoomPreviewFirst()
          },
          onUnmountRoomPortalPreview: () => {
            onUnmountRoomPortalPreview()
          },
          width,
          isVideoRoom: toRoomInfo.videoUrl ? true : false,
        })
      }
    })

    setRoomPortalProps(roomPortalProps)
  }, [
    camera.position,
    updateVisitHistoryMutate,
    clearItems,
    nearPortalInfo,
    onClick,
    playerInfo,
    roomPortalInfos,
    roomInfos,
    spotDetailModal,
    updateVisitHistoryMutate,
    width,
    setShowPreview,
    onRoomPreviewFirst,
    onUnmountRoomPortalPreview,
    onRoomEnterClick,
  ])

  return roomPortalProps
}
