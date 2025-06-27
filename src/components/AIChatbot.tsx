import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Lightbulb, Clock, Baby, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  ageGroup?: string;
}

interface SleepGuideline {
  ageGroup: string;
  totalSleep: string;
  nightSleep: string;
  naps: string;
  napDuration: string;
  wakeWindows: string;
  tips: string[];
}

interface AIChatbotProps {
  babyId?: string;
  babyAge?: number; // in months
}

export default function AIChatbot({ babyId, babyAge }: AIChatbotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sleepGuidelines: SleepGuideline[] = [
    {
      ageGroup: 'Newborn (0-2 months)',
      totalSleep: '15.5-16 hours',
      nightSleep: '8-9 hours',
      naps: '4-5 naps',
      napDuration: '30 min – 2 hours',
      wakeWindows: '45-60 minutes',
      tips: [
        'Feed on demand every 2-3 hours',
        'Keep baby close for comfort',
        'Swaddle for security',
        'White noise helps with sleep',
        'Day/night confusion is normal'
      ]
    },
    {
      ageGroup: '3-5 months',
      totalSleep: '14.5-15 hours',
      nightSleep: '9-10 hours',
      naps: '3-4 naps',
      napDuration: '1-2 hours',
      wakeWindows: '1.5-2.5 hours',
      tips: [
        'Start establishing bedtime routine',
        'Introduce consistent nap times',
        'Watch for sleep cues (rubbing eyes, yawning)',
        'Consider sleep training methods',
        'Keep room dark and quiet'
      ]
    },
    {
      ageGroup: '6-8 months',
      totalSleep: '14 hours',
      nightSleep: '10-11 hours',
      naps: '2-3 naps',
      napDuration: '1-2 hours',
      wakeWindows: '2-3 hours',
      tips: [
        'Solid bedtime routine is crucial',
        'Separation anxiety may affect sleep',
        'Consider dropping third nap',
        'Consistent wake-up time',
        'Self-soothing skills development'
      ]
    },
    {
      ageGroup: '9-12 months',
      totalSleep: '13-14 hours',
      nightSleep: '11-12 hours',
      naps: '2 naps',
      napDuration: '1-2 hours',
      wakeWindows: '3-4 hours',
      tips: [
        'Two-nap schedule is typical',
        'Separation anxiety peaks',
        'Consistent routine is key',
        'Limit screen time before bed',
        'Comfort object can help'
      ]
    },
    {
      ageGroup: '1-2 years',
      totalSleep: '11-14 hours',
      nightSleep: '10-12 hours',
      naps: '1-2 naps',
      napDuration: '1-2 hours',
      wakeWindows: '4-6 hours',
      tips: [
        'Transition to one nap around 15-18 months',
        'Set clear boundaries',
        'Consistent bedtime routine',
        'Limit caffeine and sugar',
        'Create a calm environment'
      ]
    },
    {
      ageGroup: '3-5 years',
      totalSleep: '10-13 hours',
      nightSleep: '10-12 hours',
      naps: '0-1 nap',
      napDuration: '~1 hour',
      wakeWindows: '6-8 hours',
      tips: [
        'Most children drop naps by age 4',
        'Establish bedtime routine',
        'Limit screen time',
        'Create a sleep-friendly environment',
        'Address fears and anxieties'
      ]
    }
  ];

  const quickTopics = [
    { id: 'sleep-schedule', label: 'Sleep Schedule', icon: <Clock className="w-4 h-4" /> },
    { id: 'nap-transition', label: 'Nap Transitions', icon: <Baby className="w-4 h-4" /> },
    { id: 'sleep-training', label: 'Sleep Training', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'night-waking', label: 'Night Waking', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'bedtime-routine', label: 'Bedtime Routine', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'age-guidelines', label: 'Age Guidelines', icon: <Bot className="w-4 h-4" /> }
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: `Hello! I'm your AI sleep consultant, trained by top pediatric sleep experts. I'm here to help you with your baby's sleep journey. 

I can provide:
• Age-appropriate sleep guidelines
• Personalized sleep advice
• Sleep training strategies
• Troubleshooting common issues
• Bedtime routine suggestions

How can I help you today?`,
      timestamp: new Date(),
      suggestions: ['Sleep Schedule', 'Nap Transitions', 'Sleep Training', 'Night Waking']
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAgeGroup = (ageInMonths: number): SleepGuideline => {
    if (ageInMonths <= 2) return sleepGuidelines[0];
    if (ageInMonths <= 5) return sleepGuidelines[1];
    if (ageInMonths <= 8) return sleepGuidelines[2];
    if (ageInMonths <= 12) return sleepGuidelines[3];
    if (ageInMonths <= 24) return sleepGuidelines[4];
    return sleepGuidelines[5];
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    const ageGroup = babyAge ? getAgeGroup(babyAge) : null;

    // Handle specific topics
    if (lowerMessage.includes('schedule') || lowerMessage.includes('routine')) {
      if (ageGroup) {
        return `Based on your baby's age (${babyAge} months), here's the recommended sleep schedule:

**${ageGroup.ageGroup} Guidelines:**
• Total Sleep: ${ageGroup.totalSleep}
• Night Sleep: ${ageGroup.nightSleep}
• Naps: ${ageGroup.naps}
• Nap Duration: ${ageGroup.napDuration}
• Wake Windows: ${ageGroup.wakeWindows}

**Key Tips:**
${ageGroup.tips.map(tip => `• ${tip}`).join('\n')}

Would you like me to help you create a personalized schedule for your baby?`;
      }
      return "I'd be happy to help with sleep schedules! Could you tell me your baby's age so I can provide age-appropriate recommendations?";
    }

    if (lowerMessage.includes('nap') || lowerMessage.includes('transition')) {
      if (ageGroup) {
        return `For ${ageGroup.ageGroup}, nap transitions typically happen around these milestones:

**Current Stage:** ${ageGroup.naps}
**Nap Duration:** ${ageGroup.napDuration}

**Transition Signs to Watch For:**
• Fighting naps
• Taking longer to fall asleep
• Waking up early from naps
• Difficulty falling asleep at bedtime

**Tips for Smooth Transitions:**
• Make changes gradually (15-30 minutes at a time)
• Keep consistent wake-up times
• Watch for sleep cues
• Be patient - transitions can take 1-2 weeks

Would you like specific guidance for your baby's current nap situation?`;
      }
      return "I can help with nap transitions! What's your baby's age and current nap schedule?";
    }

    if (lowerMessage.includes('training') || lowerMessage.includes('cry')) {
      return `Sleep training is a personal decision that should be made when you and your baby are ready. Here are some gentle approaches:

**Gentle Sleep Training Methods:**
• **Pick Up, Put Down**: Pick up when crying, put down when calm
• **Fading**: Gradually reduce your presence
• **Camping Out**: Sit near crib, gradually move away
• **Ferber Method**: Progressive waiting with check-ins

**When to Start:**
• Baby is 4-6 months old
• Baby is healthy and gaining weight
• You're ready for consistency
• Baby shows signs of readiness

**Important Notes:**
• Always consult your pediatrician first
• Choose a method that feels right for your family
• Be consistent for at least 1-2 weeks
• Trust your instincts

Would you like me to explain any of these methods in detail?`;
    }

    if (lowerMessage.includes('wake') || lowerMessage.includes('night')) {
      return `Night waking is completely normal and expected! Here's what you should know:

**Common Causes:**
• Hunger (especially under 6 months)
• Developmental milestones
• Teething
• Illness
• Separation anxiety
• Sleep associations

**Age-Appropriate Expectations:**
• 0-3 months: 2-4 feedings per night
• 3-6 months: 1-3 feedings per night
• 6-12 months: 0-2 feedings per night
• 12+ months: Usually 0-1 feedings

**Strategies:**
• Rule out medical issues first
• Check for hunger, discomfort, or illness
• Consider sleep associations
• Gradual night weaning (after 6 months)
• Consistent bedtime routine

What's your baby's age and current night waking pattern?`;
    }

    if (lowerMessage.includes('routine') || lowerMessage.includes('bedtime')) {
      return `A consistent bedtime routine is crucial for good sleep! Here's a recommended structure:

**Sample Bedtime Routine (30-45 minutes):**
1. **Bath time** (5-10 minutes)
2. **Massage** (5 minutes)
3. **Pajamas and diaper change**
4. **Feeding** (if applicable)
5. **Reading books** (5-10 minutes)
6. **Lullaby or white noise**
7. **Kisses and goodnight**

**Key Principles:**
• Keep it consistent every night
• Start at the same time
• Make it calming and predictable
• Avoid screens 1 hour before bed
• Keep it age-appropriate

**Age Adjustments:**
• Newborns: Shorter, simpler routine
• 3-6 months: Add more structure
• 6+ months: Include reading and songs

Would you like help creating a personalized routine for your baby?`;
    }

    if (lowerMessage.includes('age') || lowerMessage.includes('guideline')) {
      if (ageGroup) {
        return `Here are the sleep guidelines for your ${babyAge}-month-old baby:

**${ageGroup.ageGroup} Sleep Requirements:**
• Total Sleep: ${ageGroup.totalSleep}
• Night Sleep: ${ageGroup.nightSleep}
• Naps: ${ageGroup.naps}
• Nap Duration: ${ageGroup.napDuration}
• Wake Windows: ${ageGroup.wakeWindows}

**Development Milestones:**
• Sleep patterns becoming more regular
• Longer stretches of night sleep
• More predictable nap times
• Developing self-soothing skills

**Expert Tips:**
${ageGroup.tips.map(tip => `• ${tip}`).join('\n')}

Is there a specific aspect of your baby's sleep you'd like to discuss?`;
      }
      return "I'd love to provide age-specific sleep guidelines! Could you tell me your baby's age in months?";
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Let me help you with that!

I can provide guidance on:
• Sleep schedules and routines
• Nap transitions and timing
• Sleep training methods
• Night waking solutions
• Age-appropriate guidelines
• Developmental milestones

Could you tell me your baby's age and what specific sleep challenge you're facing? This will help me give you the most relevant advice.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await generateResponse(input);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
      suggestions: ['More Help', 'Sleep Schedule', 'Age Guidelines', 'Sleep Training']
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    const topicMessages = {
      'sleep-schedule': 'How do I create a good sleep schedule?',
      'nap-transition': 'When should my baby transition naps?',
      'sleep-training': 'What sleep training methods are recommended?',
      'night-waking': 'How do I handle night waking?',
      'bedtime-routine': 'What should our bedtime routine look like?',
      'age-guidelines': 'What are the sleep guidelines for my baby\'s age?'
    };
    
    setInput(topicMessages[topicId as keyof typeof topicMessages] || '');
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">AI Sleep Consultant</h1>
        <p className="text-gray-600">Expert-trained AI chatbot for personalized sleep guidance</p>
      </div>

      {/* Quick Topics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleQuickTopic(topic.id)}
              className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                selectedTopic === topic.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              {topic.icon}
              <span className="text-sm">{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Chat with AI Consultant</h2>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestion(suggestion)}
                              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  </div>
                  <p className="text-xs opacity-75 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your baby's sleep..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Age Guidelines Summary */}
      {babyAge && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Age-Specific Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sleepGuidelines.map((guideline) => (
              <div
                key={guideline.ageGroup}
                className={`p-3 rounded border ${
                  getAgeGroup(babyAge).ageGroup === guideline.ageGroup
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h4 className="font-semibold text-sm">{guideline.ageGroup}</h4>
                <p className="text-xs text-gray-600">
                  Sleep: {guideline.totalSleep} | Naps: {guideline.naps}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 