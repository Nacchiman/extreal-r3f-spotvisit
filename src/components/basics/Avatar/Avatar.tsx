import ParticipantInfoPanel from "@/components/basics/ParticipantInfoPanel/ParticipantInfoPanel";
import { CharacterController } from "@/hooks/usePlayerInput";
import useUpdateMotion from "@/hooks/useUpdateMotion";
import useUpdateTransform from "@/hooks/useUpdateTransform";
import useLoadVRM from "@/hooks/useVRM";
import useVRMAnimation from "@/hooks/useVRMAnimation";
import { Billboard, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

/**
 * Avatar properties interface.
 */
export interface AvatarProps {
  /** Path to the avatar's VRM file. */
  avatarPath: string;
  /** Mapping between animation names and their respective paths. */
  animationMap?: { [name: string]: string };
  /** Name of the currently active animation. */
  currentMotion?: string;
  controller?: CharacterController;
  onLoad?: () => void;
  playerId?: string;
  remotePosition?: THREE.Vector3;
  remoteRotation?: THREE.Euler;
  remoteCameraDirection?: THREE.Vector3;
  remoteCameraUp?: THREE.Vector3;
  scale?: number;
}

export type AvatarHandle = {
  getGltf: () => THREE.Group | undefined;
  getAvatar: () => THREE.Object3D | undefined;
  getPosition: () => THREE.Vector3 | undefined;
  getRotation: () => THREE.Euler | undefined;
  getCurrentMotion: () => string;
  getController: () => CharacterController;
  setMotion: Dispatch<SetStateAction<string>>;
  setPosition: (val: THREE.Vector3) => void;
};

/**
 * `Avatar` component for displaying VRM avatars with optional animations.
 *
 * @/param props Properties for the Avatar component.
 * @/returns Rendered Avatar component.
 */
export const Avatar = forwardRef((props: AvatarProps, ref) => {
  const {
    avatarPath,
    animationMap,
    currentMotion,
    controller,
    onLoad,
    playerId,
    remotePosition,
    remoteRotation,
    remoteCameraDirection,
    remoteCameraUp,
    scale,
  } = props;

  const { gltf, progress, error } = useLoadVRM({ avatarPath });
  const avatarRef = useRef<THREE.Group | null>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const setAnimation = useVRMAnimation({
    gltf,
    avatarRef,
    animationMap,
  });
  useEffect(() => {
    if (!gltf) return;
    if (animationMap && setAnimation && currentMotion) {
      setAnimation(currentMotion);
    }
  }, [gltf, setAnimation, animationMap, currentMotion]);

  useImperativeHandle(ref, () => ({
    getGltf: () => gltf,
    getAvatar: () => gltf?.scene,
    getPosition: () => gltf?.scene.position,
    getRotation: () => gltf?.scene.rotation,
    getCurrentMotion: () => currentMotion,
    getController: () => controller,
    setMotion: setAnimation,
    setPosition: setPosition,
  }));

  const isLoaded = useRef(false);
  useEffect(() => {
    if (!gltf) return;
    if (!isLoaded.current) {
      if (onLoad) {
        onLoad();
      }
      if (gltf.scene) {
        if (remotePosition) {
          gltf.scene.position.copy(remotePosition);
        }
        if (remoteRotation) gltf.scene.rotation.copy(remoteRotation);
      }
      isLoaded.current = true;
    }
  }, [gltf, onLoad, remotePosition, remoteRotation]);

  const setPosition = (pos: THREE.Vector3) => {
    gltf?.scene.position.copy(pos);
  };

  const [prevPosition, setPrevPosition] = useState(
    gltf?.scene.position ?? new THREE.Vector3(),
  );
  const [prevRemotePosition, setPrevRemotePosition] =
    useState<THREE.Vector3 | null>(null);
  const [prevRemoteRotation, setPrevRemoteRotation] =
    useState<THREE.Euler | null>(null);
  const { camera } = useThree();

  useUpdateTransform(
    gltf,
    controller,
    remoteCameraDirection ?? camera.getWorldDirection(new THREE.Vector3()),
    remoteCameraUp ?? camera.up,
    prevPosition,
  );
  useUpdateMotion(gltf, setAnimation, controller);

  const panelOffset = new THREE.Vector3(0, 2, 0);
  useFrame(() => {
    if (!gltf) {
      return;
    }
    const lerpFactor = 0.1;
    if (remotePosition && remotePosition !== prevRemotePosition) {
      const vrm = gltf.scene;
      vrm.position.lerp(remotePosition, lerpFactor);
      setPrevRemotePosition(remotePosition);
    }
    if (remoteRotation && remoteRotation !== prevRemoteRotation) {
      const vrm = gltf.scene;
      vrm.rotation.copy(remoteRotation);
      setPrevRemoteRotation(remoteRotation);
    }

    // Save the character's position before updating
    const currentPosition = gltf.scene.position;
    if (currentPosition) {
      if (
        prevPosition.x !== currentPosition.x ||
        prevPosition.z !== currentPosition.z
      ) {
        setPrevPosition(currentPosition);
      }
    }

    // Make ParticipantInfoPanel follow the avatar smoothly
    if (panelRef.current) {
      panelRef.current.position.copy(currentPosition).add(panelOffset);
    }
  });

  return (
    <>
      <Suspense fallback={null}>
        {error ? (
          <Html center>
            <span style={{ color: "red" }}>Error: {error.message}</span>
          </Html>
        ) : gltf ? (
          <>
            <group ref={avatarRef} scale={scale}>
              <primitive object={gltf.scene} />
            </group>
            <mesh ref={panelRef} scale={0.4}>
              <Billboard>
                <Html
                  transform
                  // Limit the range to prevent using the maximum z-index as default
                  zIndexRange={[100, 0]}
                >
                  <ParticipantInfoPanel playerId={playerId ?? ""} />
                </Html>
              </Billboard>
            </mesh>
          </>
        ) : (
          <Html center>
            <span style={{ color: "black" }}>Loading: {progress}%</span>
          </Html>
        )}
      </Suspense>
    </>
  );
});

Avatar.displayName = "Avatar";
