// src/components/StatusBadge.tsx

import { clsx } from 'clsx';

export const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  return (
    <span
      className={clsx(
        'px-2 py-1 rounded-full text-xs font-semibold',
        styles[status as keyof typeof styles],
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
};
