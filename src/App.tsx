import React from 'react';
import EmailForm from './components/EmailForm';
import FeatureGrid from './components/FeatureGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <h1 className="text-4xl font-bold text-orange-500 tracking-tight">UpFront</h1>
            <span className="ml-2 px-3 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-gray-400 mt-2">Client Portal for Construction Professionals</p>
          <p className="text-orange-500/90 font-medium mt-3 text-lg">
            Transparency Delivered UpFront
          </p>
        </div>

        <FeatureGrid />

        {/* Main Content */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <p className="text-xl text-orange-400/90 font-medium italic mb-4">
            Keep everything UpFront, and keep everyone happy!
          </p>
          <p className="text-gray-300 mb-6">
            Get everything up front: real-time progress tracking, centralized updates, and transparent communication.
          </p>

          <EmailForm />
        </div>
      </div>
    </div>
  );
}

export default App;