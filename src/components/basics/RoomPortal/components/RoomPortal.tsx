import {
  RoomPortalSphere,
  RoomPortalSphereProps,
} from "@/components/basics/RoomPortal/components/RoomPortalSphere";
import { RoomPortalTitleProps } from "@/components/basics/RoomPortal/components/RoomPortalTitle";
import { ThreeEvent } from "@react-three/fiber";

import * as THREE from "three";

export interface RoomPortalProps
  extends RoomPortalSphereProps,
    RoomPortalTitleProps {
  position: THREE.Vector3;
  near: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>, position: THREE.Vector3) => void;
  scale?: [number, number, number];
}

export const RoomPortal = (props: RoomPortalProps) => {
  const { position, near, onClick, scale } = props;
  return (
    <>
      <group position={position}>
        {near ? (
          <></>
        ) : (
          <group onClick={(event) => onClick?.(event, position)} scale={scale}>
            <RoomPortalSphere {...props} />
            {/* <RoomPortalTitle {...props} /> */}
          </group>
        )}
      </group>
    </>
  );
};
