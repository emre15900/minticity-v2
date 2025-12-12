'use client';

import { Avatar, Descriptions, Modal, Space, Typography } from 'antd';
import { FiMail, FiPhone } from 'react-icons/fi';
import { User } from '@/features/users/types/user';

type Props = {
  open: boolean;
  user?: User;
  onClose: () => void;
};

const labelStyle = { width: 120 };

export function UserPreviewModal({ open, user, onClose }: Props) {
  if (!user) return null;
  const initials =
    user.name
      ?.split(' ')
      .map((part) => part[0])
      .join('') || '?';

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Önizleme">
      <Space align="center" size="middle" className="mb-4">
        <Avatar src={user.avatarUrl} size={64}>
          {initials}
        </Avatar>
        <div>
          <Typography.Title level={4} className="!mb-1">
            {user.name || '-'}
          </Typography.Title>
          <Typography.Text type="secondary">@{user.username || '-'}</Typography.Text>
        </div>
      </Space>
      <Descriptions column={1} labelStyle={labelStyle} bordered size="small">
        <Descriptions.Item label="E-posta">
          <Space>
            <FiMail />
            <a href={`mailto:${user.email}`}>{user.email || '-'}</a>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Telefon">
          <Space>
            <FiPhone />
            <a href={`tel:${user.phone}`}>{user.phone || '-'}</a>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Şirket">
          {user.company?.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Website">
          {user.website ? (
            <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
              {user.website}
            </a>
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

