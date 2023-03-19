import React, { useEffect, useRef, useState } from 'react'
import { Table, theme } from 'antd'
import type { TableProps } from 'antd'
import classNames from 'classnames'
import ResizeObserver from 'rc-resize-observer'
import { VariableSizeGrid as Grid } from 'react-window'
import { Inspector } from 'react-inspector'
import { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import styled from 'styled-components'

const VirtualTable = <RecordType extends { time: number }>(props: TableProps<RecordType>) => {
  const { columns, scroll } = props
  const [tableWidth, setTableWidth] = useState(0)
  const { token } = theme.useToken()

  const widthColumnCount = columns!.filter(({ width }) => !width).length
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    }
  })

  const gridRef = useRef<any>()
  const [connectObject] = useState<any>(() => {
    const obj = {}
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft
        }
        return null
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft })
        }
      },
    })

    return obj
  })

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    })
  }

  useEffect(() => resetVirtualGrid, [tableWidth])

  const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject
    const totalHeight = rawData.length * 54

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index]
          return totalHeight > scroll!.y! && index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number)
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        overscanRowCount={10}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft })
        }}
      >
        {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
          const rawDataItem = rawData[rowIndex] as any
          const columnData: any = mergedColumns[columnIndex]
          return (
            <div
              className={classNames('virtual-table-cell', {
                'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
              })}
              style={{
                ...style,
                boxSizing: 'border-box',
                padding: token.padding,
                borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                background: token.colorBgContainer,
              }}
            >
              {columnData.render
                ? columnData.render(rawDataItem[columnData.dataIndex], rawDataItem, rowIndex)
                : rawDataItem[columnData.dataIndex]}
            </div>
          )
        }}
      </Grid>
    )
  }

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width)
      }}
    >
      <Table
        {...props}
        size="small"
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        // components={{
        //   // @ts-ignore
        //   body: renderVirtualList,
        // }}
      />
    </ResizeObserver>
  )
}

const Console = <RecordType extends { time: number }>({ data }: { data: RecordType[] }) => {
  // Usage
  const columns: ColumnType<RecordType>[] = [
    {
      title: 'Time',
      dataIndex: 'time',
      width: 200,
      sorter: (a, b) => a.time - b.time,
      render: (value, record, index) => {
        return dayjs(value).format('DD, MMM HH:mm:ss.SSS')
      },
    },
    { title: 'Text', dataIndex: 'msg' },
    {
      title: 'payload',
      dataIndex: 'payload',
      render(value, record, index) {
        return (
          <InspectorItem>
            <Inspector data={value} table={false} />
          </InspectorItem>
        )
      },
    },
    // { title: 'F', dataIndex: 'key', width: 100 },
  ]

  return (
    <div style={{ flex: 1 }}>
      <VirtualTable
        columns={columns}
        dataSource={data}
        scroll={{
          x: '100vw',
          y: 500,
          scrollToFirstRowOnChange: true,
        }}
      />
    </div>
  )
}

export default Console

const InspectorItem = styled.div`
  /* & > ol > li[aria-expanded='false'] {
    padding: 5px;
  }
  & > ol > li[aria-expanded='true'] {
    position: absolute;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 5px;
    z-index: 10;
    background: white;
  } */
`
