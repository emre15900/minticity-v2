'use client';

import { Avatar, Button, Space, Upload, message } from 'antd';
import { FiImage, FiUser } from 'react-icons/fi';

type Props = {
  value?: string;
  onChange: (dataUrl?: string) => void;
};

export function UserAvatarUpload({ value, onChange }: Props) {
  return (
    <Space align="center" size="large">
      <Avatar size={64} src={value || undefined} icon={<FiUser />} />
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={(file) => {
          const isValid = file.type.startsWith('image/') && file.size / 1024 / 1024 < 5;
          if (!isValid) {
            message.error('5MB altında bir görsel yükleyin.');
            return Upload.LIST_IGNORE;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            onChange(base64);
          };
          reader.readAsDataURL(file);
          return false;
        }}
      >
        <Button icon={<FiImage />}>Görsel Yükle</Button>
      </Upload>
      {value && (
        <Button danger type="link" onClick={() => onChange(undefined)}>
          Kaldır
        </Button>
      )}
    </Space>
  );
}

