'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { pageVariants } from '@/lib/motion';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.main>
    </div>
  );
}
