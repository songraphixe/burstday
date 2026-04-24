import { getDaysUntilBirthday, getCountdownColor } from '../../lib/utils';

export default function CountdownWidget({ birthDate, size = 'md' }) {
  const days = getDaysUntilBirthday(birthDate);
  const color = getCountdownColor(days);

  if (size === 'lg') {
    return (
      <div className="text-center">
        <div className="text-7xl font-bold font-display" style={{ color }}>
          {days === 0 ? '🎂' : days}
        </div>
        <div className="text-white/40 text-sm mt-1">{days === 0 ? 'Today!' : days === 1 ? 'day to go' : 'days to go'}</div>
      </div>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color, background: `${color}20`, border: `1px solid ${color}40` }}
    >
      {days === 0 ? '🎂 Today!' : `${days}d`}
    </span>
  );
}
