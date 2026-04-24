import confetti from 'canvas-confetti';

export const burstConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  const fire = (particleRatio, opts) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF375F', '#FF6B2C', '#FFB340'] });
  fire(0.2, { spread: 60, colors: ['#FF375F', '#FFB340', '#FFFFFF'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FF375F', '#FF6B2C'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#FFB340', '#FF6B2C'] });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#FF375F', '#FFFFFF'] });
};

export const continuousConfetti = (duration = 5000) => {
  const animEnd = Date.now() + duration;
  const interval = setInterval(() => {
    const timeLeft = animEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti({ particleCount, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF375F', '#FFB340', '#FF6B2C'] });
    confetti({ particleCount, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF375F', '#FFB340', '#FF6B2C'] });
  }, 250);
};

export const miniConfettiBurst = (origin = { x: 0.5, y: 0.5 }) => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin,
    zIndex: 9999,
    colors: ['#FF375F', '#FFB340', '#FF6B2C', '#FFFFFF'],
  });
};
