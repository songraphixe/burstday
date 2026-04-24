import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0F] px-4 text-center">
      <div className="text-8xl mb-4">🎈</div>
      <h1 className="text-4xl font-bold font-display mb-2 gradient-text">404</h1>
      <p className="text-white/40 mb-6">This page floated away.</p>
      <Link to="/"><Button>Take me home</Button></Link>
    </div>
  );
}
