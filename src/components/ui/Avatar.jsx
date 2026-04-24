import { generateAvatarColor } from '../../lib/utils';
import { cn } from '../../lib/utils';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-xl',
  xl: 'w-28 h-28 text-3xl',
};

export default function Avatar({ name, src, size = 'md', className, showRing = false }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const color = name ? generateAvatarColor(name) : '#FF375F';

  return (
    <div
      className={cn(
        'relative rounded-full flex-shrink-0 overflow-hidden',
        sizes[size],
        showRing && 'ring-2 ring-[#FF375F]/50 ring-offset-2 ring-offset-[#0A0A0F]',
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${color}dd, ${color}88)` }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
