import { Html } from "@react-three/drei";
import YouTube from "react-youtube";
import styles from "./VideoScreen.module.css";

export type VideoScreenProps = {
  videoId: string;
  onEnd: () => void;
};

const VideoScreen = (props: VideoScreenProps) => {
  const opts = {
    height: "1080",
    width: "1920",
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const handleEnd = () => {
    props.onEnd();
  };

  return (
    <Html
      position={[0, 7, 5]}
      scale={0.5}
      rotation={[0, Math.PI, 0]}
      transform
      occlude={"blending"}
    >
      <div className={styles.videoDiv}>
        <YouTube videoId={props.videoId} opts={opts} onEnd={handleEnd} />
      </div>
    </Html>
  );
};

export default VideoScreen;
