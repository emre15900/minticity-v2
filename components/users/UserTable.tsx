'use client';

import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { User } from '@/lib/types/users';

type UserTableProps = {
  users: User[];
  loading?: boolean;
  deletingIds?: number[];
  pagination: TablePaginationConfig;
  onChangePage: (page: number, pageSize: number) => void;
  onView: (userId: number) => void;
  onDelete: (userId: number) => void;
};

export function UserTable({
  users,
  loading,
  deletingIds = [],
  pagination,
  onChangePage,
  onView,
  onDelete,
}: UserTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value: string, record) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Text type="secondary">{record.username}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
      render: (value: string) => (
        <Typography.Link href={`mailto:${value}`}>{value}</Typography.Link>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Şirket',
      dataIndex: ['company', 'name'],
      key: 'company',
      render: (value: string | undefined) =>
        value ? <Tag color="blue">{value}</Tag> : '—',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => {
        const isDeleting = deletingIds.includes(record.id);
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => onView(record.id)}
              size="small"
            >
              Detay
            </Button>
            <Popconfirm
              title="Kullanıcıyı sil"
              description={`${record.name} kullanıcısını silmek istediğinize emin misiniz?`}
              okText="Sil"
              cancelText="Vazgeç"
              onConfirm={() => onDelete(record.id)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                size="small"
              >
                Sil
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<User>
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={users}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `${total} kullanıcı`,
      }}
      onChange={(pager) => onChangePage(pager.current || 1, pager.pageSize || 10)}
      scroll={{ x: true }}
    />
  );
}

