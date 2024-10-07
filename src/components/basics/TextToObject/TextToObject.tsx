import { Html } from "@react-three/drei";
import React from "react";
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
  return (
    <>
      {gltfUrl ? (
        <GeneratedObject gltfUrl={gltfUrl} />
      ) : (
        <Html
          occlude="blending"
          transform
          position={[0, 1, 0]}
          style={{ pointerEvents: "none" }}
        >
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
