import TextArea from "antd/es/input/TextArea";
import React from "react";

const Filter: React.FC<{
  value: string;
  onChange?: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <TextArea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="condition1 with comma, separate matches with newline."
      rows={3}
      style={{
        resize: "none",
      }}
    />
  );
};

export default Filter;
