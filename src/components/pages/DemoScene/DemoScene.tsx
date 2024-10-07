import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import { ImageToObjectForm } from "@/components/basics/ImageToObjectForm/ImageToObjectForm";
import Player from "@/components/basics/Player/Player";
import RemotePlayerGroup from "@/components/basics/RemotePlayerGroup/RemotePlayerGroup";
import { TextToObject } from "@/components/basics/TextToObject/TextToObject";
import { TextToObjectForm } from "@/components/basics/TextToObjectForm/TextToObjectForm";
import ThirdPersonCamera from "@/components/basics/ThirdPersonCamera/ThirdPersonCamera";
import { VirtualJoyStick } from "@/components/basics/VirtualJoyStick/VirtualJoyStick";
import { useGeneratedObject } from "@/hooks/useGeneratedObject";
import useVirtualJoyStickPlayerInput from "@/hooks/useVirtualJoyStickPlayerInput";
import { Grid } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import styles from "./DemoScene.module.css";

export const DemoScene = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const { playerInput, handleJoystickData, startJump } =
    useVirtualJoyStickPlayerInput();
  const avatarRef = useRef<AvatarHandle | null>(null);

  const {
    fetchTextObject,
    fetchImageObject,
    status,
    progress,
    error,
    gltfUrl,
  } = useGeneratedObject();

  return (
    <>
      <TextToObjectForm fetchObject={fetchTextObject} />
      <ImageToObjectForm fetchObject={fetchImageObject} />
      <VirtualJoyStick handle={handleJoystickData} startJump={startJump} />
      <div className={styles.canvasDiv}>
        <Canvas linear={true} flat={true}>
          <ambientLight intensity={5} />
          <ThirdPersonCamera
            movement={playerInput.movement}
            setMovement={playerInput.setMovement}
            avatarRef={avatarRef}
          />
          <Grid
            cellSize={1}
            cellThickness={0.3}
            cellColor={"gray"}
            sectionSize={0}
            sectionThickness={0}
            sectionColor={"gray"}
            args={[30, 30]}
            fadeDistance={120}
            fadeStrength={1}
          />
          {avatarSelectStore.avatarType && (
            <>
              <Player avatarRef={avatarRef} movement={playerInput.movement} />
              <RemotePlayerGroup avatarRef={avatarRef} />
            </>
          )}
          <TextToObject
            gltfUrl={gltfUrl}
            status={status}
            progress={progress}
            error={error}
          />
        </Canvas>
      </div>
    </>
  );
};
