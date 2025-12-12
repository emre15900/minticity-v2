'use client';

import { Modal } from 'antd';
import { UserForm } from '@/features/users/components/UserForm';
import { emptyUserFormValues } from '@/features/users/models/defaults';
import { UserFormValues } from '@/features/users/types/user';

type Props = {
  open: boolean;
  submitting?: boolean;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onClose: () => void;
};

export function UserCreateModal({ open, submitting, onSubmit, onClose }: Props) {
  return (
    <Modal
      open={open}
      title="Yeni Kullanıcı Ekle"
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={720}
    >
      <UserForm
        initialValues={emptyUserFormValues}
        onSubmit={onSubmit}
        submitting={submitting}
        submitText="Ekle"
        footer={null}
      />
    </Modal>
  );
}

