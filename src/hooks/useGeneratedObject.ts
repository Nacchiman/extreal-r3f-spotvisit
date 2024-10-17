import axios from "axios";
import { useCallback, useState } from "react";

type TaskData = {
  status?: string;
  progress?: number;
  error?: string;
  gltfUrl?: string;
};

export const useGeneratedObject = () => {
  const lambdaEndpoint = import.meta.env.VITE_GENERATE_OBJECT_LAMBDA_ENDPOINT;
  const statusEndpoint = import.meta.env.VITE_GET_TASK_STATUS_LAMBDA_ENDPOINT;
  // const uploadLambdaEndpoint = import.meta.env
  //   .VITE_UPLOAD_IMAGE_LAMBDA_ENDPOINT;

  const [taskMap, setTaskMap] = useState<Map<string, TaskData>>(new Map());

  const pollTaskStatus = useCallback(
    (taskId: string, prompt: string) => {
      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${statusEndpoint}?task_id=${taskId}`,
          );
          const { status, progress, output } = statusResponse.data.data;

          setTaskMap((prev) => {
            const currentData = prev.get(prompt) || {};
            return new Map(prev).set(prompt, {
              ...currentData,
              status,
              progress,
            });
          });

          if (status === "success" && output?.model) {
            setTaskMap((prev) => {
              const currentData = prev.get(prompt) || {};
              return new Map(prev).set(prompt, {
                ...currentData,
                gltfUrl: output.model,
              });
            });
            clearInterval(interval);
          } else if (["failed", "cancelled", "unknown"].includes(status)) {
            setTaskMap((prev) => {
              const currentData = prev.get(prompt) || {};
              return new Map(prev).set(prompt, {
                ...currentData,
                error: `Task ${status}. Please report task_id: ${taskId}`,
              });
            });
            clearInterval(interval);
          }
        } catch (statusError) {
          console.error("Error fetching task status:", statusError);
          setTaskMap((prev) => {
            const currentData = prev.get(prompt) || {};
            return new Map(prev).set(prompt, {
              ...currentData,
              error: "Error fetching task status",
            });
          });
          clearInterval(interval);
        }
      }, 5000);
    },
    [statusEndpoint],
  );

  // const uploadImage = useCallback(
  //   async (file: File): Promise<string> => {
  //     // 画像データをArrayBufferとして読み込む
  //     const reader = new FileReader();
  //     reader.readAsArrayBuffer(file);
  //     const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
  //       reader.onload = () => resolve(reader.result as ArrayBuffer);
  //       reader.onerror = () => reject(new Error("Failed to read file"));
  //     });

  //     // ファイルの拡張子に基づいてContent-Typeを設定
  //     const fileType = file.type;
  //     if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
  //       message.error(
  //         "Unsupported file type. Please upload a JPEG or PNG image.",
  //       );
  //       throw new Error("Unsupported file type.");
  //     }

  //     // 画像データをリクエストボディに直接入れる
  //     const response = await axios.post(
  //       uploadLambdaEndpoint,
  //       new Blob([fileData], { type: fileType }),
  //       {s
  //         headers: {
  //           "Content-Type": fileType,
  //         },
  //       },
  //     );

  //     if (response.status !== 200) {
  //       throw new Error(`Error uploading image: ${response.data.error}`);
  //     }

  //     return response.data.image_token;
  //   },
  //   [uploadLambdaEndpoint],
  // );

  const fetchObject = useCallback(
    async (
      type: "text_to_model" | "image_to_model",
      prompt: string,
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
        setTaskMap((prev) => {
          const currentData = prev.get(prompt) || {};
          return new Map(prev).set(prompt, {
            ...currentData,
            status: "queued",
            progress: 0,
          });
        });
        pollTaskStatus(taskId, prompt);
      } catch (error) {
        console.error("Error fetching object from Lambda:", error);
        setTaskMap((prev) => {
          const currentData = prev.get(prompt) || {};
          return new Map(prev).set(prompt, {
            ...currentData,
            error: "Failed to fetch object.",
          });
        });
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

  // const fetchImageObject = useCallback(
  //   async (fileType: string, fileToken: string): Promise<void> => {
  //     await fetchObject("image_to_model", undefined, fileType, fileToken);
  //   },
  //   [fetchObject],
  // );

  return {
    // uploadImage,
    fetchTextObject,
    // fetchImageObject,
    taskMap, // 一つのMapとして返す
  };
};
