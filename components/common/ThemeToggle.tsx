'use client';

import { Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/lib/theme/ThemeProvider';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip title={isDark ? '' : ''} className='cursor-pointer'>
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        className={`group relative cursor-pointer flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-1 py-1 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition-all hover:border-slate-300 hover:shadow-xl active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 ${className ?? ''}`}
      >
        {/*  <span className="hidden sm:inline select-none">
          {isDark ? 'Karanlık' : 'Aydınlık'}
        </span> */}
        <div className="relative h-6 w-11">
          <div className="absolute inset-0 rounded-full bg-slate-200 transition-colors dark:bg-slate-700" />
          <motion.div
            layout
            animate={{ x: isDark ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-colors dark:bg-slate-200"
          >
            {isDark ? (
              <FiMoon className="h-3.5 w-3.5" />
            ) : (
              <FiSun className="h-3.5 w-3.5 text-amber-400" />
            )}
          </motion.div>
        </div>
      </button>
    </Tooltip>
  );
}

