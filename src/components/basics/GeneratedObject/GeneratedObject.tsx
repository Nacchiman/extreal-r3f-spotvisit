import { useGLTF } from "@react-three/drei";
import React from "react";

interface GeneratedObjectProps {
  gltfUrl: string;
  onPointerOver: () => void;
  onPointerOut: () => void;
  scale: number;
}

export const GeneratedObject: React.FC<GeneratedObjectProps> = ({
  gltfUrl,
  onPointerOver,
  onPointerOut,
  scale,
}) => {
  const gltf = useGLTF(gltfUrl);

  return (
    <mesh
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      scale={scale}
    >
      <primitive object={gltf.scene} />
    </mesh>
  );
};
