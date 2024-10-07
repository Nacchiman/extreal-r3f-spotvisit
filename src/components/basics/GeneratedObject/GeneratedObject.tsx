import { useGLTF } from "@react-three/drei";
import React from "react";

interface GeneratedObjectProps {
  gltfUrl: string;
}

export const GeneratedObject: React.FC<GeneratedObjectProps> = ({
  gltfUrl,
}) => {
  const gltf = useGLTF(gltfUrl);

  return <primitive object={gltf.scene} />;
};
