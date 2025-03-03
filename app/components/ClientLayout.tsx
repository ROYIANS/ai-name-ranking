'use client';

import { motion } from 'framer-motion';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mx-auto"
    >
      {children}
    </motion.div>
  );
}; 