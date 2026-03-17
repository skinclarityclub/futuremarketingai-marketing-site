import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface BeforeAfterSide {
  title: string;
  items: string[];
  metric: string;
  metricLabel: string;
}

interface BeforeAfterProps {
  before: BeforeAfterSide;
  after: BeforeAfterSide;
}

export function BeforeAfter({ before, after }: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* BEFORE card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-card border border-red-500/20 bg-red-500/5 p-6"
      >
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-4">
          {before.title}
        </h4>

        <ul className="space-y-3 mb-6">
          {before.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-text-secondary text-sm">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-red-500/20 pt-4">
          <span className="font-mono text-2xl font-bold text-red-400">
            {before.metric}
          </span>
          <p className="text-text-muted text-xs mt-1">{before.metricLabel}</p>
        </div>
      </motion.div>

      {/* AFTER card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="rounded-card border border-accent-system/20 bg-accent-system/5 p-6"
      >
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-system mb-4">
          {after.title}
        </h4>

        <ul className="space-y-3 mb-6">
          {after.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-text-secondary text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-system" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-accent-system/20 pt-4">
          <span className="font-mono text-2xl font-bold text-accent-system">
            {after.metric}
          </span>
          <p className="text-text-muted text-xs mt-1">{after.metricLabel}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default BeforeAfter;
