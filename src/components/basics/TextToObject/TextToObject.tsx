import { PivotScaleForm } from "@/components/basics/TextToObject/PivotScaleForm";
import { Html, PivotControls } from "@react-three/drei";
import React, { useRef, useState } from "react";
import { GeneratedObject } from "../GeneratedObject/GeneratedObject";

interface TextToObjectProps {
  gltfUrl?: string;
  status: string | undefined;
  progress: number | undefined;
  error: string | undefined;
}

export const TextToObject: React.FC<TextToObjectProps> = ({
  gltfUrl,
  status,
  progress,
  error,
}) => {
  const [controlVisible, setPivotVisible] = useState(false);
  const [scale, setScale] = useState(1);

  const scaleFactor = 0.5;
  const onScaleUp = () => {
    setScale((prev) => prev + scaleFactor);
  };
  const onScaleDown = () => {
    setScale((prev) => prev - scaleFactor);
  };

  const timer = useRef<NodeJS.Timeout | null>(null);
  const onPointerOver = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPivotVisible(true);
  };
  const onPointerOut = () => {
    timer.current = setTimeout(() => {
      setPivotVisible(false);
    }, 5000);
  };

  return (
    <>
      {gltfUrl ? (
        // TODO: opacityで徐々に非表示になるようにする
        <PivotControls visible={controlVisible} depthTest={false}>
          <GeneratedObject
            gltfUrl={gltfUrl}
            scale={scale}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          />
          <Html position={[0, 1, 0]}>
            {controlVisible && (
              <PivotScaleForm onScaleUp={onScaleUp} onScaleDown={onScaleDown} />
            )}
          </Html>
        </PivotControls>
      ) : (
        <Html position={[0, 1, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>Task Status</h3>
            {error ? (
              <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
              <p>Status: {status || "Loading..."}</p>
            )}
            {progress !== undefined && <p>Progress: {progress}%</p>}
          </div>
        </Html>
      )}
    </>
  );
};
