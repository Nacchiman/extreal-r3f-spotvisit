import { useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

export type ImageSphereProps = {
  imageSourceUrl: string;
  radius: number;
  side: THREE.Side;
  inverse: boolean;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
};

const ImageSphere: React.FC<ImageSphereProps> = (props: ImageSphereProps) => {
  const imageTexture = useTexture(props.imageSourceUrl);
  return (
    <>
      {imageTexture && (
        <mesh
          scale={props.scale}
          position={props.position}
          rotation={props.rotation}
        >
          <sphereGeometry />
          <meshBasicMaterial side={props.side} map={imageTexture} />
        </mesh>
      )}
    </>
  );
};

export default ImageSphere;
