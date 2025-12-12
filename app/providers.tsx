'use client';

import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { Provider } from 'react-redux';
import { ReactNode, useMemo } from 'react';
import { store } from '@/lib/store';
import { ThemeProvider, useTheme } from '@/lib/theme/ThemeProvider';

type ProvidersProps = {
  children: ReactNode;
};

function AntThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const customTheme = useMemo(
    () => ({
      algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 10,
        wireframe: false,
      },
    }),
    [theme],
  );

  return (
    <ConfigProvider theme={customTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AntThemeWrapper>{children}</AntThemeWrapper>
      </ThemeProvider>
    </Provider>
  );
}

