import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Music, Waves, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sound {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  category: 'white-noise' | 'lullabies' | 'nature' | 'heartbeat';
  duration?: number;
}

const sounds: Sound[] = [
  // White Noise
  {
    id: 'white-noise',
    name: 'White Noise',
    icon: <Waves className="w-6 h-6" />,
    url: '/sounds/white-noise-1.mp3',
    category: 'white-noise'
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    icon: <Waves className="w-6 h-6" />,
    url: '/sounds/pink.noise.mp3',
    category: 'white-noise'
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    icon: <Waves className="w-6 h-6" />,
    url: '/sounds/brown.noise.mp3',
    category: 'white-noise'
  },
  
  // Nature Sounds
  {
    id: 'rain',
    name: 'Rain Sounds',
    icon: <Wind className="w-6 h-6" />,
    url: '/sounds/rain.sounds.mp3',
    category: 'nature'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    icon: <Waves className="w-6 h-6" />,
    url: '/sounds/ocean.waves.wav',
    category: 'nature'
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    icon: <Wind className="w-6 h-6" />,
    url: '/sounds/forest.ambience.wav',
    category: 'nature'
  },
  
  // Heartbeat
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    icon: <Heart className="w-6 h-6" />,
    url: '/sounds/heartbeat.mp3',
    category: 'heartbeat'
  },
  
  // Lullabies
  {
    id: 'twinkle-twinkle',
    name: 'Twinkle Twinkle',
    icon: <Music className="w-6 h-6" />,
    url: '/sounds/twinkle.twinkle.mp3',
    category: 'lullabies',
    duration: 180
  },
  {
    id: 'brahms-lullaby',
    name: 'Brahms Lullaby',
    icon: <Music className="w-6 h-6" />,
    url: '/sounds/brahms.lullaby.mp3',
    category: 'lullabies',
    duration: 240
  }
];

interface SleepSoundsProps {
  babyId?: string;
}

export default function SleepSounds({ babyId }: SleepSoundsProps) {
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'all', name: 'All Sounds', icon: <Music className="w-4 h-4" /> },
    { id: 'white-noise', name: 'White Noise', icon: <Waves className="w-4 h-4" /> },
    { id: 'nature', name: 'Nature', icon: <Wind className="w-4 h-4" /> },
    { id: 'heartbeat', name: 'Heartbeat', icon: <Heart className="w-4 h-4" /> },
    { id: 'lullabies', name: 'Lullabies', icon: <Music className="w-4 h-4" /> }
  ];

  const filteredSounds = selectedCategory === 'all' 
    ? sounds 
    : sounds.filter(sound => sound.category === selectedCategory);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (timer && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, timeRemaining]);

  const playSound = (sound: Sound) => {
    if (currentSound?.id === sound.id && isPlaying) {
      stopSound();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentSound(sound);
    setIsPlaying(true);
    setIsMuted(false);

    if (sound.duration) {
      setTimer(sound.duration);
      setTimeRemaining(sound.duration);
    } else {
      setTimer(null);
      setTimeRemaining(0);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSound(null);
    setTimer(null);
    setTimeRemaining(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Sleep Sounds</h1>
        <p className="text-gray-600">Soothing sounds to help your baby sleep peacefully</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Current Sound Player */}
      {currentSound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {currentSound.icon}
              <div>
                <h3 className="font-semibold text-lg">{currentSound.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{currentSound.category.replace('-', ' ')}</p>
              </div>
            </div>
            <button
              onClick={stopSound}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              Stop
            </button>
          </div>

          <audio
            ref={audioRef}
            src={currentSound.url}
            loop={!currentSound.duration}
            onEnded={() => {
              if (currentSound.duration) {
                stopSound();
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause();
                  } else {
                    audioRef.current.play();
                  }
                }
              }}
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleMute}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>

          {timer && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Timer: {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Sound Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSounds.map((sound, index) => (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                currentSound?.id === sound.id && isPlaying
                  ? 'ring-2 ring-indigo-500 bg-indigo-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => playSound(sound)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-indigo-600">
                  {sound.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{sound.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {sound.category.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {sound.duration ? `${Math.floor(sound.duration / 60)}min` : 'Loop'}
                </span>
                {currentSound?.id === sound.id && isPlaying && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-indigo-500 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Better Sleep</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Start with white noise for newborns</li>
          <li>• Use heartbeat sounds to mimic the womb</li>
          <li>• Keep volume at a comfortable level (not too loud)</li>
          <li>• Combine with a consistent bedtime routine</li>
          <li>• Use lullabies for older babies</li>
        </ul>
      </div>
    </div>
  );
}