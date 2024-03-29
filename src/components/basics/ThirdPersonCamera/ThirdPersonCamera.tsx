import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import { CharacterController } from "@/hooks/usePlayerInput";
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type ThirdPersonCameraProps = {
  movement: CharacterController;
  avatarRef: MutableRefObject<AvatarHandle | null>;
  cameraOffset?: THREE.Vector3;
  targetOffset?: THREE.Vector3;
  enableZoomAndPan?: boolean;
};

// ThirdPerson Camera based on OrbitControls for Avatar Control
const ThirdPersonCamera = (props: ThirdPersonCameraProps) => {
  // Drei currently does not forward Ref of OrbitControls(https://github.com/pmndrs/drei/issues/937)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);
  const { movement, avatarRef } = props;
  const initialCameraOffset = useMemo(
    () => props.cameraOffset ?? new THREE.Vector3(0, 2, -5),
    [props.cameraOffset],
  );
  const targetOffset = useMemo(
    () => props.targetOffset ?? new THREE.Vector3(0, 2, 0),
    [props.targetOffset],
  );
  const [distance, setDistance] = useState(
    initialCameraOffset.distanceTo(new THREE.Vector3()),
  );
  const enableZoomAndPan = props.enableZoomAndPan ?? true;

  // Initiate Camera Position by Avatar Load and changes
  useEffect(() => {
    if (avatarRef.current) {
      const controls = orbitControlsRef.current as OrbitControlsProps;
      if (controls.object) {
        controls.object.position.copy(initialCameraOffset);
      }
    }
  }, [initialCameraOffset, avatarRef]);

  useFrame(() => {
    const controls = orbitControlsRef.current as OrbitControlsProps;
    const avatarPos = avatarRef.current?.getPosition();
    if (avatarPos && controls.target && controls.update && controls.object) {
      //Set camera target
      if (controls.target instanceof THREE.Vector3) {
        controls.target.copy(avatarPos.clone().add(targetOffset));
      }
      //Camera keeps constant distance from Avatar
      if (
        movement.forward ||
        movement.backward ||
        movement.left ||
        movement.right ||
        movement.running
      ) {
        //Direction from current camera position to Avatar
        const currentCameraPos = controls.object.position.clone();
        if (currentCameraPos) {
          const directionVector = currentCameraPos.sub(avatarPos).normalize();

          //Update offset from Avatar to camera position to keep current distance
          const updatedOffset = directionVector.multiplyScalar(distance);

          //Update camera position with updated offset
          const updatedCameraPos = avatarPos.clone().add(updatedOffset);
          controls.object.position.copy(updatedCameraPos);
        }
      }
      controls.update();

      //Keep distance even after camera zooming or panning
      setDistance(controls.object.position.clone().distanceTo(avatarPos));
    }
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        // Prevent camera flipping when moving backwards by limiting polar angles
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        // Limit camera distance not to be inside Avatar
        minDistance={2.0}
        maxDistance={10.0}
        enableZoom={enableZoomAndPan}
        enablePan={enableZoomAndPan}
      />
    </>
  );
};

export default ThirdPersonCamera;