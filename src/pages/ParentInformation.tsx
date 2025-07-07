import React from 'react';

const ParentInformation = () => {
  return (
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Parent Information</h1>
        <p className="mb-4">Welcome to the Parent Information page! Here, you'll find expert guidance and resources to help you understand and support your baby's sleep.</p>
        
        <h2 className="text-2xl font-bold mb-2">Understanding Baby Sleep</h2>
        <p className="mb-4">Learn about the different stages of baby sleep, common sleep challenges, and how to create a healthy sleep environment.</p>

        <h2 className="text-2xl font-bold mb-2">Creating a Sleep Schedule</h2>
        <p className="mb-4">Discover tips and strategies for establishing a consistent sleep schedule that works for your baby and your family.</p>

        <h2 className="text-2xl font-bold mb-2">Soothing Techniques</h2>
        <p className="mb-4">Explore various soothing techniques, such as swaddling, white noise, and gentle rocking, to help your baby fall asleep and stay asleep.</p>

        <h2 className="text-2xl font-bold mb-2">Addressing Sleep Challenges</h2>
        <p className="mb-4">Find solutions to common sleep challenges, such as frequent night wakings, difficulty falling asleep, and early morning awakenings.</p>

        <h2 className="text-2xl font-bold mb-2">Additional Resources</h2>
        <ul>
          <li><a href="https://www.babysleepsite.com/baby-sleep-patterns/">Understanding Baby Sleep Cycles</a></li>
          <li><a href="https://www.sleepfoundation.org/children-and-sleep/bedtime-routine-for-kids">Creating a Bedtime Routine</a></li>
          <li><a href="https://www.happiestbaby.com/blogs/baby/the-5-s-s-for-soothing-babies">Soothing Techniques for Babies</a></li>
        </ul>
      </div>
  );
};

export default ParentInformation;