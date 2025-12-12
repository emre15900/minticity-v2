'use client';

import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { Provider } from 'react-redux';
import { ReactNode, useMemo, useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { ThemeProvider, useTheme } from '@/lib/theme/ThemeProvider';
import { AppLoader } from '@/components/common/AppLoader';

type ProvidersProps = {
  children: ReactNode;
};

function AntThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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
      <AntdApp>{ready ? children : <AppLoader />}</AntdApp>
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

