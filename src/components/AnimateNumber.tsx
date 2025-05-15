'use client';

import { motion, AnimatePresence } from 'framer-motion';

type AnimateNumberProps = {
  value: number;
  prefix?: string;
  className?: string;
};

export function AnimateNumber({
  value,
  prefix = '',
  className,
}: AnimateNumberProps) {
  return (
    <div
      className={`relative h-[40px] overflow-hidden text-4xl font-bold text-center ${className}`}>
      <AnimatePresence
        mode='wait'
        initial={false}>
        <motion.div
          key={value}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className=' flex items-center justify-center'>
          {prefix}
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
