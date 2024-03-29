import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";
import useMultiPlayChannelStore from "@/components/basics/Multiplay/useMultiplayChannelStore";
import RemotePlayerInfoMessage, {
  RemotePlayerInfoMessageType,
} from "@/components/basics/Player/PlayerInfoMessage";
import RemotePlayer from "@/components/basics/RemotePlayer/RemotePlayer";
import useRemotePlayerInfoMapStore from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import useSelectedSpotStore from "@/components/pages/SpotSelect/useSpotSelectStore";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useState } from "react";

export type RemotePlayerGroupProps = {
  avatarRef: MutableRefObject<AvatarHandle | null>;
};
const RemotePlayerGroup = (props: RemotePlayerGroupProps) => {
  const { avatarRef } = props;
  const channel = useMultiPlayChannelStore();
  const remotePlayerInfoMap = useRemotePlayerInfoMapStore();
  const avatarSelectStore = useAvatarSelectStore();
  const selectedSpotStore = useSelectedSpotStore();
  const [msgMap, setMsgMap] = useState(
    new Map<string, RemotePlayerInfoMessage>(),
  );

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
              selectedSpotStore.spotInfo &&
              avatarRef.current
            ) {
              channel.enqueueRequest(
                RemotePlayerInfoMessage.toPayload(
                  channel.playerId,
                  RemotePlayerInfoMessageType.NEW,
                  avatarSelectStore.playerName,
                  avatarSelectStore.avatarType,
                  avatarRef.current,
                  selectedSpotStore.spotInfo?.id,
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