'use client';

import { useMemo } from 'react';
import { Button, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import {
  FiEdit2,
  FiEye,
  FiExternalLink,
  FiTrash2,
} from 'react-icons/fi';
import { DynamicTable } from '@/components/common/DynamicTable';
import { DynamicColumn } from '@/lib/hooks/useDynamicColumns';
import { User } from '@/features/users/types/user';
import { UserAvatar } from '@/features/users/components/UserAvatar';

type Props = {
  users: User[];
  loading?: boolean;
  deletingIds?: number[];
  pagination?: TablePaginationConfig | false;
  onChange?: TableProps<User>['onChange'];
  onPreview: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDetail: (user: User) => void;
};

export function UserTable({
  users,
  loading,
  deletingIds = [],
  pagination,
  onChange,
  onPreview,
  onEdit,
  onDelete,
  onDetail,
}: Props) {
  const companyFilters = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.company?.name).filter(Boolean) as string[]),
      ).map((name) => ({ text: name, value: name })),
    [users],
  );

  const columns: DynamicColumn<User>[] = useMemo(
    () => [
      {
        id: 'name',
        title: 'Ad Soyad',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, record) => (
          <Space>
            <UserAvatar name={record.name} avatarUrl={record.avatarUrl} />
            <div>
              <Typography.Text strong className="block">
                {record.name || '-'}
              </Typography.Text>
              <Typography.Text type="secondary">
                @{record.username || '-'}
              </Typography.Text>
            </div>
          </Space>
        ),
      },
      {
        id: 'email',
        title: 'E-posta',
        dataIndex: 'email',
        filters: [
          { text: 'gmail', value: 'gmail' },
          { text: 'yahoo', value: 'yahoo' },
        ],
        onFilter: (val, record) =>
          record.email?.toLowerCase().includes(String(val).toLowerCase()),
        render: (value: string) =>
          value ? (
            <Typography.Link href={`mailto:${value}`}>{value}</Typography.Link>
          ) : (
            '-'
          ),
      },
      {
        id: 'phone',
        title: 'Telefon',
        dataIndex: 'phone',
        render: (value: string) =>
          value ? <a href={`tel:${value}`}>{value}</a> : '-',
      },
      {
        id: 'company',
        title: 'Şirket',
        dataIndex: ['company', 'name'],
        filters: companyFilters,
        onFilter: (val, record) =>
          (record.company?.name || '').toLowerCase() ===
          String(val).toLowerCase(),
        render: (value: string | undefined) =>
          value ? <Tag color="blue">{value}</Tag> : '-',
      },
      {
        id: 'website',
        title: 'Website',
        dataIndex: 'website',
        render: (value: string | undefined) =>
          value ? (
            <Typography.Link href={`https://${value}`} target="_blank">
              {value}
            </Typography.Link>
          ) : (
            '-'
          ),
      },
      {
        id: 'actions',
        title: 'İşlemler',
        key: 'actions',
        lockVisibility: true,
        fixed: 'right',
        width: 137,
        render: (_, record) => {
          const deleting = deletingIds.includes(record.id);
          return (
            <Space>
              <Tooltip title="Önizleme">
                <Button
                  size="small"
                  icon={<FiEye />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(record);
                  }}
                />
              </Tooltip>
              <Tooltip title="Düzenle">
                <Button
                  size="small"
                  icon={<FiEdit2 />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                />
              </Tooltip>
              <Tooltip title="Detay sayfası">
                <Button
                  size="small"
                  icon={<FiExternalLink />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetail(record);
                  }}
                />
              </Tooltip>
              <Popconfirm
                title="Silme onayı"
                description={`${record.name} kullanıcısını silmek istediğinize emin misiniz?`}
                okText="Sil"
                cancelText="Vazgeç"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDelete(record);
                }}
              >
                <Tooltip title="Sil">
                  <Button
                    danger
                    size="small"
                    loading={deleting}
                    icon={<FiTrash2 />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [companyFilters, deletingIds, onDetail, onDelete, onEdit, onPreview],
  );

  return (
    <DynamicTable<User>
      columns={columns}
      data={users}
      loading={loading}
      rowKey={(record) => record.id}
      pagination={pagination}
      onChange={onChange}
      onRowClick={onDetail}
      storageKey="users-table"
      scroll={{ x: 1100 }}
    />
  );
}

