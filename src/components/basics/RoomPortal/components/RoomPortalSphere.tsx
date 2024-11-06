import ImageSphere from "@/components/basics/ImageSphere/ImageSphare";
import { Aura } from "@/components/basics/RoomPortal/components/Aura";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface RoomPortalSphereProps {
  sphericalImageUrl: string;
}

export const RoomPortalSphere = (props: RoomPortalSphereProps) => {
  const { camera } = useThree();
  const { sphericalImageUrl } = props;
  return (
    <>
      <Aura baseColor={"#8FA59CA6"} speed={-30000} lookAt={camera.position} />
      <Aura baseColor={"#8C91BEA6"} speed={30000} lookAt={camera.position} />
      <Aura baseColor={"#8FA59CA6"} speed={-30000} lookAt={camera.position} />
      <ImageSphere
        imageSourceUrl={sphericalImageUrl}
        radius={3}
        side={THREE.BackSide}
        position={[0, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        inverse
      />
    </>
  );
};
