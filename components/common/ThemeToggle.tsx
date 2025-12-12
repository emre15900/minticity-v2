'use client';

import { Button, Tooltip } from 'antd';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/lib/theme/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip title={isDark ? 'Açık moda geç' : 'Koyu moda geç'}>
      <Button
        shape="circle"
        size="large"
        onClick={toggleTheme}
        icon={isDark ? <FiSun /> : <FiMoon />}
      />
    </Tooltip>
  );
}

