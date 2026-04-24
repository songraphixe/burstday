import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const getDaysUntilBirthday = (birthDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(birthDate);
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const diff = nextBirthday - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export const getRelationshipLabel = (type) =>
  ({
    best_friend: 'Best Friend',
    close_friend: 'Close Friend',
    friend: 'Friend',
    partner: 'Partner',
    spouse: 'Spouse',
    mother: 'Mother',
    father: 'Father',
    sibling: 'Sibling',
    grandparent: 'Grandparent',
    child: 'Child',
    cousin: 'Cousin',
    colleague: 'Colleague',
    mentor: 'Mentor',
    client: 'Client',
    other: 'Other',
  }[type] || type);

export const getRelationshipEmoji = (type) =>
  ({
    best_friend: '⚡',
    close_friend: '💛',
    friend: '🤝',
    partner: '💞',
    spouse: '💍',
    mother: '🌸',
    father: '🦁',
    sibling: '🧬',
    grandparent: '🌟',
    child: '🌱',
    cousin: '🫂',
    colleague: '💼',
    mentor: '🎓',
    client: '🤝',
    other: '✨',
  }[type] || '✨');

export const generateAvatarColor = (name) => {
  const colors = ['#FF375F', '#FF6B2C', '#FFB340', '#34C759', '#007AFF', '#AF52DE', '#FF2D55', '#5856D6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

export const formatDateFull = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getCountdownColor = (days) => {
  if (days === 0) return '#FF375F';
  if (days <= 3) return '#FF375F';
  if (days <= 7) return '#FFB340';
  return 'rgba(255,255,255,0.7)';
};
