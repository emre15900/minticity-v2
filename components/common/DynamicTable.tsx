'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
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

  const preparedColumns = useMemo(
    () =>
      visibleColumns.map((col) => ({
        ellipsis: true,
        ...col,
      })),
    [visibleColumns],
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <Space wrap>{toolbar}</Space>
        <Space className='flex items-center gap-2 justify-between w-full'>
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
                  <Checkbox
                    key={col.id}
                    checked={!hiddenIds.includes(col.id)}
                    disabled={col.lockVisibility}
                    onChange={(e) => toggleColumn(col.id, e.target.checked)}
                  >
                    {col.title as string}
                  </Checkbox>
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
          size={tableSize}
          rowKey={rowKey}
          columns={preparedColumns}
          dataSource={data}
          loading={loading}
          pagination={paginationProps}
          scroll={scroll}
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

