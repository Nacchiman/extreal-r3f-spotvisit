import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload, UploadProps } from "antd";
import { RcFile } from "antd/es/upload/interface";
import { useState } from "react";

export interface ImageToObjectFormProps {
  uploadImage: (file: File) => Promise<string>;
  fetchObject: (fileType: string, fileToken: string) => Promise<void>;
}

export const ImageToObjectForm = (props: ImageToObjectFormProps) => {
  const { uploadImage, fetchObject } = props;
  const [file, setFile] = useState<RcFile | undefined>(undefined);
  const [fileToken, setFileToken] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    if (!file || !fileToken) {
      message.error("Please upload a file first.");
      return;
    }

    try {
      await fetchObject(file.name, fileToken);
      message.success("Object fetched successfully!");
    } catch (error) {
      message.error("Failed to fetch object.");
    }
  };

  const uploadAction = async (file: RcFile) => {
    try {
      return uploadImage(file);
    } catch (error) {
      message.error(`Failed to upload file: ${error}`);
      throw error;
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    action: uploadAction,
    accept: ".jpg,.jpeg,.png",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setFileToken(info.file.response.file_token);
        setFile(info.file.originFileObj);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div style={{ position: "absolute", top: 150, left: 10, zIndex: 1000 }}>
      <Form layout="inline" onFinish={handleSubmit}>
        <Form.Item>
          <Upload {...uploadProps}>
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
