import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, Shield, Eye, Activity, Bell, Video, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface SafetyAlert {
  id: string;
  type: 'face_covered' | 'rollover' | 'cry_detected' | 'movement' | 'temperature' | 'humidity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  baby_id: string;
}

interface SleepSession {
  id: string;
  baby_id: string;
  start_time: Date;
  end_time?: Date;
  duration?: number;
  quality_score?: number;
  movements: number;
  cries_detected: number;
  safety_alerts: number;
  temperature: number;
  humidity: number;
  position_changes: number;
}

interface SleepMonitorProps {
  babyId: string;
}

export default function SleepMonitor({ babyId }: SleepMonitorProps) {
  const { user } = useAuth();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentSession, setCurrentSession] = useState<SleepSession | null>(null);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState({
    temperature: 22,
    humidity: 50,
    lightLevel: 0,
    noiseLevel: 0
  });
  const [sleepMetrics, setSleepMetrics] = useState({
    totalSleep: 0,
    deepSleep: 0,
    lightSleep: 0,
    wakeTime: 0,
    movements: 0,
    positionChanges: 0
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // AI Detection Functions
  const detectFaceCovered = async (imageData: ImageData) => {
    // Simulate AI face detection
    const hasFace = Math.random() > 0.1; // 90% chance face is visible
    const isCovered = Math.random() > 0.95; // 5% chance face is covered
    
    if (isCovered) {
      createAlert('face_covered', 'critical', 'Baby\'s face appears to be covered!');
    }
    
    return { hasFace, isCovered };
  };

  const detectRollover = async (imageData: ImageData) => {
    // Simulate position detection
    const positions = ['back', 'side', 'tummy'];
    const currentPosition = positions[Math.floor(Math.random() * positions.length)];
    const isUnsafe = currentPosition === 'tummy' && Math.random() > 0.8;
    
    if (isUnsafe) {
      createAlert('rollover', 'high', 'Baby has rolled to tummy position!');
    }
    
    return { position: currentPosition, isUnsafe };
  };

  const detectCrying = async (audioData: Float32Array) => {
    // Simulate cry detection using audio analysis
    const averageVolume = audioData.reduce((sum, value) => sum + Math.abs(value), 0) / audioData.length;
    const isCrying = averageVolume > 0.3; // Threshold for cry detection
    
    if (isCrying) {
      createAlert('cry_detected', 'medium', 'Baby is crying - attention needed');
    }
    
    return { isCrying, volume: averageVolume };
  };

  const createAlert = (type: SafetyAlert['type'], severity: SafetyAlert['severity'], message: string) => {
    const newAlert: SafetyAlert = {
      id: Date.now().toString(),
      type,
      severity,
      message,
      timestamp: new Date(),
      resolved: false,
      baby_id: babyId
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Send notification
    if (Notification.permission === 'granted') {
      new Notification('BabySleep Alert', {
        body: message,
        icon: '/favicon.png',
        tag: newAlert.id
      });
    }
    
    // Play alert sound for critical alerts
    if (severity === 'critical') {
      playAlertSound();
    }
  };

  const playAlertSound = () => {
    const audio = new Audio('/alert-sound.mp3'); // You'll need to add this sound file
    audio.play().catch(console.error);
  };

  const startMonitoring = async () => {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      setVideoStream(stream);
      setAudioStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      setIsMonitoring(true);
      startSleepSession();
      startEnvironmentalMonitoring();
      startAIDetection();

    } catch (error) {
      console.error('Error starting monitoring:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopMonitoring = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsMonitoring(false);
    endSleepSession();
  };

  const startSleepSession = () => {
    const session: SleepSession = {
      id: Date.now().toString(),
      baby_id: babyId,
      start_time: new Date(),
      movements: 0,
      cries_detected: 0,
      safety_alerts: 0,
      temperature: environmentalData.temperature,
      humidity: environmentalData.humidity,
      position_changes: 0
    };
    setCurrentSession(session);
  };

  const endSleepSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const duration = (endTime.getTime() - currentSession.start_time.getTime()) / (1000 * 60); // minutes
      
      const updatedSession = {
        ...currentSession,
        end_time: endTime,
        duration
      };
      
      setCurrentSession(updatedSession);
      saveSleepSession(updatedSession);
    }
  };

  const saveSleepSession = async (session: SleepSession) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('sleep_sessions')
        .insert([{
          baby_id: session.baby_id,
          user_id: user.id,
          start_time: session.start_time.toISOString(),
          end_time: session.end_time?.toISOString(),
          duration: session.duration,
          quality_score: calculateQualityScore(session),
          movements: session.movements,
          cries_detected: session.cries_detected,
          safety_alerts: session.safety_alerts,
          temperature: session.temperature,
          humidity: session.humidity,
          position_changes: session.position_changes
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving sleep session:', error);
    }
  };

  const calculateQualityScore = (session: SleepSession): number => {
    // Calculate sleep quality based on various factors
    let score = 100;
    
    // Deduct points for safety alerts
    score -= session.safety_alerts * 10;
    
    // Deduct points for excessive crying
    score -= session.cries_detected * 5;
    
    // Deduct points for too many movements
    score -= Math.min(session.movements * 2, 20);
    
    // Bonus for good environmental conditions
    if (session.temperature >= 18 && session.temperature <= 22) score += 10;
    if (session.humidity >= 40 && session.humidity <= 60) score += 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const startEnvironmentalMonitoring = () => {
    const interval = setInterval(() => {
      // Simulate environmental sensor readings
      setEnvironmentalData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: prev.humidity + (Math.random() - 0.5) * 5,
        lightLevel: Math.random() * 100,
        noiseLevel: Math.random() * 100
      }));
    }, 5000);

    return () => clearInterval(interval);
  };

  const startAIDetection = () => {
    const interval = setInterval(async () => {
      if (!isMonitoring) return;

      // Simulate AI detection every 10 seconds
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Run AI detection
        await detectFaceCovered(imageData);
        await detectRollover(imageData);
      }

      // Audio analysis
      if (analyserRef.current) {
        const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getFloatTimeDomainData(dataArray);
        await detectCrying(dataArray);
      }
    }, 10000);

    return () => clearInterval(interval);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getAlertIcon = (type: SafetyAlert['type']) => {
    switch (type) {
      case 'face_covered': return <Eye className="w-5 h-5" />;
      case 'rollover': return <Activity className="w-5 h-5" />;
      case 'cry_detected': return <Mic className="w-5 h-5" />;
      case 'movement': return <Activity className="w-5 h-5" />;
      case 'temperature': return <AlertTriangle className="w-5 h-5" />;
      case 'humidity': return <AlertTriangle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      stopMonitoring();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Sleep Monitor</h1>
        <p className="text-gray-600">Real-time AI-powered sleep monitoring with safety alerts</p>
      </div>

      {/* Monitoring Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Monitoring Controls</h2>
          <div className="flex items-center gap-2">
            {isMonitoring && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                Live Monitoring
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isMonitoring
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Video Feed */}
      {isMonitoring && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Live Video Feed</h2>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg border"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              Live
            </div>
          </div>
        </div>
      )}

      {/* Environmental Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold">Temperature</h3>
          </div>
          <p className="text-2xl font-bold">{environmentalData.temperature.toFixed(1)}°C</p>
          <p className="text-sm text-gray-600">
            {environmentalData.temperature < 18 ? 'Too cold' : 
             environmentalData.temperature > 22 ? 'Too warm' : 'Optimal'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Humidity</h3>
          </div>
          <p className="text-2xl font-bold">{environmentalData.humidity.toFixed(0)}%</p>
          <p className="text-sm text-gray-600">
            {environmentalData.humidity < 40 ? 'Too dry' : 
             environmentalData.humidity > 60 ? 'Too humid' : 'Optimal'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Movements</h3>
          </div>
          <p className="text-2xl font-bold">{sleepMetrics.movements}</p>
          <p className="text-sm text-gray-600">This session</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Cries Detected</h3>
          </div>
          <p className="text-2xl font-bold">{sleepMetrics.cries_detected}</p>
          <p className="text-sm text-gray-600">This session</p>
        </div>
      </div>

      {/* Safety Alerts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Safety Alerts</h2>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No safety alerts - everything looks good!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.severity)} ${
                    alert.resolved ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <p className="font-semibold">{alert.message}</p>
                        <p className="text-sm opacity-75">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="text-sm bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Sleep Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Start Time</p>
              <p className="font-semibold">
                {currentSession.start_time.toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">
                {currentSession.duration ? `${Math.floor(currentSession.duration)}m` : 'Active'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quality Score</p>
              <p className="font-semibold">
                {calculateQualityScore(currentSession)}/100
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 