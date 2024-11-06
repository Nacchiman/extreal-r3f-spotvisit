import RoomPortalInfo from "@/features/player/R3F/RoomPortal/utils/RoomPortalInfo"
import * as THREE from "three"

export interface NearPortalInfo extends RoomPortalInfo {
  distance: number
}

export class RoomPortalUtil {
  static findClosestPortal(
    avatarPosition: THREE.Vector3,
    roomPortalInfos: RoomPortalInfo[],
    nearDistance: number,
  ): NearPortalInfo | undefined {
    let closestPortal: NearPortalInfo | undefined = undefined
    roomPortalInfos.forEach((roomPortalInfo) => {
      const distance = avatarPosition.distanceToSquared(roomPortalInfo.position)
      if (distance < nearDistance * nearDistance) {
        if (!closestPortal || distance < closestPortal.distance) {
          closestPortal = { ...roomPortalInfo, distance }
        }
      }
    })
    return closestPortal
  }
}
