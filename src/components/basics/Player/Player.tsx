import { Avatar, AvatarHandle } from "@/components/basics/Avatar/Avatar";
import {
  defaultAnimationMap,
  getAvatarPath,
} from "@/components/basics/Avatar/Avatar.function";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useMultiplayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import RemotePlayerInfoMessage, {
  RemotePlayerInfoMessageType,
} from "@/components/basics/Player/PlayerInfoMessage";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import { CharacterController } from "@/hooks/usePlayerInput";
import { useThree } from "@react-three/fiber";
import { MutableRefObject, useCallback, useEffect } from "react";

export interface PlayerProps {
  avatarRef: MutableRefObject<AvatarHandle | null>;
  movement?: CharacterController;
  scale?: number;
}

const Player = (props: PlayerProps) => {
  const avatarSelectStore = useAvatarSelectStore();
  const playerInfo = usePlayerInfoStore();
  const { movement, avatarRef, scale } = props;
  const channel = useMultiplayChannelStore();
  const { camera } = useThree();

  const enqueueUpdate = useCallback(
    (type: RemotePlayerInfoMessageType) => {
      if (
        channel.isConnected &&
        channel.playerId &&
        playerInfo.spotInfo &&
        avatarRef.current
      ) {
        const msg = RemotePlayerInfoMessage.toPayload(
          channel.playerId,
          type,
          avatarSelectStore.playerName,
          avatarSelectStore.avatarType,
          avatarRef.current,
          playerInfo.spotInfo.id,
          camera,
        );

        channel.enqueueRequest(msg);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      channel.isConnected,
      channel.playerId,
      playerInfo.spotInfo,
      avatarSelectStore.avatarType,
      avatarSelectStore.playerName,
    ],
  );

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.NEW);
    }
  }, [channel.isConnected, enqueueUpdate]);

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.MOVE);
    }
  }, [
    movement?.forward,
    movement?.backward,
    movement?.left,
    movement?.right,
    movement?.running,
    movement?.jump,
    channel.isConnected,
    enqueueUpdate,
  ]);

  useEffect(() => {
    if (channel.isConnected) {
      enqueueUpdate(RemotePlayerInfoMessageType.CHANGE);
    }
  }, [
    channel.isConnected,
    avatarSelectStore.avatarType,
    avatarSelectStore.playerName,
    enqueueUpdate,
  ]);

  return (
    <>
      <Avatar
        ref={props.avatarRef}
        avatarPath={getAvatarPath(avatarSelectStore.avatarType)}
        animationMap={defaultAnimationMap}
        controller={movement}
        playerId={playerInfo.multiplayPlayerId}
        scale={scale}
      />
    </>
  );
};

export default Player;
