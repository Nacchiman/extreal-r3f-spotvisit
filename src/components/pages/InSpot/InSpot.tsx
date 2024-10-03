import VideoScreen from "@/components/VideoScreen/VideoScreen";
import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import Player from "@/components/basics/Player/Player";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import RemotePlayerGroup from "@/components/basics/RemotePlayerGroup/RemotePlayerGroup";
import ThirdPersonCamera from "@/components/basics/ThirdPersonCamera/ThirdPersonCamera";
import { VirtualJoyStick } from "@/components/basics/VirtualJoyStick/VirtualJoyStick";
import useVirtualJoyStickPlayerInput from "@/hooks/useVirtualJoyStickPlayerInput";
import YoutubeUtil from "@/libs/util/YoutubeUtil";
import { Grid, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import styles from "./InSpot.module.css";

const InSpot = () => {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInfo = usePlayerInfoStore();
  const { playerInput, handleJoystickData, startJump } =
    useVirtualJoyStickPlayerInput();
  const avatarRef = useRef<AvatarHandle | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (playerInfo.youtubeChannelInfo) {
        const video = await YoutubeUtil.getRandomVideoFromChannel(
          playerInfo.youtubeChannelInfo.id.channelId,
        );
        setVideoId(video.id);
      }
    };

    fetchVideo();
  }, [playerInfo, playerInfo.youtubeChannelInfo]);

  const handleVideoEnd = async () => {
    if (playerInfo.youtubeChannelInfo) {
      const video = await YoutubeUtil.getRandomVideoFromChannel(
        playerInfo.youtubeChannelInfo.id.channelId,
      );
      setVideoId(video.id);
    }
  };

  return (
    <>
      {playerInfo.youtubeChannelInfo && (
        <>
          <VirtualJoyStick handle={handleJoystickData} startJump={startJump} />
          <div className={styles.canvasDiv}>
            <Canvas
              linear={true}
              flat={true}
              style={{ backgroundColor: "black" }}
            >
              {videoId ? (
                <VideoScreen videoId={videoId} onEnd={handleVideoEnd} />
              ) : (
                <></>
              )}
              <ambientLight intensity={5} />
              <ThirdPersonCamera
                movement={playerInput.movement}
                setMovement={playerInput.setMovement}
                avatarRef={avatarRef}
              />
              {/* Floor showing the range within VideoSphere */}
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
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[500, 500]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={80}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#050505"
                  metalness={0.5}
                  mirror={0}
                />
              </mesh>
              {avatarSelectStore.avatarType && (
                <>
                  <Player
                    avatarRef={avatarRef}
                    movement={playerInput.movement}
                  />
                  <RemotePlayerGroup avatarRef={avatarRef} />
                </>
              )}
            </Canvas>
          </div>
        </>
      )}
    </>
  );
};

export default InSpot;
