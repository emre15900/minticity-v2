'use client';

import { Avatar } from 'antd';

type Props = {
  name?: string;
  avatarUrl?: string;
};

export function UserAvatar({ name, avatarUrl }: Props) {
  const initials =
    name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <Avatar src={avatarUrl} style={{ backgroundColor: '#0ea5e9' }}>
      {initials}
    </Avatar>
  );
}

