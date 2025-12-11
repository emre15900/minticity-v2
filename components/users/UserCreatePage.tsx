'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { App, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { createUserThunk } from '@/lib/slices/usersSlice';
import { UserForm } from '@/components/users/UserForm';
import { mapFormValuesToPayload } from '@/lib/utils/userMapper';
import { UserFormValues } from '@/lib/types/users';

export function UserCreatePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { message } = App.useApp();
  const { creating } = useAppSelector((state) => state.users);

  const handleSubmit = useCallback(
    async (values: UserFormValues) => {
      const payload = mapFormValuesToPayload(values);
      const result = await dispatch(createUserThunk(payload));
      if (createUserThunk.fulfilled.match(result)) {
        message.success('Kullanıcı başarıyla eklendi');
        router.push('/');
      } else {
        message.error('Kullanıcı eklenirken hata oluştu');
      }
    },
    [dispatch, message, router],
  );

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10 space-y-3">
      <Typography.Title level={2} className="!mb-1">
        Yeni Kullanıcı Ekle
      </Typography.Title>
      <Typography.Text type="secondary">
        Bilgileri doldurup kaydettiğinizde listeye simüle olarak eklenecek.
      </Typography.Text>
      <UserForm submitting={creating} onSubmit={handleSubmit} submitText="Ekle" />
    </div>
  );
}

