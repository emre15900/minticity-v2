'use client';

import { Avatar } from 'antd';

const COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#8b5cf6',
  '#ef4444',
  '#f97316',
];

const pickColor = (value?: string) => {
  if (!value) return COLORS[0];
  const hash = value
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

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

  const backgroundColor = pickColor(name);
  const safeSrc =
    avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl : undefined;

  return (
    <Avatar
      src={safeSrc}
      style={{
        backgroundColor,
        color: '#fff',
      }}
    >
      {initials}
    </Avatar>
  );
}

