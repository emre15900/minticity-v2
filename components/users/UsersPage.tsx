'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Alert, Button, Card, Flex, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  deleteUserThunk,
  fetchUsersThunk,
} from '@/lib/slices/usersSlice';
import { UserFilters } from '@/components/users/UserFilters';
import { UserTable } from '@/components/users/UserTable';

const PAGE_SIZE_DEFAULT = 6;

export function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { message } = App.useApp();
  const { list, loading, deletingIds, error } = useAppSelector(
    (state) => state.users,
  );

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const filtered = useMemo(() => {
    if (!search) return list;
    const lower = search.toLowerCase();
    return list.filter((user) =>
      [user.name, user.username, user.email, user.phone, user.company?.name]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(lower)),
    );
  }, [list, search]);

  useEffect(() => {
    if (!list.length) {
      dispatch(fetchUsersThunk());
    }
  }, [dispatch, list.length]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filtered.length, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteUserThunk(id));
    if (deleteUserThunk.fulfilled.match(result)) {
      message.success('Kullanıcı listeden kaldırıldı.');
    } else {
      message.error('Silme işlemi başarısız.');
    }
  };

  const handleView = (id: number) => {
    router.push(`/users/${id}`);
  };

  const handleRefresh = () => {
    dispatch(fetchUsersThunk());
  };

  const handlePageChange = (current: number, nextPageSize: number) => {
    setPage(current);
    setPageSize(nextPageSize);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-6 md:p-10">
      <Flex align="center" justify="space-between" wrap="wrap" gap={8}>
        <div>
          <Typography.Title level={2} className="!mb-1">
            Mini Kullanıcı Paneli
          </Typography.Title>
          <Typography.Text type="secondary">
            JSONPlaceholder API üzerinden kullanıcı yönetimi
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push('/new')}
        >
          Yeni Kullanıcı Ekle
        </Button>
      </Flex>

      <Card>
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          onRefresh={handleRefresh}
          loading={loading}
        />
        {error && (
          <Alert
            className="mt-3"
            type="error"
            message="Veri çekilirken bir sorun oluştu."
            description={error}
            showIcon
          />
        )}
        <div className="mt-4">
          <UserTable
            users={pagedData}
            loading={loading}
            deletingIds={deletingIds}
            pagination={{
              current: page,
              pageSize,
              total: filtered.length,
            }}
            onChangePage={handlePageChange}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>
      </Card>
    </div>
  );
}

