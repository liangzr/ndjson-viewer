import { Button, Card } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import styled from 'styled-components'

const Filter: React.FC<{
  value: string
  onChange?: (value: string) => void
}> = ({ value, onChange }) => {
  return (
    <FilterCard>
      <div>
        <QuickInsertButton text="include:" onClick={(insert) => onChange?.((value.trim() + insert).trim())} />
        <QuickInsertButton text="exclude:" onClick={(insert) => onChange?.((value.trim() + insert).trim())} />
      </div>
      <TextArea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="search with include:, exclude:, and text, separate with newline."
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </FilterCard>
  )
}

export default Filter

const QuickInsertButton = ({ text, onClick }: { text: string; onClick?: (key: string) => void }) => {
  return (
    <Button
      size="small"
      type="link"
      onClick={() => {
        onClick?.('\n' + text)
      }}
    >
      {text}
    </Button>
  )
}

const FilterCard = styled(Card)``
