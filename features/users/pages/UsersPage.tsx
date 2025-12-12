'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Card, Grid, Skeleton, Space, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useUsersData } from '@/features/users/hooks/useUsersData';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { UserFilters } from '@/features/users/components/UserFilters';
import { UserTable } from '@/features/users/components/UserTable';
import { MobileUserList } from '@/features/users/components/MobileUserList';
import { UserPreviewModal } from '@/features/users/components/UserPreviewModal';
import { UserCreateModal } from '@/features/users/components/UserCreateModal';
import { UserEditModal } from '@/features/users/components/UserEditModal';
import { mapFormValuesToPayload } from '@/features/users/models/userMapper';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import {
  User,
  UserFormValues,
  UserListMode,
} from '@/features/users/types/user';

const PAGE_SIZE_DEFAULT = 6;

export function UsersPage() {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const {
    list,
    loading,
    creating,
    updating,
    deletingIds,
    error,
    refresh,
    createUser,
    updateUser,
    removeUser,
  } = useUsersData();

  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<UserListMode>('pagination');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [createOpen, setCreateOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<User | undefined>();
  const [editUser, setEditUser] = useState<User | undefined>();

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!list.length) {
      refresh();
    }
  }, [list.length, refresh]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return list;
    const lower = debouncedSearch.toLowerCase();
    return list.filter((user) =>
      [user.name, user.username, user.email, user.phone, user.company?.name]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(lower)),
    );
  }, [list, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [mode]);

  const { visibleItems, hasMore, loadingMore, loadMoreRef, reset } =
    useInfiniteScroll(filtered, {
      batchSize: pageSize,
      enabled: mode === 'infinite',
    });

  useEffect(() => {
    if (mode === 'infinite') {
      reset();
    }
  }, [mode, reset, filtered, pageSize]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const dataForView = mode === 'infinite' ? visibleItems : pagedData;

  const paginationConfig =
    mode === 'pagination'
      ? {
          current: page,
          pageSize,
          total: filtered.length,
          showTotal: (total: number) => `${total} kullanıcı`,
          onChange: (current: number, size: number) => {
            setPage(current);
            setPageSize(size);
          },
        }
      : false;

  const handleCreate = async (values: UserFormValues) => {
    const payload = mapFormValuesToPayload(values);
    const result = await createUser(payload);
    if (result.meta?.requestStatus === 'fulfilled') {
      setCreateOpen(false);
    }
  };

  const handleUpdate = async (values: UserFormValues) => {
    if (!editUser) return;
    const payload = mapFormValuesToPayload(values);
    const result = await updateUser(editUser.id, payload);
    if (result.meta?.requestStatus === 'fulfilled') {
      setEditUser(undefined);
    }
  };

  const handleDelete = (user: User) => {
    removeUser(user.id);
  };

  const handleDetail = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handlePreview = (user: User) => {
    setPreviewUser(user);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const isInitialLoading = loading && !list.length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Space align="center" className="justify-between w-full" wrap>
          <div>
            <Typography.Title level={2} className="!mb-1">
              Mini Kullanıcı Paneli
            </Typography.Title>
            <Typography.Text type="secondary">
              JSONPlaceholder API üzerinden kullanıcı yönetimi
            </Typography.Text>
          </div>
        </Space>
      </motion.div>

      <Card className="card-like">
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          onRefresh={refresh}
          loading={loading}
          mode={mode}
          onModeChange={setMode}
          onOpenCreate={() => setCreateOpen(true)}
          onResetFilters={() => {
            setSearch('');
            setMode('pagination');
            setPage(1);
            setPageSize(PAGE_SIZE_DEFAULT);
            reset();
          }}
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
          {isInitialLoading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : isMobile ? (
            <>
              <MobileUserList
                users={dataForView}
                deletingIds={deletingIds}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDetail={handleDetail}
              />
              {mode === 'infinite' && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  {loadingMore && <Skeleton active paragraph={{ rows: 1 }} />}
                  {hasMore ? (
                    <div ref={loadMoreRef} className="h-10" />
                  ) : (
                    <Typography.Text type="secondary">
                      Liste sonuna ulaşıldı
                    </Typography.Text>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <UserTable
                users={dataForView}
                loading={loading}
                deletingIds={deletingIds}
                pagination={paginationConfig}
                onChange={(pagination) => {
                  if (pagination.current) setPage(pagination.current);
                  if (pagination.pageSize) setPageSize(pagination.pageSize);
                }}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDetail={handleDetail}
              />
            </>
          )}
          {mode === 'infinite' && !isMobile && (
            <div className="mt-3 flex flex-col items-center gap-2">
              {loadingMore && <Skeleton active paragraph={{ rows: 1 }} />}
              {hasMore ? (
                <div ref={loadMoreRef} className="h-10" />
              ) : (
                <Typography.Text type="secondary">
                  Liste sonuna ulaşıldı
                </Typography.Text>
              )}
            </div>
          )}
        </div>
      </Card>

      <UserCreateModal
        open={createOpen}
        submitting={creating}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
      />

      <UserPreviewModal
        open={!!previewUser}
        user={previewUser}
        onClose={() => setPreviewUser(undefined)}
      />

      <UserEditModal
        open={!!editUser}
        user={editUser}
        submitting={updating}
        onSubmit={handleUpdate}
        onClose={() => setEditUser(undefined)}
      />
    </div>
  );
}

