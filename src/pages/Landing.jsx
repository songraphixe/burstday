import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Sparkles, Gift, Users, Clock, History } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { cardVariants, staggerContainer } from '../lib/animations';

const features = [
  { icon: Bell, title: 'Smart Reminders', desc: 'Email, WhatsApp, and Telegram alerts so you never miss a birthday again.', color: '#FF375F' },
  { icon: Sparkles, title: 'AI-Generated Wishes', desc: 'Personalized messages crafted by AI based on relationship and tone.', color: '#FFB340' },
  { icon: Gift, title: 'Surprise Links', desc: 'Share a beautiful celebration page with confetti and reactions.', color: '#FF6B2C' },
  { icon: Users, title: 'Relationship Tagging', desc: 'From best friend to client — every birthday gets the right treatment.', color: '#AF52DE' },
  { icon: Clock, title: 'Countdown Widget', desc: 'See exactly how many days until the next birthday.', color: '#34C759' },
  { icon: History, title: 'Birthday History', desc: 'Remember what you sent last year. Never repeat yourself.', color: '#007AFF' },
];

function FloatingCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      className="glass-card p-4 rounded-3xl"
      style={{ animation: `float ${4 + delay}s ease-in-out infinite ${delay}s` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF375F] to-[#FFB340] flex items-center justify-center text-lg">🎂</div>
        <div>
          <p className="font-semibold text-sm">Amara Asante</p>
          <p className="text-white/40 text-xs">Best Friend · 3 days</p>
        </div>
        <span className="ml-auto text-xs font-semibold text-[#FF375F] bg-[#FF375F]/10 px-2 py-0.5 rounded-full">3d</span>
      </div>
      <div className="flex gap-2">
        <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/40">✨ Generate Wish</span>
        <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/40">🎁 Surprise</span>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold font-display gradient-text">Burstday</span>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-white/50 hover:text-white transition-colors">Sign In</Link>
            <Link to="/auth">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF375F]/8 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FFB340]/6 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF375F]/10 border border-[#FF375F]/20 text-[#FF375F] text-sm mb-6">
                🎉 1,200+ people already using Burstday
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6">
                Never forget the<br />
                <span className="gradient-text">people who matter.</span>
              </h1>
              <p className="text-white/50 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                Birthday reminders, AI-generated wishes, and surprise links — all in one beautiful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto">Get Started Free ✨</Button>
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-2xl glass-card text-white/70 hover:text-white transition-all"
                >
                  See how it works
                </a>
              </div>
              <p className="text-white/25 text-sm mt-4">No credit card required. Free forever.</p>
            </motion.div>
          </div>

          {/* Floating cards mockup */}
          <div className="flex-1 relative hidden lg:block">
            <div className="relative max-w-xs mx-auto">
              <div className="absolute -top-4 -right-8">
                <FloatingCard delay={0} />
              </div>
              <div className="absolute top-32 -left-4">
                <FloatingCard delay={0.3} />
              </div>
              <div className="absolute bottom-0 right-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.6 } }}
                  className="glass-card p-5 rounded-3xl text-center"
                  style={{ animation: 'float 5s ease-in-out infinite 1s' }}
                >
                  <div className="text-5xl mb-2">🎂</div>
                  <p className="gradient-text font-bold font-display text-xl">Happy Birthday!</p>
                  <p className="text-white/40 text-xs mt-1">Today is Kofi's birthday</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#0D0D14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-3">Everything you need</h2>
            <p className="text-white/40 text-lg">Built for people who care about the people they love.</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={cardVariants} className="glass-card p-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-lg font-display mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Surprise link demo */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold font-display mb-3">The Surprise Link</h2>
          <p className="text-white/40 text-lg mb-10">Send someone a beautiful birthday experience they'll never forget.</p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-10"
            style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,55,95,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(255,179,64,0.15) 0%, transparent 50%), #13131A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-5xl mb-4">🎉 ✨ 🎂 ✨ 🎉</div>
            <h3 className="text-4xl font-bold font-display gradient-text mb-4">Happy Birthday!</h3>
            <p className="text-white/70 text-lg max-w-md mx-auto mb-6 italic">
              "The world is genuinely better with you in it. On this birthday, I hope every moment feels like the best version of a day."
            </p>
            <p className="text-white/40 text-sm">— From Someone Special</p>
            <div className="flex justify-center gap-3 mt-6">
              {['🥹', '💛', '🔥', '🎉', '❤️', '😭'].map((e) => (
                <span key={e} className="text-2xl hover:scale-125 transition-transform cursor-pointer">{e}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0D0D14]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold font-display mb-3">Start for free.</h2>
          <p className="text-white/40 text-lg mb-8">No credit card. No nonsense. Just birthdays, remembered.</p>
          <Link to="/auth">
            <Button size="lg" className="w-full sm:w-auto">Create Your Account ✨</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-bold font-display gradient-text">Burstday</span>
          <p className="text-white/25 text-sm">Made with love in Ghana 🇬🇭</p>
          <div className="flex gap-4 text-sm text-white/30">
            <Link to="/auth" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
