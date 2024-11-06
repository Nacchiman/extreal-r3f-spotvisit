import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import useAvatarSelectStore from "@/components/basics/AvatarSelect/useAvatarSelectStore";

import Player from "@/components/basics/Player/Player";
import usePlayerInfoStore from "@/components/basics/Player/usePlayerStore";
import { RoomPortal } from "@/components/basics/RoomPortal/components/RoomPortal";
import {
  getRoomInfoById,
  RoomInfo,
} from "@/components/pages/SpotSelect/utils/RoomInfo.function";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef } from "react";
import Map, { ViewState } from "react-map-gl";
import { Canvas } from "react-three-map";
import styles from "./InMap.module.css";

export type InMapProps = {
  initialLongitude?: number;
  initialLatitude?: number;
};

export default function InMap(props: InMapProps) {
  const { initialLongitude = 139.79, initialLatitude = 35.654 } = props;
  const accessToken = import.meta.env.VITE_DEV_MAPBOX_ACCESS_TOKEN as string;
  const mapStyleUrl = import.meta.env.VITE_DEV_MAPBOX_STYLE_URL as string;
  const avatarSelectStore = useAvatarSelectStore();
  const avatarRef = useRef<AvatarHandle | null>(null);
  const playerInfo = usePlayerInfoStore();

  const initialViewState = {
    latitude: initialLatitude,
    longitude: initialLongitude,
    pitch: 80,
    bearing: 0,
    zoom: 16,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  } as ViewState;

  const enterRoom = (roomInfo: RoomInfo) => {
    playerInfo.setSpotInfo(roomInfo);
  };

  const roomIds = ["toyosu_city1", "toyosu_city2", "ayutthaya1"];
  const roomInfos = roomIds.map((roomId) => getRoomInfoById(roomId));

  return (
    <>
      <div className={styles.canvasDiv}>
        <Map
          initialViewState={initialViewState}
          antialias
          mapStyle={mapStyleUrl}
          mapboxAccessToken={accessToken}
        >
          {/* MapBox地図上にオブジェクトを表示するために、R3Fではなく、react-three-mapのCanvasを使っている */}
          <Canvas
            longitude={initialLongitude}
            latitude={initialLatitude}
            altitude={0}
          >
            <ambientLight intensity={5} />
            {avatarSelectStore.avatarType && (
              <>
                <Player avatarRef={avatarRef} scale={100} />
                {roomInfos.map(
                  (roomInfo) =>
                    roomInfo && (
                      <RoomPortal
                        key={roomInfo.id}
                        roomName="test"
                        scale={[100, 100, 100]}
                        position={roomInfo.position}
                        near={false}
                        sphericalImageUrl={roomInfo.sphericalImageUrl}
                        onClick={() => enterRoom(roomInfo)}
                      />
                    ),
                )}
              </>
            )}
          </Canvas>
        </Map>
      </div>
    </>
  );
}
