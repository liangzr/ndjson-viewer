import React, { useEffect, useRef, useState } from 'react'
import { Table, theme } from 'antd'
import type { TableProps } from 'antd'
import classNames from 'classnames'
import { VariableSizeGrid as Grid } from "react-window";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import styled from "styled-components";
import { useMeasure, useWindowSize } from "react-use";

const VirtualTable = <RecordType extends { time: number }>(
  props: TableProps<RecordType> & {
    onRowClick?: (record: RecordType) => void;
  }
) => {
  const { columns, scroll, onRowClick } = props;
  const { token } = theme.useToken();
  const { width: tableWidth } = useWindowSize();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  const widthColumnCount = columns!.filter(({ width }) => !width).length;
  const mergedColumns = columns!.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (
    rawData: object[],
    { scrollbarSize, ref, onScroll }: any
  ) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll!.y! && index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        overscanRowCount={10}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => {
          const rawDataItem = rawData[rowIndex] as any;
          const columnData: any = mergedColumns[columnIndex];
          return (
            <div
              className={classNames("virtual-table-cell", {
                "virtual-table-cell-last":
                  columnIndex === mergedColumns.length - 1,
              })}
              onClick={() => {
                onRowClick?.(rawDataItem);
                setSelectedRowIndex(rowIndex);
              }}
              style={{
                ...style,
                boxSizing: "border-box",
                padding: token.padding,
                borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
                background:
                  selectedRowIndex === rowIndex
                    ? token.colorBgElevated
                    : token.colorBgContainer,
              }}
            >
              {columnData.render
                ? columnData.render(
                    rawDataItem[columnData.dataIndex],
                    rawDataItem,
                    rowIndex
                  )
                : rawDataItem[columnData.dataIndex]}
            </div>
          );
        }}
      </Grid>
    );
  };

  return (
    <Table
      {...props}
      size="small"
      className="virtual-table"
      columns={mergedColumns}
      pagination={false}
      components={{
        // @ts-ignore
        body: renderVirtualList,
      }}
    />
  );
};

const Console = <RecordType extends { time: number }>({
  data,
  onRowClick,
}: {
  data: RecordType[];
  onRowClick?: (record: RecordType) => void;
}) => {
  // Usage
  const columns: ColumnType<RecordType>[] = [
    {
      title: "Time",
      dataIndex: "time",
      width: 200,
      sorter: (a, b) => a.time - b.time,
      sortOrder: "descend",
      render: (value, record, index) => {
        return dayjs(value).format("DD, MMM HH:mm:ss.SSS");
      },
    },
    { title: "Message", dataIndex: "msg" },
  ];

  const [tableAreaRef, { height: tableHeight }] = useMeasure();

  return (
    <div
      // @ts-ignore
      ref={tableAreaRef}
      style={{
        flex: 1,
        flexShrink: 0,
        overflowY: "hidden",
      }}
    >
      <VirtualTable
        bordered
        size="small"
        columns={columns}
        dataSource={data}
        onRowClick={onRowClick}
        scroll={{
          x: "100vw",
          y: tableHeight,
          scrollToFirstRowOnChange: true,
        }}
      />
    </div>
  );
};

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
