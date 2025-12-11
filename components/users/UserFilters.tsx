'use client';

import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Tooltip } from 'antd';

type UserFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
};

export function UserFilters({
  search,
  onSearchChange,
  onRefresh,
  loading,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Input
        allowClear
        size="large"
        prefix={<SearchOutlined />}
        placeholder="İsim, kullanıcı adı veya e-posta ara"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xl"
      />
      <Space>
        <Tooltip title="Listeyi yenile">
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          >
            Yenile
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
}

