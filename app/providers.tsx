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

  const customTheme = useMemo(() => {
    const isDark = theme === 'dark';
    const palette = {
      background: isDark ? '#050b18' : '#0b1730',
      surface: isDark ? '#0c172e' : '#0f1f3d',
      border: '#1f2b46',
      text: '#e6edff',
      textSecondary: '#9fb5e8',
    };

    return {
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: '#38bdf8',
        colorPrimaryHover: '#60a5fa',
        colorPrimaryActive: '#0ea5e9',
        colorBgBase: palette.background,
        colorBgContainer: palette.surface,
        colorBgElevated: palette.surface,
        colorBorder: palette.border,
        colorBorderSecondary: palette.border,
        colorText: palette.text,
        colorTextBase: palette.text,
        colorTextSecondary: palette.textSecondary,
        colorTextTertiary: '#7aa5ff',
        colorFillAlter: '#0f1f3c',
        controlItemBgHover: 'rgba(56, 189, 248, 0.15)',
        controlOutline: 'rgba(56, 189, 248, 0.35)',
        borderRadius: 12,
        wireframe: false,
      },
    };
  }, [theme]);

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

