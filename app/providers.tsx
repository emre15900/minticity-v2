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
    const palette = isDark
      ? {
          background: '#050b18',
          surface: '#0c172e',
          border: '#1f2b46',
          text: '#e6edff',
          textSecondary: '#9fb5e8',
          fill: '#0f1f3c',
        }
      : {
          background: '#f9fbff',
          surface: '#ffffff',
          border: '#e5e7eb',
          text: '#0f172a',
          textSecondary: '#475569',
          fill: '#f5f0ff',
        };

    return {
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: isDark ? '#38bdf8' : '#ec4899',
        colorPrimaryHover: isDark ? '#60a5fa' : '#f472b6',
        colorPrimaryActive: isDark ? '#0ea5e9' : '#db2777',
        colorBgBase: palette.background,
        colorBgContainer: palette.surface,
        colorBgElevated: palette.surface,
        colorBorder: palette.border,
        colorBorderSecondary: palette.border,
        colorText: palette.text,
        colorTextBase: palette.text,
        colorTextSecondary: palette.textSecondary,
        colorTextTertiary: isDark ? '#7aa5ff' : '#a855f7',
        colorFillAlter: palette.fill,
        controlItemBgHover: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(236, 72, 153, 0.12)',
        controlOutline: isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(236, 72, 153, 0.28)',
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

