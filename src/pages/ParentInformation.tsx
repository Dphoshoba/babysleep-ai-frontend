import React from 'react';

const ParentInformation = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Parent Information</h1>
      <p className="mb-4">Explore key features to support your baby's sleep and development.</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">🧠 Sleep Monitor</h2>
        <p className="mb-2">Real-time AI-powered monitoring with instant safety alerts.</p>
        <p className="mb-4"><strong>How to use:</strong> Connect your baby monitor and let AI detect patterns or disruptions.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">💬 AI Consultant</h2>
        <p className="mb-2">24/7 intelligent support for sleep questions, regressions, or routines.</p>
        <p className="mb-4"><strong>How to use:</strong> Ask questions directly via the in-app chatbot.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">🎶 Sleep Sounds</h2>
        <p className="mb-2">Soothing lullabies and white noise to calm your baby.</p>
        <p className="mb-4"><strong>How to use:</strong> Pick from our curated sleep sound library.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">😢 Cry Analyzer</h2>
        <p className="mb-2">Understand your baby's cries using advanced sound analysis.</p>
        <p className="mb-4"><strong>How to use:</strong> Record and submit a cry — our AI deciphers its likely cause.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">📊 Baby Tracker</h2>
        <p className="mb-2">Track sleep, feedings, diaper changes, and more.</p>
        <p className="mb-4"><strong>How to use:</strong> Log daily activities for pattern insights.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">📏 Growth Tracker</h2>
        <p className="mb-2">Monitor key milestones and growth over time.</p>
        <p className="mb-4"><strong>How to use:</strong> Enter measurements and milestones to follow development.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">📈 Sleep Analytics</h2>
        <p className="mb-2">Visualize patterns and get actionable insights on sleep behavior.</p>
        <p className="mb-4"><strong>How to use:</strong> Review beautiful charts and summaries of your baby's sleep.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">📚 Parent Info Hub</h2>
        <p className="mb-2">Expert-vetted tips, guides, and sleep science articles.</p>
      </section>
    </div>
  );
};

export default ParentInformation;