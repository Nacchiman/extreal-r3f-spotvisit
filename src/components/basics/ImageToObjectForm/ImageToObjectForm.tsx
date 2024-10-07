import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload } from "antd";
import axios from "axios";
import { useState } from "react";

export interface ImageToObjectFormProps {
  fetchObject: (file: {
    file_type: string;
    file_token: string;
  }) => Promise<void>;
}

export const ImageToObjectForm = (props: ImageToObjectFormProps) => {
  const [fileToken, setFileToken] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload-endpoint", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileToken(response.data.file_token);
      message.success("File uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload file.");
    }
  };

  const handleSubmit = async () => {
    if (!fileToken) {
      message.error("Please upload a file first.");
      return;
    }

    const requestData = {
      //拡張子
      file_type: file.type,
      file_token: fileToken,
    };

    try {
      await props.fetchObject(requestData);
      message.success("Object fetched successfully!");
    } catch (error) {
      message.error("Failed to fetch object.");
    }
  };

  return (
    <div style={{ position: "absolute", top: 150, left: 10, zIndex: 1000 }}>
      <Form layout="inline" onFinish={handleSubmit}>
        <Form.Item>
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // Prevent automatic upload
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            送信
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
