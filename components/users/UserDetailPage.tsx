'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { App, Alert, Button, Skeleton, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  fetchUserByIdThunk,
  upsertUser,
} from '@/lib/slices/usersSlice';
import { mapFormValuesToPayload, mapUserToFormValues } from '@/lib/utils/userMapper';
import { UserForm } from '@/components/users/UserForm';
import { UserFormValues } from '@/lib/types/users';

export function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = useMemo(() => Number(params?.id), [params]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const { list, loading, error } = useAppSelector((state) => state.users);
  const user = list.find((u) => u.id === userId);

  useEffect(() => {
    if (!Number.isFinite(userId)) {
      router.push('/');
      return;
    }
    if (!user) {
      dispatch(fetchUserByIdThunk(userId));
    }
  }, [dispatch, user, userId, router]);

  const handleSubmit = async (values: UserFormValues) => {
    if (!Number.isFinite(userId)) return;
    const payload = {
      ...mapFormValuesToPayload(values),
      id: userId,
    };
    dispatch(upsertUser(payload));
    message.success('Bilgiler güncellendi (simülasyon)');
  };

  if (!Number.isFinite(userId)) {
    return null;
  }

  const content = () => {
    if (!user && loading) {
      return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    if (!user && error) {
      return (
        <Alert
          type="error"
          showIcon
          message="Kullanıcı bulunamadı"
          description={error}
        />
      );
    }

    if (!user) {
      return (
        <Alert
          type="warning"
          showIcon
          message="Kullanıcı bulunamadı"
          description="Bu ID ile kayıtlı kullanıcı yok."
        />
      );
    }

    return (
      <UserForm
        initialValues={mapUserToFormValues(user)}
        onSubmit={handleSubmit}
        submitText="Güncelle"
        footer={
          <Typography.Text type="secondary">
            Güncelleme işlemi front-end tarafında simüle edilir.
          </Typography.Text>
        }
      />
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10 space-y-3">
      <Space size="middle" align="center">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
          type="text"
        >
          Listeye dön
        </Button>
        <div>
          <Typography.Title level={2} className="!mb-1">
            Kullanıcı Detayı
          </Typography.Title>
          <Typography.Text type="secondary">
            ID: {userId} kullanıcısının bilgileri
          </Typography.Text>
        </div>
      </Space>
      {content()}
    </div>
  );
}

