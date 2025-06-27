// pages/Celebration.tsx
// pages/Celebration.tsx
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Celebration() {
  const { width, height } = useWindowSize();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play celebration sound on mount
    audioRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-pink-100 to-indigo-100 text-center p-4">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />

      <audio ref={audioRef} src="/celebration.mp3" preload="auto" />

      <div className="text-5xl animate-bounce mb-4">🌟🥳🌟</div>
      <h1 className="text-4xl font-bold text-indigo-700 mb-2">Congratulations!</h1>
      <p className="text-lg text-gray-700 mb-6">You’ve completed all your baby’s sleep logs or quizzes!</p>

      <img src="/celebrate-baby.png" alt="Celebration" className="w-40 mb-6 drop-shadow-lg" />

      <Link
        to="/dashboard"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
