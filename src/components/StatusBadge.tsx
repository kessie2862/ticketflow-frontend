export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; color: string; border: string }> =
    {
      OPEN: {
        bg: 'rgba(96,165,250,0.12)',
        color: '#60a5fa',
        border: 'rgba(96,165,250,0.25)',
      },
      IN_PROGRESS: {
        bg: 'rgba(129,140,248,0.12)',
        color: '#818cf8',
        border: 'rgba(129,140,248,0.25)',
      },
      RESOLVED: {
        bg: 'rgba(52,211,153,0.12)',
        color: '#34d399',
        border: 'rgba(52,211,153,0.25)',
      },
    };

  const s = styles[status] ?? styles.OPEN;

  return (
    <span
      className="font-mono text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
};
