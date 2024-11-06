import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import fragmentShader from "../utils/fragmentShader.glsl";
import vertexShader from "../utils/vertexShader.glsl";

const AuraMaterial = shaderMaterial(
  {
    time: 0,
    baseTexture: new THREE.Texture(),
    maskTexture: new THREE.Texture(),
    baseColor: new THREE.Vector4(0.0, 0.0, 0.0, 1.0),
    speed: 10000.0,
  },
  vertexShader,
  fragmentShader,
);

// Three.jsのカスタムマテリアルとして登録
extend({ AuraMaterial });
// 型定義にカスタムマテリアルを追加
declare module "@react-three/fiber" {
  interface ThreeElements {
    auraMaterial: {
      attach: string;
    } & React.JSX.IntrinsicElements["shaderMaterial"];
  }
}

const parseColorCode = (colorCode: string): THREE.Vector4 => {
  try {
    const hexColor = colorCode.slice(0, 7);
    const r = Number.parseInt(hexColor.slice(1, 3), 16) / 255.0;
    const g = Number.parseInt(hexColor.slice(3, 5), 16) / 255.0;
    const b = Number.parseInt(hexColor.slice(5, 7), 16) / 255.0;
    const alpha = Number.parseInt(colorCode.slice(7, 9), 16) / 255.0;
    return new THREE.Vector4(r, g, b, alpha);
  } catch (error) {
    console.error("Failed to parse color code:", colorCode);
    return new THREE.Vector4(0.0, 0.0, 0.0, 1.0);
  }
};

export interface AuraProps {
  /** #RRGGBBAA形式のカラーコード */
  baseColor: string;
  speed: number;
  lookAt: THREE.Vector3;
}

export const Aura = (props: AuraProps) => {
  const { baseColor, speed, lookAt } = props;
  const meshRef = useRef<THREE.Mesh>(null);
  const baseTextureObj = useLoader(
    THREE.TextureLoader,
    "/images/portal/PortalTexture.png",
  );
  const maskTextureObj = useLoader(
    THREE.TextureLoader,
    "/images/portal/mask_portal.png",
  );
  const uniforms = useMemo(
    () => ({
      baseTexture: { value: baseTextureObj },
      maskTexture: { value: maskTextureObj },
      baseColor: { value: parseColorCode(baseColor) },
      speed: { value: speed },
    }),
    [baseTextureObj, maskTextureObj, baseColor, speed],
  );

  useEffect(
    () => {
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        Object.entries(uniforms).forEach(([key, uniform]) => {
          material.uniforms[key].value = uniform.value;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 初期化処理のみ
    [],
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = clock.getElapsedTime();
      }
      meshRef.current.lookAt(lookAt);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 2.5, 0]}
      scale={[0.3, 0.3, 0.3]}
      renderOrder={3}
    >
      <planeGeometry args={[9, 9]} />
      <auraMaterial attach="material" transparent />
    </mesh>
  );
};
