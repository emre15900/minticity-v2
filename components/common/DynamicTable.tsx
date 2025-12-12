'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Slider,
  Popover,
  Segmented,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tooltip,
} from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { motion } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiColumns,
  FiType,
} from 'react-icons/fi';
import { DynamicColumn, useDynamicColumns } from '@/lib/hooks/useDynamicColumns';

type DynamicTableProps<T> = {
  columns: DynamicColumn<T>[];
  data: T[];
  rowKey: TableProps<T>['rowKey'];
  loading?: boolean;
  pagination?: TablePaginationConfig | false;
  onChange?: TableProps<T>['onChange'];
  onRowClick?: (record: T) => void;
  toolbar?: React.ReactNode;
  storageKey?: string;
  scroll?: TableProps<T>['scroll'];
};

export function DynamicTable<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  pagination,
  onChange,
  onRowClick,
  toolbar,
  storageKey,
  scroll,
}: DynamicTableProps<T>) {
  const [tableSize, setTableSize] = useState<TableProps['size']>('middle');
  const { visibleColumns, hiddenIds, toggleColumn, resetColumns } =
    useDynamicColumns(columns, storageKey);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      columns.map((col) => [col.id, typeof col.width === 'number' ? col.width : 180]),
    ),
  );

  useEffect(() => {
    setColumnWidths((prev) => {
      const next = { ...prev };
      columns.forEach((col) => {
        if (next[col.id] === undefined) {
          next[col.id] = typeof col.width === 'number' ? col.width : 180;
        }
      });
      return next;
    });
  }, [columns]);

  const handleWidthChange = (id: string, value: number) => {
    setColumnWidths((prev) => ({ ...prev, [id]: Math.max(120, Math.min(420, value)) }));
  };

  const preparedColumns = useMemo(
    () =>
      visibleColumns.map((col) => ({
        ellipsis: true,
        width: columnWidths[col.id],
        key: col.id,
        ...col,
      })),
    [visibleColumns, columnWidths],
  );

  const totalWidth = useMemo(
    () =>
      preparedColumns.reduce((sum, col) => {
        const w = typeof col.width === 'number' ? col.width : 180;
        return sum + w;
      }, 0),
    [preparedColumns],
  );

  const paginationProps: PaginationProps | false = pagination
    ? {
        ...pagination,
        showSizeChanger: pagination.showSizeChanger ?? true,
        itemRender: (page, type, original) => {
          const wrapper = (icon: React.ReactNode) => (
            <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
          );
          if (type === 'prev') return wrapper(<FiChevronLeft />);
          if (type === 'next') return wrapper(<FiChevronRight />);
          return original;
        },
      }
    : false;

  return (
    <div className="themed-surface">
      <div className="themed-surface-header flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <Space wrap className="themed-toolbar">
          {toolbar}
        </Space>
        <Space className="flex w-full items-center justify-between gap-2">
          <Tooltip title="Yoğunluk">
            <Segmented
              size="small"
              value={tableSize}
              onChange={(val) => setTableSize(val as TableProps['size'])}
              options={[
                { value: 'small', label: <FiType className="mt-1" /> },
                { value: 'middle', label: 'M' },
                { value: 'large', label: 'L' },
              ]}
            />
          </Tooltip>

          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <div className="flex min-w-[220px] flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    Sütunlar
                  </span>
                  <Button type="link" size="small" onClick={resetColumns}>
                    Sıfırla
                  </Button>
                </div>
                <Divider className="my-1" />
                {columns.map((col) => (
                  <div key={col.id} className="flex flex-col gap-1">
                    <Checkbox
                      checked={!hiddenIds.includes(col.id)}
                      disabled={col.lockVisibility}
                      onChange={(e) => toggleColumn(col.id, e.target.checked)}
                    >
                      {col.title as string}
                    </Checkbox>
                    <Slider
                      min={120}
                      max={420}
                      value={columnWidths[col.id]}
                      onChange={(value) => handleWidthChange(col.id, value as number)}
                      disabled={col.lockVisibility}
                    />
                  </div>
                ))}
              </div>
            }
          >
            <Button icon={<FiColumns />} />
          </Popover>
        </Space>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Table<T>
          className="themed-table"
          size={tableSize}
          rowKey={rowKey}
          columns={preparedColumns}
          dataSource={data}
          loading={loading}
          pagination={paginationProps}
          scroll={
            scroll
              ? { ...scroll, x: scroll.x ?? totalWidth }
              : { x: totalWidth }
          }
          onChange={onChange}
          onRow={
            onRowClick
              ? (record) => ({
                  onClick: () => onRowClick(record),
                })
              : undefined
          }
        />
      </motion.div>
    </div>
  );
}

