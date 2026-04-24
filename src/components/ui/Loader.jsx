export default function Loader({ size = 'md', text }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-[#FF375F]/30 border-t-[#FF375F] animate-spin`}
      />
      {text && <p className="text-white/40 text-sm">{text}</p>}
    </div>
  );
}

// Confetti pieces config: [left%, delay(s), duration(s), color, size(px), shape]
const PIECES = [
  [5,  0.0, 2.8, '#FF375F', 8,  'rect'],
  [10, 0.4, 3.2, '#FFB340', 6,  'circle'],
  [15, 0.1, 2.5, '#FF6B2C', 10, 'rect'],
  [20, 0.7, 3.5, '#FF375F', 7,  'circle'],
  [25, 0.2, 2.9, '#FFB340', 9,  'rect'],
  [30, 0.5, 3.1, '#FF6B2C', 6,  'circle'],
  [35, 0.0, 2.6, '#FF375F', 8,  'rect'],
  [40, 0.8, 3.4, '#FFB340', 7,  'circle'],
  [45, 0.3, 2.7, '#FF6B2C', 10, 'rect'],
  [50, 0.6, 3.0, '#FF375F', 6,  'circle'],
  [55, 0.1, 3.3, '#FFB340', 9,  'rect'],
  [60, 0.9, 2.8, '#FF6B2C', 7,  'circle'],
  [65, 0.4, 2.5, '#FF375F', 8,  'rect'],
  [70, 0.2, 3.6, '#FFB340', 6,  'circle'],
  [75, 0.7, 2.9, '#FF6B2C', 10, 'rect'],
  [80, 0.0, 3.1, '#FF375F', 7,  'rect'],
  [85, 0.5, 2.7, '#FFB340', 9,  'circle'],
  [90, 0.3, 3.4, '#FF6B2C', 6,  'rect'],
  [95, 0.8, 2.6, '#FF375F', 8,  'circle'],
  [8,  1.0, 3.2, '#FFB340', 7,  'rect'],
  [18, 1.2, 2.8, '#FF375F', 9,  'circle'],
  [28, 0.9, 3.0, '#FF6B2C', 6,  'rect'],
  [38, 1.1, 2.5, '#FFB340', 8,  'circle'],
  [48, 1.3, 3.3, '#FF375F', 7,  'rect'],
  [58, 1.0, 2.9, '#FF6B2C', 10, 'circle'],
  [68, 1.4, 3.1, '#FFB340', 6,  'rect'],
  [78, 1.2, 2.7, '#FF375F', 9,  'circle'],
  [88, 1.1, 3.5, '#FF6B2C', 7,  'rect'],
];

export function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes confetti-sway {
          0%, 100% { margin-left: 0px; }
          25%       { margin-left: 18px; }
          75%       { margin-left: -18px; }
        }
        @keyframes loader-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
      `}</style>

      {/* Confetti rain */}
      {PIECES.map(([left, delay, duration, color, size, shape], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-12px',
            left: `${left}%`,
            width: shape === 'circle' ? `${size}px` : `${size * 0.6}px`,
            height: shape === 'circle' ? `${size}px` : `${size}px`,
            borderRadius: shape === 'circle' ? '50%' : '2px',
            background: color,
            opacity: 0.85,
            animation: `confetti-fall ${duration}s ${delay}s ease-in infinite, confetti-sway ${duration * 0.7}s ${delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Center logo + spinner */}
      <div
        className="flex flex-col items-center gap-5 relative z-10"
        style={{ animation: 'loader-pulse 2s ease-in-out infinite' }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl">🎂</span>
          <div className="text-3xl font-bold font-display gradient-text tracking-tight">Burstday</div>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Never miss a birthday
          </p>
        </div>
        <Loader size="md" />
      </div>
    </div>
  );
}
