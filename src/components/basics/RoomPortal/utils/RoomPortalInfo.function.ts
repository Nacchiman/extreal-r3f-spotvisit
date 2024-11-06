import RoomPortalInfo from "@/features/player/R3F/RoomPortal/utils/RoomPortalInfo"
import * as THREE from "three"

const RoomPortalInfoMap: {
  [spotKey: string]: RoomPortalInfo[]
} = {
  ayutthaya: [
    {
      roomKey: "ayutthaya1",
      toRoomKey: "ayutthaya2",
      position: new THREE.Vector3(-1, 0, 6),
    },
    {
      roomKey: "ayutthaya2",
      toRoomKey: "ayutthaya1",
      position: new THREE.Vector3(6, 0, 1),
    },
  ],
  toyosu_city: [
    {
      roomKey: "toyosu_city1",
      toRoomKey: "toyosu_city4",
      position: new THREE.Vector3(-10, 0, 0),
    },
    {
      roomKey: "toyosu_city1",
      toRoomKey: "toyosu_city2",
      position: new THREE.Vector3(10, 0, 0),
    },
    {
      roomKey: "toyosu_city2",
      toRoomKey: "toyosu_city1",
      position: new THREE.Vector3(-10, 0, 0),
    },
    {
      roomKey: "toyosu_city2",
      toRoomKey: "toyosu_city3",
      position: new THREE.Vector3(10, 0, 0),
    },
    {
      roomKey: "toyosu_city3",
      toRoomKey: "toyosu_city2",
      position: new THREE.Vector3(-10, 0, 0),
    },
    {
      roomKey: "toyosu_city3",
      toRoomKey: "toyosu_city4",
      position: new THREE.Vector3(10, 0, 0),
    },
    {
      roomKey: "toyosu_city4",
      toRoomKey: "toyosu_city3",
      position: new THREE.Vector3(-10, 0, 0),
    },
    {
      roomKey: "toyosu_city4",
      toRoomKey: "toyosu_city1",
      position: new THREE.Vector3(10, 0, 0),
    },
  ],
  yurikamome: [
    {
      roomKey: "yurikamome",
      toRoomKey: "yurikamome_mk2",
      position: new THREE.Vector3(7, 0, -7),
    },
    {
      roomKey: "yurikamome_mk2",
      toRoomKey: "yurikamome",
      position: new THREE.Vector3(-7, 0, 7),
    },
  ],
  yurikamome2: [
    {
      roomKey: "yurikamome2-1",
      toRoomKey: "yurikamome_mk2",
      position: new THREE.Vector3(15, 0, -7),
    },
    {
      roomKey: "yurikamome2-mk2",
      toRoomKey: "yurikamome",
      position: new THREE.Vector3(-7, 0, 15),
    },
  ],
}

export const getRoomPortalInfoBySpotKeyAndRoomKey = (
  spotKey: string,
  roomKey: string,
): RoomPortalInfo[] | undefined => {
  const roomPortalInfo = RoomPortalInfoMap[spotKey]
  if (!roomPortalInfo) {
    return undefined
  }
  const find = roomPortalInfo.filter(
    (roomPortal) => roomPortal.roomKey === roomKey,
  )
  return find.length === 0 ? undefined : find
}

export default RoomPortalInfoMap
