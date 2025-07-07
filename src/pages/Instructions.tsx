import React from 'react';

const Instructions = () => {
  return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">How to Use BabySleep AI</h1>
        <p className="mb-4">BabySleep AI is your all-in-one solution for understanding and improving your baby's sleep. Our AI-powered tools provide real-time monitoring, expert guidance, and personalized insights to help your little one (and you!) get the rest you deserve.</p>
        <h2 className="text-2xl font-bold mb-2">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold">Sleep Monitor</h3>
            <p>Real-time AI monitoring with safety alerts. Get notified instantly of any potential issues.</p>
            <p><strong>How to use:</strong> Connect a compatible baby monitor and let our AI analyze your baby's sleep patterns.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Consultant</h3>
            <p>24/7 expert sleep guidance. Chat with our AI consultant for personalized advice and support.</p>
            <p><strong>How to use:</strong> Access the AI Chatbot feature and ask any questions you have about your baby's sleep.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Sleep Sounds</h3>
            <p>Soothing sounds and lullabies. Create a calming environment with our curated collection of sleep sounds.</p>
            <p><strong>How to use:</strong> Choose from a variety of sounds and lullabies to help your baby drift off to sleep.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Cry Analyzer</h3>
            <p>AI-powered cry interpretation. Understand what your baby's cries mean with our advanced cry analysis technology.</p>
            <p><strong>How to use:</strong> Record your baby's cries and let our AI analyze them to identify potential needs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Baby Tracker</h3>
            <p>Comprehensive activity tracking. Keep track of your baby's sleep, feedings, and other activities.</p>
            <p><strong>How to use:</strong> Log your baby's activities throughout the day to gain valuable insights into their routines.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Growth Tracker</h3>
            <p>Monitor development milestones. Track your baby's growth and development milestones.</p>
            <p><strong>How to use:</strong> Record your baby's measurements and milestones to monitor their progress.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Sleep Analytics</h3>
            <p>Advanced pattern analysis. Identify trends and patterns in your baby's sleep.</p>
            <p><strong>How to use:</strong> View detailed reports and visualizations of your baby's sleep data.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Parent Information</h3>
            <p>Expert guidance and resources. Access a library of articles and resources on baby sleep.</p>
            <p><strong>How to use:</strong> Browse our collection of expert advice and tips on baby sleep.</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
        <p>1. Sign up for a free account at <a href="https://babysleepmoon.ai/dashboard" target="_blank" rel="noopener noreferrer">https://babysleepmoon.ai/dashboard</a></p>
        <p>2. Create a profile for your baby.</p>
        <p>3. Explore the various features and tools to start understanding and improving your baby's sleep.</p>
      </div>
  );
};

export default Instructions;