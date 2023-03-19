import { Card, Descriptions, Upload } from 'antd'
import { RcFile } from 'antd/es/upload'
import React from 'react'
import styled from 'styled-components'

const LoadProfile: React.FC<{
  onFileChange?: (file: RcFile) => void
}> = ({ onFileChange }) => {
  const [file, setFile] = React.useState<RcFile>()

  return (
    <LoadProfileCard
      bordered
      title="Load Profile"
      extra={
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            setFile(file)
            onFileChange?.(file)
          }}
        >
          <SelectFileLink>Select...</SelectFileLink>
        </Upload>
      }
    >
      {file && (
        <SelectedFile layout="horizontal">
          <Descriptions.Item label="File Name">{file.name}</Descriptions.Item>
          <Descriptions.Item label="File Size">{file.size}</Descriptions.Item>
          <Descriptions.Item label="Last Modified">{new Date(file.lastModified).toLocaleString()}</Descriptions.Item>
        </SelectedFile>
      )}
    </LoadProfileCard>
  )
}

export default LoadProfile

const LoadProfileCard = styled(Card)`
  padding: 10px;
  cursor: pointer;
  user-select: none;
`

const SelectFileLink = styled.span`
  color: blue;
`

const SelectedFile = styled(Descriptions)`
  td {
    padding-bottom: 0 !important;
  }
`
