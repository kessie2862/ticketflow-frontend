import { Clock, Hash, CheckCircle2, Circle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  accent?: 'blue' | 'green' | 'default' | 'indigo';
  isTime?: boolean;
}

export const StatCard = ({ title, value, isTime = false }: StatCardProps) => {
  const getIconConfig = () => {
    if (title.toLowerCase().includes('total'))
      return { icon: <Hash className="w-4 h-4" />, color: '#c6f135' };
    if (title.toLowerCase().includes('time'))
      return { icon: <Clock className="w-4 h-4" />, color: '#fbbf24' };
    if (title.toLowerCase().includes('resolved'))
      return { icon: <CheckCircle2 className="w-4 h-4" />, color: '#34d399' };
    if (title.toLowerCase().includes('open'))
      return { icon: <Circle className="w-4 h-4" />, color: '#60a5fa' };
    return { icon: null, color: '#c6f135' };
  };

  const { icon, color } = getIconConfig();

  return (
    <div
      className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3"
            style={{ color: 'var(--muted)' }}
          >
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p
              className="font-display text-4xl leading-none"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {value ?? (isTime ? 'N/A' : '0')}
            </p>
            {isTime && value !== 'N/A' && (
              <span
                className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(198,241,53,0.1)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(198,241,53,0.2)',
                }}
              >
                avg
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
