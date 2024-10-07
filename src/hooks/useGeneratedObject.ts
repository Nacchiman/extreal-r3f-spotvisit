import axios from "axios";
import { useCallback, useState } from "react";

export const useGeneratedObject = () => {
  const lambdaEndpoint = import.meta.env.VITE_GENERATE_OBJECT_LAMBDA_ENDPOINT;
  const statusEndpoint = import.meta.env.VITE_GET_TASK_STATUS_LAMBDA_ENDPOINT;

  const [status, setStatus] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [gltfUrl, setGltfUrl] = useState<string | undefined>(undefined);

  // TODO: ファイルをアップロードする関数を定義する

  const pollTaskStatus = useCallback(
    (taskId: string) => {
      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${statusEndpoint}?task_id=${taskId}`,
          );
          const { status, progress, output } = statusResponse.data.data;
          setStatus(status);
          setProgress(progress);

          if (status === "success" && output?.model) {
            setGltfUrl(output.model);
            clearInterval(interval);
          } else if (["failed", "cancelled", "unknown"].includes(status)) {
            setError(`Task ${status}. Please report task_id: ${taskId}`);
            clearInterval(interval);
          }
        } catch (statusError) {
          console.error("Error fetching task status:", statusError);
          setError("Error fetching task status");
          clearInterval(interval);
        }
      }, 5000);
    },
    [statusEndpoint],
  );

  const fetchObject = useCallback(
    async (
      type: "text_to_model" | "image_to_model",
      prompt?: string,
      fileType?: string,
      fileToken?: string,
    ): Promise<void> => {
      try {
        const response = await axios.post(
          lambdaEndpoint,
          {
            type,
            prompt,
            file: {
              file_type: fileType,
              file_token: fileToken,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const taskId = response.data.data.task_id;
        if (!taskId) {
          throw new Error("Task ID is undefined.");
        }
        setStatus("queued");
        setProgress(0);
        pollTaskStatus(taskId);
      } catch (error) {
        console.error("Error fetching object from Lambda:", error);
        setError("Failed to fetch object.");
      }
    },
    [lambdaEndpoint, pollTaskStatus],
  );

  const fetchTextObject = useCallback(
    async (prompt: string): Promise<void> => {
      await fetchObject("text_to_model", prompt);
    },
    [fetchObject],
  );

  const fetchImageObject = useCallback(
    async (fileType: string, fileToken: string): Promise<void> => {
      await fetchObject("image_to_model", undefined, fileType, fileToken);
    },
    [fetchObject],
  );

  return {
    fetchTextObject,
    fetchImageObject,
    status,
    progress,
    error,
    gltfUrl,
  };
};
