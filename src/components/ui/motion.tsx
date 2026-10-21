'use client';

/**
 * Reusable Healthcare Motion & Layout Animation Primitives.
 * Built with framer-motion for calm, purposeful clinical transitions:
 * - FadeInView: Page load and card entrance (fade + 8px upward slide).
 * - AnimatedList & AnimatedListItem: Smooth accordion slide-in & exit for Rx rows and logs.
 * - SlideOverDrawer: Smooth spring-animated right-hand sheet for Co-Pilot and Lab reviews.
 */
import { ReactNode } from 'react';
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

interface FadeInViewProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeInView({
  children,
  delay = 0,
  duration = 0.22,
  className,
  ...props
}: FadeInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedListItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export function AnimatedListItem({
  children,
  className,
  ...props
}: AnimatedListItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, scale: 0.98, y: -6 }}
      animate={{ opacity: 1, height: 'auto', scale: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, scale: 0.96, y: -6 }}
      transition={{
        opacity: { duration: 0.18, ease: 'easeOut' },
        height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
        layout: { duration: 0.2 },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface SlideOverDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
  widthClass?: string;
}

export function SlideOverDrawer({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  className,
  widthClass = 'max-w-xl',
}: SlideOverDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className={cn(
                'w-screen flex flex-col bg-white shadow-2xl border-l border-slate-200/80',
                widthClass,
                className,
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    {badge && (
                      <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                        {badge}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors focus:ring-2 focus:ring-teal-500/30"
                  aria-label="Close panel"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
