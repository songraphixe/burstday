import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-white/10 text-white/70 border-white/10',
  pink: 'bg-[#FF375F]/20 text-[#FF375F] border-[#FF375F]/30',
  gold: 'bg-[#FFB340]/20 text-[#FFB340] border-[#FFB340]/30',
  orange: 'bg-[#FF6B2C]/20 text-[#FF6B2C] border-[#FF6B2C]/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  gradient: 'gradient-context bg-burst-gradient border-transparent',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
