'use client';

import { Modal } from 'antd';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function LeavePromptModal({ open, onConfirm, onCancel }: Props) {
  return (
    <Modal
      open={open}
      title="Sayfa yenilenecek"
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yenile"
      cancelText="İptal"
    >
      Formda kaydedilmemiş değişiklikler var. Devam edersen bilgiler silinecek.
    </Modal>
  );
}

