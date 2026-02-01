'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Scale,
  Gem,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { Logo } from '@/components/brand';
import { ThemeToggle, ThemeToggleCompact } from '@/components/ui/ThemeToggle';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Fragments', href: '/fragments', icon: BookOpen },
  { name: 'Decisions', href: '/decisions', icon: Scale },
  { name: 'Values', href: '/values', icon: Gem },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-[var(--color-glass-strong)] backdrop-blur-xl shadow-sm border-b border-[var(--color-glass-border)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex-shrink-0">
              <Logo size="md" animated />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main menu">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
                      'transition-colors duration-200',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right menu */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle - Desktop */}
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <div className="hidden md:block lg:hidden">
                <ThemeToggleCompact />
              </div>

              {/* User info */}
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-hover)]">
                  <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {user.name}
                  </span>
                </div>
              )}

              {/* Settings */}
              <Link
                href="/settings"
                className={cn(
                  'p-2 rounded-xl transition-colors duration-200',
                  'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-hover)]'
                )}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={cn(
                  'p-2 rounded-xl transition-colors duration-200',
                  'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-hover)]'
                )}
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>

                {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'md:hidden p-2 rounded-xl transition-colors duration-200',
                  'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-hover)]'
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-neutral-900 shadow-elevation-2xl md:hidden"
              aria-label="Mobile menu"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <Logo size="sm" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <div className="flex-1 py-4 px-3 space-y-1">
                  {navigation.map((item, index) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium',
                            'transition-colors duration-200',
                            isActive
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Theme Toggle - Mobile */}
                <div className="px-4 py-3 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Theme
                    </span>
                  </div>
                  <ThemeToggle />
                </div>

                {/* User section */}
                {user && (
                  <div className="p-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">
                          {user.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-t border-neutral-200/50 dark:border-neutral-800/50 safe-area-pb">
        <div className="flex">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2 px-2',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className="text-xs font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
