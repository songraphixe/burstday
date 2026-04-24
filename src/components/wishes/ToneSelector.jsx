const tones = [
  { id: 'warm', label: 'Warm', emoji: '💛' },
  { id: 'funny', label: 'Funny', emoji: '😄' },
  { id: 'emotional', label: 'Emotional', emoji: '🥹' },
  { id: 'formal', label: 'Formal', emoji: '🤝' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🙏' },
];

export default function ToneSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tones.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            value === t.id
              ? 'bg-burst-gradient text-white border-transparent shadow-[0_0_15px_rgba(255,55,95,0.3)]'
              : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20'
          }`}
        >
          {t.emoji} {t.label}
        </button>
      ))}
    </div>
  );
}
