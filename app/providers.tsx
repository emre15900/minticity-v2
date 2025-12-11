'use client';

import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { Provider } from 'react-redux';
import { ReactNode, useMemo } from 'react';
import { store } from '@/lib/store';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  // Keep theme tokens in a memo to avoid recreating objects on every render.
  const customTheme = useMemo(
    () => ({
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 10,
        wireframe: false,
      },
    }),
    [],
  );

  return (
    <Provider store={store}>
      <ConfigProvider theme={customTheme}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </Provider>
  );
}

