import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useMultiplayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import RemotePlayerInfoMessage, {
  RemotePlayerInfoMessageType,
} from "@/components/basics/Player/PlayerInfoMessage";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import RemotePlayer from "@/components/basics/RemotePlayer/RemotePlayer";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useState } from "react";

export type RemotePlayerGroupProps = {
  avatarRef: MutableRefObject<AvatarHandle | null>;
};
const RemotePlayerGroup = (props: RemotePlayerGroupProps) => {
  const { avatarRef } = props;
  const channel = useMultiplayChannelStore();
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const avatarSelectStore = useAvatarSelectStore();
  const playerInfo = usePlayerInfoStore();
  const [msgMap, setMsgMap] = useState(
    new Map<string, RemotePlayerInfoMessage>(),
  );
  const { camera } = useThree();

  //Reflect received messages on avatars in Multiplay
  useFrame(() => {
    for (let i = 0; i < channel.responseQueue.length; i++) {
      const payload = channel.dequeueResponse();
      if (payload) {
        const msg = RemotePlayerInfoMessage.fromPayload(payload);
        if (!msg) return;
        if (msg.remotePlayerInfo) {
          setMsgMap((currentMap) => {
            const newMap = new Map(currentMap);
            newMap.set(msg.playerId, msg);
            return newMap;
          });
          //Send your info upon first message from a new player
          if (!remotePlayerInfoMap.getItem(msg.playerId)) {
            msg.command = RemotePlayerInfoMessageType.NEW;
            if (
              channel.playerId &&
              playerInfo.youtubeChannelInfo &&
              avatarRef.current
            ) {
              channel.enqueueRequest(
                RemotePlayerInfoMessage.toPayload(
                  channel.playerId,
                  RemotePlayerInfoMessageType.NEW,
                  avatarSelectStore.playerName,
                  avatarSelectStore.avatarType,
                  avatarRef.current,
                  playerInfo.youtubeChannelInfo?.id,
                  camera,
                ),
              );
            }
          }
          remotePlayerInfoMap.setItem(msg.remotePlayerInfo, msg.playerId);
        }
      }
    }
  });

  return (
    <>
      <mesh>
        {Object.keys(Object.fromEntries(remotePlayerInfoMap.items)).map(
          (playerId) => (
            <RemotePlayer
              key={playerId}
              playerId={playerId}
              remotePlayerInfoMsg={msgMap.get(playerId)}
            />
          ),
        )}
      </mesh>
    </>
  );
};

export default RemotePlayerGroup;
