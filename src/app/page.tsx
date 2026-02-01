'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores';
import { Logo } from '@/components/brand';

export default function HomePage() {
  const router = useRouter();
  const { initializeAuth, isInitialized, isAuthenticated, onboarding } = useUserStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeAuth();
    }
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        if (onboarding.isComplete) {
          router.replace('/dashboard');
        } else {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [isInitialized, isAuthenticated, onboarding.isComplete, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        role="status"
        aria-label="Loading"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex justify-center mb-6"
        >
          <Logo size="xl" animated />
        </motion.div>

        {/* Loading indicator */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-500"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <span className="sr-only">Loading page</span>
      </motion.div>
    </div>
  );
}
