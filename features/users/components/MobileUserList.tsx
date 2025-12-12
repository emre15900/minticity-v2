'use client';

import { Badge, Button, Collapse, Space, Tag, Typography } from 'antd';
import { FiExternalLink, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { User } from '@/features/users/types/user';
import { UserAvatar } from '@/features/users/components/UserAvatar';

type Props = {
  users: User[];
  deletingIds?: number[];
  onPreview: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDetail: (user: User) => void;
};

export function MobileUserList({
  users,
  deletingIds = [],
  onPreview,
  onEdit,
  onDelete,
  onDetail,
}: Props) {
  const items =
    users.length > 0
      ? users.map((user) => ({
          key: `${user.id}`,
          label: (
            <Space align="center">
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
              <div className="flex flex-col leading-tight">
                <Typography.Text strong className="block">
                  {user.name || '-'}
                </Typography.Text>
                <Typography.Text type="secondary" className="block text-xs">
                  @{user.username || '-'}
                </Typography.Text>
                <Typography.Text type="secondary" className="block text-xs">
                  {user.company?.name || '-'}
                </Typography.Text>
              </div>
            </Space>
          ),
          children: (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>E-posta</span>
                <a href={`mailto:${user.email}`}>{user.email || '-'}</a>
              </div>
              <div className="flex items-center justify-between">
                <span>Telefon</span>
                <a href={`tel:${user.phone}`}>{user.phone || '-'}</a>
              </div>
              <div className="flex items-center justify-between">
                <span>Şirket</span>
                <span>{user.company?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Website</span>
                {user.website ? (
                  <a href={`https://${user.website}`} target="_blank" rel="noreferrer">
                    {user.website}
                  </a>
                ) : (
                  '-'
                )}
              </div>
              <Space wrap>
                <Button
                  size="small"
                  icon={<FiEye />}
                  onClick={() => onPreview(user)}
                >
                  Önizleme
                </Button>
                <Button
                  size="small"
                  icon={<FiEdit2 />}
                  onClick={() => onEdit(user)}
                >
                  Düzenle
                </Button>
                <Button
                  size="small"
                  icon={<FiExternalLink />}
                  onClick={() => onDetail(user)}
                >
                  Detay
                </Button>
                <Button
                  size="small"
                  danger
                  loading={deletingIds.includes(user.id)}
                  icon={<FiTrash2 />}
                  onClick={() => onDelete(user)}
                >
                  Sil
                </Button>
              </Space>
            </div>
          ),
        }))
      : [
          {
            key: 'empty',
            label: 'Kayıt yok',
            children: <Badge status="default" text="Kullanıcı bulunamadı" />,
            collapsible: 'disabled' as const,
          },
        ];

  return (
    <Collapse
      accordion
      items={items}
      className="mobile-user-collapse"
      expandIconPlacement="end"
    />
  );
}

