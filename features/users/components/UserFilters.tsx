'use client';

import { Button, Input, Segmented, Space, Tooltip } from 'antd';
import {
  FiList,
  FiPlus,
  FiRefreshCw,
  FiShuffle,
  FiSearch,
} from 'react-icons/fi';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserListMode } from '@/features/users/types/user';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
  mode: UserListMode;
  onModeChange: (mode: UserListMode) => void;
  onOpenCreate: () => void;
};

export function UserFilters({
  search,
  onSearchChange,
  onRefresh,
  loading,
  mode,
  onModeChange,
  onOpenCreate,
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
        className="sm:max-w-xl"
      />
      <Space wrap>
        <Tooltip title="Liste modu">
          <Segmented
            value={mode}
            onChange={(val) => onModeChange(val as UserListMode)}
            options={[
              { value: 'pagination', label: <FiList /> },
              { value: 'infinite', label: <FiShuffle /> },
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
        <ThemeToggle />
        <Button type="primary" icon={<FiPlus />} onClick={onOpenCreate}>
          Yeni Kullanıcı
        </Button>
      </Space>
    </div>
  );
}

