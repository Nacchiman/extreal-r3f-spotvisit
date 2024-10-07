import { Button, Form, Input, message } from "antd";
import { useState } from "react";

export interface TextToObjectFormProps {
  fetchObject: (prompt: string) => Promise<void>;
}

export const TextToObjectForm = (props: TextToObjectFormProps) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = async () => {
    if (!prompt) {
      message.error("Please enter a prompt.");
      return;
    }

    try {
      await props.fetchObject(prompt);
      message.success("Object fetched successfully!");
    } catch (error) {
      message.error("Failed to fetch object.");
    }
  };

  return (
    <div style={{ position: "absolute", top: 100, left: 10, zIndex: 1000 }}>
      <Form layout="inline" onFinish={handleSubmit}>
        <Form.Item>
          <Input
            placeholder="Enter text prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
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
