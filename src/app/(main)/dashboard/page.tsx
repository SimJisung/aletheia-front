'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Scale,
  Gem,
  Search,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui';
import { FragmentInputForm, FragmentCard } from '@/components/fragments';
import { ValueSummaryCard, ValueRadarChart } from '@/components/values';
import { fragmentsApi, decisionsApi, valuesApi } from '@/lib/api';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';
import type { ThoughtFragment, Decision, ValueGraph, ValueSummary } from '@/types';

const quickActions = [
  { href: '/fragments', icon: BookOpen, label: 'Fragments', color: 'from-blue-500 to-blue-600' },
  { href: '/decisions/new', icon: Scale, label: 'New Decision', color: 'from-violet-500 to-violet-600' },
  { href: '/values', icon: Gem, label: 'Values', color: 'from-amber-500 to-amber-600' },
  { href: '/fragments?tab=search', icon: Search, label: 'Search', color: 'from-emerald-500 to-emerald-600' },
];

export default function DashboardPage() {
  const [recentFragments, setRecentFragments] = useState<ThoughtFragment[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<Decision[]>([]);
  const [valueGraph, setValueGraph] = useState<ValueGraph | null>(null);
  const [valueSummary, setValueSummary] = useState<ValueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);

  const loadData = async () => {
    setError(null);
    setPartialError(null);

    const results = await Promise.allSettled([
      fragmentsApi.list(5, 0),
      decisionsApi.getPendingFeedback(),
      valuesApi.getGraph(),
      valuesApi.getSummary(),
    ]);

    const [fragmentsResult, pendingResult, graphResult, summaryResult] = results;
    const failedRequests: string[] = [];

    if (fragmentsResult.status === 'fulfilled') {
      setRecentFragments(fragmentsResult.value.fragments);
    } else {
      console.error('Failed to load fragments:', fragmentsResult.reason);
      failedRequests.push('fragments');
    }

    if (pendingResult.status === 'fulfilled') {
      setPendingFeedback(pendingResult.value);
    } else {
      console.error('Failed to load pending feedback:', pendingResult.reason);
      failedRequests.push('feedback');
    }

    if (graphResult.status === 'fulfilled') {
      setValueGraph(graphResult.value);
    } else {
      console.error('Failed to load value graph:', graphResult.reason);
      failedRequests.push('value graph');
    }

    if (summaryResult.status === 'fulfilled') {
      setValueSummary(summaryResult.value);
    } else {
      console.error('Failed to load value summary:', summaryResult.reason);
      failedRequests.push('value summary');
    }

    if (failedRequests.length === 4) {
      setError('Failed to load data. Please check your network connection.');
    } else if (failedRequests.length > 0) {
      setPartialError(`Some data could not be loaded: ${failedRequests.join(', ')}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFragmentCreated = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-error-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Unable to load data
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            {error}
          </p>
        </div>
        <Button onClick={loadData} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-fluid-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome back
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Capture your thoughts and discover patterns
        </p>
      </motion.div>

      {/* Partial error banner */}
      {partialError && (
        <motion.div variants={staggerItemVariants}>
          <Card variant="default" padding="sm" className="bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-warning-700 dark:text-warning-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{partialError}</span>
                </div>
                <button
                  onClick={loadData}
                  className="text-sm text-warning-600 dark:text-warning-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pending feedback banner */}
      {pendingFeedback.length > 0 && (
        <motion.div variants={staggerItemVariants}>
          <Card variant="glass" padding="md" className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/50 dark:to-secondary-950/50 border-primary-200 dark:border-primary-800">
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {pendingFeedback.length} decision{pendingFeedback.length > 1 ? 's' : ''} awaiting feedback
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                      &quot;{pendingFeedback[0].title}&quot;
                    </p>
                  </div>
                </div>
                <Link href={`/decisions/${pendingFeedback[0].id}`}>
                  <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Give feedback
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick capture */}
      <motion.div variants={staggerItemVariants}>
        <FragmentInputForm
          onSuccess={handleFragmentCreated}
          placeholder="What's on your mind right now..."
          compact
        />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value chart */}
        <motion.div variants={staggerItemVariants}>
          <Card variant="default" padding="md" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-primary-500" />
                  <CardTitle>Value Map</CardTitle>
                </div>
                <Link href="/values">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View all
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {valueGraph && valueGraph.nodes.length > 0 ? (
                <ValueRadarChart nodes={valueGraph.nodes} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary-500" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Your value map will form as you
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    record more thoughts
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent fragments */}
        <motion.div variants={staggerItemVariants}>
          <Card variant="default" padding="md" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  <CardTitle>Recent Thoughts</CardTitle>
                </div>
                <Link href="/fragments">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View all
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentFragments.length > 0 ? (
                <div className="space-y-3">
                  {recentFragments.slice(0, 3).map((fragment) => (
                    <FragmentCard key={fragment.id} fragment={fragment} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-secondary-500" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Record your first thought
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Value summary */}
      {valueSummary && valueSummary.totalFragments > 0 && (
        <motion.div variants={staggerItemVariants}>
          <ValueSummaryCard summary={valueSummary} />
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div variants={staggerItemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card variant="interactive" padding="none" className="overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-sm text-neutral-700 dark:text-neutral-300">
                        {action.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
