import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Download, Upload, Brain, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CryAnalysis {
  id: string;
  timestamp: Date;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  type: 'hunger' | 'tired' | 'pain' | 'discomfort' | 'attention' | 'unknown';
  confidence: number;
  suggestions: string[];
  audioUrl?: string;
}

interface CryAnalyzerProps {
  babyId?: string;
}

export default function CryAnalyzer({ babyId }: CryAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<CryAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<CryAnalysis | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cryTypes = {
    hunger: {
      label: 'Hunger',
      color: 'bg-orange-100 text-orange-800',
      icon: '🍼',
      description: 'Baby needs to be fed'
    },
    tired: {
      label: 'Tired',
      color: 'bg-blue-100 text-blue-800',
      icon: '😴',
      description: 'Baby needs sleep'
    },
    pain: {
      label: 'Pain',
      color: 'bg-red-100 text-red-800',
      icon: '😣',
      description: 'Baby is in pain or discomfort'
    },
    discomfort: {
      label: 'Discomfort',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '😖',
      description: 'Baby is uncomfortable (wet diaper, gas, etc.)'
    },
    attention: {
      label: 'Attention',
      color: 'bg-purple-100 text-purple-800',
      icon: '👶',
      description: 'Baby wants attention or comfort'
    },
    unknown: {
      label: 'Unknown',
      color: 'bg-gray-100 text-gray-800',
      icon: '❓',
      description: 'Unable to determine the cause'
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const analyzeCry = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate AI analysis (replace with actual AI service)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysis: CryAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date(),
        duration: recordingTime,
        intensity: recordingTime > 30 ? 'high' : recordingTime > 15 ? 'medium' : 'low',
        type: simulateCryAnalysis(),
        confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
        suggestions: generateSuggestions(),
        audioUrl: audioUrl || undefined
      };

      setCurrentAnalysis(analysis);
      setAnalyses(prev => [analysis, ...prev]);
    } catch (err) {
      setError('Failed to analyze cry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateCryAnalysis = (): CryAnalysis['type'] => {
    const types: CryAnalysis['type'][] = ['hunger', 'tired', 'pain', 'discomfort', 'attention', 'unknown'];
    const weights = [0.3, 0.25, 0.15, 0.2, 0.08, 0.02]; // Probability weights
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return types[i];
      }
    }
    return 'unknown';
  };

  const generateSuggestions = (): string[] => {
    const allSuggestions = {
      hunger: [
        'Try feeding your baby',
        'Check if it\'s been 2-3 hours since last feeding',
        'Offer breast or bottle',
        'Look for hunger cues (rooting, sucking on hands)'
      ],
      tired: [
        'Create a calm environment',
        'Try gentle rocking or swaying',
        'Use white noise or lullabies',
        'Establish a bedtime routine',
        'Check if baby is overtired'
      ],
      pain: [
        'Check for signs of illness',
        'Look for diaper rash or irritation',
        'Check for gas or colic',
        'Consider teething if baby is 4+ months',
        'Contact pediatrician if concerned'
      ],
      discomfort: [
        'Check diaper - may need changing',
        'Try burping if recently fed',
        'Check clothing for tags or tightness',
        'Ensure comfortable temperature',
        'Try gentle tummy massage for gas'
      ],
      attention: [
        'Provide gentle comfort and cuddling',
        'Try skin-to-skin contact',
        'Talk or sing softly to baby',
        'Offer a pacifier',
        'Check if baby needs to be held'
      ],
      unknown: [
        'Try different soothing techniques',
        'Check all basic needs (hunger, diaper, sleep)',
        'Consider if baby is overstimulated',
        'Try gentle movement or rocking',
        'Contact pediatrician if crying persists'
      ]
    };

    const type = simulateCryAnalysis();
    return allSuggestions[type].slice(0, 3);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Cry Analyzer</h1>
        <p className="text-gray-600">AI-powered baby cry interpretation to help you understand your baby's needs</p>
      </div>

      {/* Recording Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Record Baby's Cry</h2>
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              Recording...
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full transition-all ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            disabled={isAnalyzing}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          {recordingTime > 0 && (
            <div className="text-2xl font-mono">
              {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        {audioUrl && !isAnalyzing && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={analyzeCry}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Analyze Cry
            </button>
            <audio controls src={audioUrl} className="flex-1 max-w-md" />
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your baby's cry...</p>
          </div>
        )}
      </div>

      {/* Current Analysis */}
      <AnimatePresence>
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Analysis Result</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {currentAnalysis.timestamp.toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Cry Type</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${cryTypes[currentAnalysis.type].color}`}>
                  <span className="text-lg">{cryTypes[currentAnalysis.type].icon}</span>
                  <span className="font-medium">{cryTypes[currentAnalysis.type].label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{cryTypes[currentAnalysis.type].description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{formatTime(currentAnalysis.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intensity:</span>
                    <span className={getIntensityColor(currentAnalysis.intensity)}>
                      {currentAnalysis.intensity.charAt(0).toUpperCase() + currentAnalysis.intensity.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span>{(currentAnalysis.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Suggestions</h3>
              <ul className="space-y-2">
                {currentAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis History */}
      {analyses.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cryTypes[analysis.type].icon}</span>
                    <span className="font-medium">{cryTypes[analysis.type].label}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysis.timestamp.toLocaleDateString()} {analysis.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Duration: {formatTime(analysis.duration)}</span>
                  <span>Intensity: {analysis.intensity}</span>
                  <span>Confidence: {(analysis.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Using Cry Analyzer</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Record for at least 10-15 seconds for better accuracy</li>
          <li>• Try to record in a quiet environment</li>
          <li>• Use this tool as a guide, not a replacement for parental intuition</li>
          <li>• Always check basic needs first (hunger, diaper, sleep)</li>
          <li>• Contact your pediatrician if you're concerned about your baby's crying</li>
        </ul>
      </div>
    </div>
  );
} 