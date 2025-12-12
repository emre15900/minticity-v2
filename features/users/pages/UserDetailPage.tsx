'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, Skeleton, Space, Typography } from 'antd';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useUsersData } from '@/features/users/hooks/useUsersData';
import { mapFormValuesToPayload, mapUserToFormValues } from '@/features/users/models/userMapper';
import { UserForm } from '@/features/users/components/UserForm';
import { UserFormValues } from '@/features/users/types/user';
import { useLeaveConfirm } from '@/lib/hooks/useLeaveConfirm';
import { LeavePromptModal } from '@/features/users/components/LeavePromptModal';

export function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = useMemo(() => Number(params?.id), [params]);
  const router = useRouter();
  const { list, loading, error, fetchUserById, updateUser } = useUsersData();
  const [dirty, setDirty] = useState(false);
  const { open, confirmLeave, cancelLeave, requestLeave } = useLeaveConfirm({
    enabled: dirty,
  });

  const user = list.find((u) => u.id === userId);

  useEffect(() => {
    if (!Number.isFinite(userId)) {
      router.push('/');
      return;
    }
    if (!user) {
      fetchUserById(userId);
    }
  }, [fetchUserById, user, userId, router]);

  const handleSubmit = async (values: UserFormValues) => {
    if (!Number.isFinite(userId)) return;
    await updateUser(userId, mapFormValuesToPayload(values));
  };

  const handleBack = () => {
    if (dirty) {
      requestLeave(() => router.push('/'));
    } else {
      router.push('/');
    }
  };

  if (!Number.isFinite(userId)) {
    return null;
  }

  const renderContent = () => {
    if (!user && loading) {
      return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    if (!user && error) {
      return (
        <Alert
          type="error"
          showIcon
          title="Kullanıcı bulunamadı"
          description={error}
        />
      );
    }

    if (!user) {
      return (
        <Alert
          type="warning"
          showIcon
          title="Kullanıcı bulunamadı"
          description="Bu ID ile kayıtlı kullanıcı yok."
        />
      );
    }

    return (
      <UserForm
        initialValues={mapUserToFormValues(user)}
        onSubmit={handleSubmit}
        submitText="Güncelle"
        onDirtyChange={setDirty}
        footer={
          <Typography.Text type="secondary">

          </Typography.Text>
        }
      />
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10 space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Space size="middle" align="center">
          <div>
            <Button icon={<FiArrowLeft />} onClick={handleBack} className='border-solid border-1 border-slate-300 rounded-full p-3 mb-2' type="text">
              Listeye dön
            </Button>
            <Typography.Title level={2} className="!mb-1">
              Kullanıcı Detayı
            </Typography.Title>
            <Typography.Text type="secondary">
              ID: {userId} kullanıcısının bilgileri
            </Typography.Text>
          </div>
        </Space>
      </motion.div>
      {renderContent()}

      <LeavePromptModal
        open={open}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}

