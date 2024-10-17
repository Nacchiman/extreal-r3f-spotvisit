import { Button } from "antd";

export type PivotScaleFormProps = {
  onScaleUp: () => void;
  onScaleDown: () => void;
};

export const PivotScaleForm = ({
  onScaleUp,
  onScaleDown,
}: PivotScaleFormProps) => {
  return (
    <div>
      <Button onClick={onScaleUp}>Scale Up</Button>
      <Button onClick={onScaleDown}>Scale Down</Button>
    </div>
  );
};
