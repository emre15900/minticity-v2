'use client';

import { Button, Input, Segmented, Space, Tooltip } from 'antd';
import {
  FiFilter,
  FiList,
  FiPlus,
  FiRefreshCw,
  FiShuffle,
  FiSearch,
} from 'react-icons/fi';
import { UserListMode } from '@/features/users/types/user';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
  mode: UserListMode;
  onModeChange: (mode: UserListMode) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
};

export function UserFilters({
  search,
  onSearchChange,
  onRefresh,
  loading,
  mode,
  onModeChange,
  onOpenCreate,
  onResetFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        allowClear
        size="large"
        prefix={<FiSearch />}
        placeholder="İsim, kullanıcı adı veya e-posta ara"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xl search-input"
      />
      <Space wrap>
        <Tooltip title="Liste modu">
          <Segmented
            value={mode}
            onChange={(val) => onModeChange(val as UserListMode)}
            options={[
              {
                value: 'pagination',
                label: (
                  <span className="flex h-6 w-6 items-center justify-center">
                    <FiList />
                  </span>
                ),
              },
              {
                value: 'infinite',
                label: (
                  <span className="flex h-6 w-6 items-center justify-center">
                    <FiShuffle />
                  </span>
                ),
              },
            ]}
          />
        </Tooltip>
        <Tooltip title="Listeyi yenile">
          <Button
            icon={<FiRefreshCw />}
            onClick={onRefresh}
            loading={loading}
            type="default"
          />
        </Tooltip>
        <Tooltip title="Filtreleri temizle">
          <Button
            icon={<FiFilter />}
            onClick={onResetFilters}
            type="default"
          />
        </Tooltip>
        <Button type="primary" icon={<FiPlus />} onClick={onOpenCreate}>
          Yeni Kullanıcı
        </Button>
      </Space>
    </div>
  );
}

