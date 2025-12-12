'use client';

import { Modal } from 'antd';
import { UserForm } from '@/features/users/components/UserForm';
import { mapUserToFormValues } from '@/features/users/models/userMapper';
import { User, UserFormValues } from '@/features/users/types/user';

type Props = {
  open: boolean;
  user?: User;
  submitting?: boolean;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onClose: () => void;
};

export function UserEditModal({ open, user, submitting, onSubmit, onClose }: Props) {
  if (!user) return null;

  return (
    <Modal
      open={open}
      title="Kullanıcı Güncelle"
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={720}
    >
      <UserForm
        initialValues={mapUserToFormValues(user)}
        onSubmit={onSubmit}
        submitting={submitting}
        submitText="Güncelle"
      />
    </Modal>
  );
}

