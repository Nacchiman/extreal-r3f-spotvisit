import * as THREE from "three"

export default class RoomPortalInfo {
  roomKey: string
  toRoomKey: string
  position: THREE.Vector3

  public constructor(
    roomKey: string,
    toRoomKey: string,
    position: THREE.Vector3,
  ) {
    this.roomKey = roomKey
    this.toRoomKey = toRoomKey
    this.position = position
  }
}
