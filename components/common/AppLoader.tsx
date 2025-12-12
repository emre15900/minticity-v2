'use client';

import { Spin } from 'antd';
import { motion } from 'framer-motion';

export function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center gap-3"
      >
        <Spin size="large" />
      </motion.div>
    </div>
  );
}

