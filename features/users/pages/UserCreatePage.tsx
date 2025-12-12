'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { useUsersData } from '@/features/users/hooks/useUsersData';
import { UserForm } from '@/features/users/components/UserForm';
import { emptyUserFormValues } from '@/features/users/models/defaults';
import { mapFormValuesToPayload } from '@/features/users/models/userMapper';
import { useLeaveConfirm } from '@/lib/hooks/useLeaveConfirm';
import { LeavePromptModal } from '@/features/users/components/LeavePromptModal';
import { UserFormValues } from '@/features/users/types/user';

export function UserCreatePage() {
  const router = useRouter();
  const { createUser, creating } = useUsersData();
  const [dirty, setDirty] = useState(false);
  const { open, confirmLeave, cancelLeave } = useLeaveConfirm({
    enabled: dirty,
  });

  const handleSubmit = async (values: UserFormValues) => {
    const result = await createUser(mapFormValuesToPayload(values));
    if (result.meta?.requestStatus === 'fulfilled') {
      router.push('/');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-10 space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Typography.Title level={2} className="!mb-1">
          Yeni Kullanıcı Ekle
        </Typography.Title>
        <Typography.Text type="secondary">
          Bilgileri doldurup kaydettiğinizde listeye simüle olarak eklenecek.
        </Typography.Text>
      </motion.div>
      <UserForm
        initialValues={emptyUserFormValues}
        onSubmit={handleSubmit}
        submitting={creating}
        submitText="Ekle"
        onDirtyChange={setDirty}
      />

      <LeavePromptModal
        open={open}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}

