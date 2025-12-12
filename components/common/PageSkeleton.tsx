'use client';

import { Card, Skeleton, Space } from 'antd';

export function PageSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-6 md:p-10">
      <Space direction="vertical" size="middle" className="w-full">
        <Skeleton.Input active size="large" style={{ width: 260 }} />
        <Skeleton.Input active size="small" style={{ width: 200 }} />
      </Space>
      <Card className="card-like">
        <Space direction="vertical" size="large" className="w-full">
          <Skeleton.Input active size="large" style={{ width: '100%' }} />
          <Skeleton.Input active size="large" style={{ width: '100%' }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </Space>
      </Card>
    </div>
  );
}

