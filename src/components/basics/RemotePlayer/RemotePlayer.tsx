import { Avatar, AvatarHandle } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  getAvatarPath,
} from "@/components/basics/Avatar/Avatar.function";
import RemotePlayerInfoMessage from "@/components/basics/Player/PlayerInfoMessage";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import { useRef } from "react";

export type RemotePlayerProps = {
  playerId: string;
  remotePlayerInfoMsg: RemotePlayerInfoMessage | undefined;
};

const RemotePlayer = (props: RemotePlayerProps) => {
  const { playerId, remotePlayerInfoMsg } = props;
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const playerInfo = usePlayerInfoStore();
  const avatarRef = useRef<AvatarHandle | null>(null);
  let remotePlayerInfo = remotePlayerInfoMap.getItem(playerId);

  if (!remotePlayerInfo) {
    console.debug("playerInfo is not defined");
    return <>error</>;
  }
  if (remotePlayerInfo.spotKey !== playerInfo.youtubeChannelInfo?.id) {
    return <></>;
  }
  if (remotePlayerInfoMsg?.remotePlayerInfo) {
    remotePlayerInfo = remotePlayerInfoMsg.remotePlayerInfo;
  }

  return (
    <>
      <Avatar
        ref={avatarRef}
        avatarPath={getAvatarPath(remotePlayerInfo.avatarType)}
        animationMap={defaultAnimationMap}
        controller={remotePlayerInfo.controller}
        currentMotion={remotePlayerInfo.motion}
        playerId={remotePlayerInfo.playerId}
        remotePosition={remotePlayerInfo.position}
        remoteRotation={remotePlayerInfo.rotation}
        remoteCameraDirection={remotePlayerInfo.cameraDirection}
        remoteCameraUp={remotePlayerInfo.cameraUp}
      />
    </>
  );
};

export default RemotePlayer;
