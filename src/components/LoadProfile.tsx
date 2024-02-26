import { Button, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import React from "react";
import { RotateLoader } from "react-spinners";

const LoadProfile: React.FC<{
  onFileChange?: (file: RcFile) => void;
  loading?: boolean;
}> = ({ onFileChange, loading }) => {
  return (
    <Upload
      showUploadList={false}
      beforeUpload={(file) => {
        console.log("selected file", file);
        onFileChange?.(file);
      }}
    >
      <Button
        type="primary"
        size="large"
        style={{
          width: "150px",
          height: "80px",
        }}
      >
        {loading ? (
          <RotateLoader color="white" />
        ) : (
          <span
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Open
          </span>
        )}
      </Button>
    </Upload>
  );
};

export default LoadProfile;
