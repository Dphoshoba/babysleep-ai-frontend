import React from 'react';

const ReferralRewards = () => {
  return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">👶✨ BabySleep AI Referral Rewards Program</h1>
        <p className="mb-4">🌟 Program Name: Sleep & Share Rewards</p>
        <p className="mb-4">💬 Tagline: “Help another parent sleep better — and get rewarded!”</p>
        <h2 className="text-2xl font-bold mb-2">🏆 How It Works:</h2>
        <p className="mb-4">Invite your friends to join BabySleep AI using your unique referral link. When they sign up and start using the app, you both get free rewards!</p>
        <h2 className="text-2xl font-bold mb-2">🎁 Rewards Structure:</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">👥 Referrals</th>
              <th className="px-4 py-2">🎉 Reward for You</th>
              <th className="px-4 py-2">🎉 Reward for Them</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1 Friend</td>
              <td className="border px-4 py-2">+7 days Premium</td>
              <td className="border px-4 py-2">+7 days Premium</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">3 Friends</td>
              <td className="border px-4 py-2">+30 days Premium</td>
              <td className="border px-4 py-2">+7 days Premium</td>
            </tr>
          </tbody>
        </table>
        <h2 className="text-2xl font-bold mb-2">🧠 Premium Includes:</h2>
          AI Cry Analyzer
          Full Sleep Reports & Trends
          Unlimited AI Chat Consultations
          Premium Soothing Sound Library
          Multiple Baby Profiles
          Growth Milestone Tracking
          Advanced Notifications & Tips
        
        <h2 className="text-2xl font-bold mb-2">🚀 How to Share:</h2>
          Go to the Referral tab in the app
          Copy your unique link or share via WhatsApp, Messenger, Email, or social media
          Get notified when friends join and your rewards are unlocked!
        
        <h2 className="text-2xl font-bold mb-2">🔐 Terms:</h2>
          Rewards are unlocked once referred users create a baby profile and log sleep data at least once
          Multiple rewards stack!
          Abuse or fake accounts will result in disqualification
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">[Invite Friends & Earn Rewards]</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">[View My Rewards]</button>
        </div>
      </div>
  );
};

export default ReferralRewards;
