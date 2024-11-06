import { Billboard, RoundedBox, Text } from "@react-three/drei";

export interface RoomPortalTitleProps {
  roomName: string;
}

export const RoomPortalTitle = (props: RoomPortalTitleProps) => {
  const { roomName } = props;
  return (
    <>
      <Billboard position={[0, 7, 0]}>
        <RoundedBox position={[0, 0, 0]} smoothness={16}>
          <meshBasicMaterial color={"white"} transparent opacity={1} />
        </RoundedBox>
        <Text
          position={[0, 0, 1]}
          color={"black"}
          fontSize={34}
          renderOrder={1}
          scale={[1.5, 1.5, 0.01]}
        >
          {roomName}
        </Text>
      </Billboard>
    </>
  );
};
