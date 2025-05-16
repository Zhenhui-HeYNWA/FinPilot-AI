'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  color?: string;
  size?: number;
}

export default function Loading({
  color = '#2f3d4c',
  size = 24,
}: LoadingSpinnerProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
        repeatType: 'loop',
      }}>
      <motion.circle
        cx='50'
        cy='50'
        r='45'
        fill='transparent'
        stroke={color}
        strokeWidth='10'
        strokeLinecap='round'
        strokeDasharray='283'
        initial={{ strokeDashoffset: 280, rotate: 0 }}
        animate={{
          strokeDashoffset: [280, 75, 280],
          rotate: [0, 45, 360],
        }}
        transition={{
          duration: 1.4,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
        }}
      />
    </motion.svg>
  );
}
